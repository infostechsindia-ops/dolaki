import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SupportTicket,
  SupportTicketMessage,
  SupportTicketAttachment,
  SupportTicketAuditLog,
  Order,
  Refund,
  ReturnRequest,
  User,
} from '../database/entities';

export class CreateTicketDTO {
  category:
    | 'ORDER'
    | 'DELIVERY'
    | 'PAYMENT'
    | 'REFUND'
    | 'RETURN'
    | 'PRODUCT'
    | 'ACCOUNT'
    | 'QUICK_COMMERCE'
    | 'TECHNICAL'
    | 'OTHER';
  subject: string;
  description: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  orderId?: string;
  refundId?: string;
  returnRequestId?: string;
}

export class AdminTicketFilterDTO {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  assignedAgentId?: string;
  search?: string;
}

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepo: Repository<SupportTicket>,
    @InjectRepository(SupportTicketMessage)
    private readonly messageRepo: Repository<SupportTicketMessage>,
    @InjectRepository(SupportTicketAttachment)
    private readonly attachmentRepo: Repository<SupportTicketAttachment>,
    @InjectRepository(SupportTicketAuditLog)
    private readonly auditRepo: Repository<SupportTicketAuditLog>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Refund)
    private readonly refundRepo: Repository<Refund>,
    @InjectRepository(ReturnRequest)
    private readonly returnRepo: Repository<ReturnRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Strips characters that could enable XSS or HTML-injection in rendered output.
   * Applied to all user-supplied free-text fields (subject, description, message).
   */
  private sanitizeText(input: string, maxLength = 5000): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim()
      .slice(0, maxLength);
  }

  private async generateTicketNumber(): Promise<string> {
    for (let attempts = 0; attempts < 10; attempts++) {
      const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
      const num = `SUP-2026-${randomDigits}`;
      const existing = await this.ticketRepo.findOne({ where: { ticketNumber: num } });
      if (!existing) return num;
    }
    return `SUP-2026-${Date.now().toString().slice(-6)}`;
  }

  private async logAudit(
    ticketId: string,
    actorId: string,
    actorRole: string,
    action: string,
    details?: any,
  ): Promise<void> {
    await this.auditRepo.save(
      this.auditRepo.create({
        ticketId,
        actorId,
        actorRole,
        action,
        detailsJson: details ? JSON.stringify(details) : null,
      }),
    );
  }

  // ── Customer Operations ───────────────────────────────────────────────────

  async createTicket(user: any, dto: CreateTicketDTO): Promise<SupportTicket> {
    if (!dto.subject || dto.subject.trim().length === 0) {
      throw new BadRequestException('Ticket subject is mandatory');
    }
    if (!dto.description || dto.description.trim().length === 0) {
      throw new BadRequestException('Ticket description is mandatory');
    }

    // IDOR Protection: Verify ownership of linked order if provided
    if (dto.orderId) {
      const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
      if (!order) {
        throw new NotFoundException(`Linked order ${dto.orderId} not found`);
      }
      if (order.customerId !== user.userId) {
        throw new ForbiddenException(
          'FORBIDDEN_LINKED_RESOURCE: You cannot link an order belonging to another customer',
        );
      }
    }

    // IDOR Protection: Verify ownership of linked refund if provided
    if (dto.refundId) {
      const refund = await this.refundRepo.findOne({ where: { id: dto.refundId } });
      if (!refund) {
        throw new NotFoundException(`Linked refund ${dto.refundId} not found`);
      }
      if (refund.customerId && refund.customerId !== user.userId) {
        throw new ForbiddenException(
          'FORBIDDEN_LINKED_RESOURCE: You cannot link a refund belonging to another customer',
        );
      }
    }

    // IDOR Protection: Verify ownership of linked return request if provided
    if (dto.returnRequestId) {
      const ret = await this.returnRepo.findOne({ where: { id: dto.returnRequestId } });
      if (!ret) {
        throw new NotFoundException(`Linked return request ${dto.returnRequestId} not found`);
      }
      if (ret.customerId && ret.customerId !== user.userId) {
        throw new ForbiddenException(
          'FORBIDDEN_LINKED_RESOURCE: You cannot link a return request belonging to another customer',
        );
      }
    }

    const ticketNumber = await this.generateTicketNumber();

    // Priority policy: Customer priority defaults to NORMAL unless LOW/HIGH requested (URGENT restricted to admin)
    let priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' = 'NORMAL';
    if (dto.priority && dto.priority !== 'URGENT') {
      priority = dto.priority;
    }

    // Sanitize free-text fields before persisting to prevent stored XSS
    const safeSubject = this.sanitizeText(dto.subject, 200);
    const safeDescription = this.sanitizeText(dto.description, 5000);

    const ticket = this.ticketRepo.create({
      ticketNumber,
      customerId: user.userId,
      customerName: user.name || user.email || 'Customer',
      customerEmail: user.email || '',
      category: dto.category || 'OTHER',
      subject: safeSubject,
      description: safeDescription,
      priority,
      status: 'OPEN',
      orderId: dto.orderId || null,
      refundId: dto.refundId || null,
      returnRequestId: dto.returnRequestId || null,
    });

    const savedTicket = await this.ticketRepo.save(ticket);

    // Save initial description as first customer message
    await this.messageRepo.save(
      this.messageRepo.create({
        ticketId: savedTicket.id,
        senderUserId: user.userId,
        senderName: user.name || user.email || 'Customer',
        senderRole: 'CUSTOMER',
        message: safeDescription,
        isInternalNote: false,
      }),
    );

    await this.logAudit(savedTicket.id, user.userId, user.role || 'CUSTOMER', 'TICKET_CREATED', {
      ticketNumber: savedTicket.ticketNumber,
      category: savedTicket.category,
    });

    return savedTicket;
  }

  async getCustomerTickets(
    user: any,
    query: { page?: number; limit?: number; status?: string; category?: string },
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const whereClause: any = { customerId: user.userId };
    if (query.status) whereClause.status = query.status;
    if (query.category) whereClause.category = query.category;

    const [items, total] = await this.ticketRepo.findAndCount({
      where: whereClause,
      order: { updatedAt: 'DESC' },
      take: limit,
      skip,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCustomerTicketById(user: any, ticketId: string) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Support ticket ${ticketId} not found`);
    }

    // IDOR Protection: Strictly check ticket ownership
    if (ticket.customerId !== user.userId) {
      throw new ForbiddenException(
        'FORBIDDEN_TICKET_ACCESS: You do not have permission to view this ticket',
      );
    }

    // CRITICAL: Filter out internal notes for customer view!
    const messages = await this.messageRepo.find({
      where: { ticketId, isInternalNote: false },
      order: { createdAt: 'ASC' },
    });

    const attachments = await this.attachmentRepo.find({
      where: { ticketId },
      order: { createdAt: 'ASC' },
    });

    let orderInfo: any = null;
    if (ticket.orderId) {
      const order = await this.orderRepo.findOne({ where: { id: ticket.orderId } });
      if (order) {
        orderInfo = {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          totalAmountMinor: order.totalAmountMinor,
          createdAt: order.createdAt,
        };
      }
    }

    return {
      ticket,
      messages,
      attachments,
      linkedOrder: orderInfo,
    };
  }

  async addCustomerReply(user: any, ticketId: string, messageText: string) {
    if (!messageText || messageText.trim().length === 0) {
      throw new BadRequestException('Message content cannot be empty');
    }

    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Support ticket ${ticketId} not found`);
    }

    // IDOR Protection
    if (ticket.customerId !== user.userId) {
      throw new ForbiddenException(
        'FORBIDDEN_TICKET_ACCESS: You do not have permission to reply to this ticket',
      );
    }

    if (ticket.status === 'CLOSED') {
      throw new BadRequestException('TICKET_CLOSED: Cannot reply to a permanently closed ticket');
    }

    // Reopening Policy: Reopen RESOLVED ticket if customer replies
    if (ticket.status === 'RESOLVED') {
      ticket.status = 'OPEN';
      await this.logAudit(ticket.id, user.userId, user.role || 'CUSTOMER', 'TICKET_REOPENED', {
        previousStatus: 'RESOLVED',
        newStatus: 'OPEN',
      });
    } else if (ticket.status === 'WAITING_FOR_CUSTOMER') {
      ticket.status = 'IN_PROGRESS';
    }

    ticket.lastCustomerReplyAt = new Date();
    await this.ticketRepo.save(ticket);

    // Sanitize customer reply before persisting to prevent stored XSS
    const safeMessage = this.sanitizeText(messageText, 5000);

    const message = await this.messageRepo.save(
      this.messageRepo.create({
        ticketId: ticket.id,
        senderUserId: user.userId,
        senderName: user.name || user.email || 'Customer',
        senderRole: 'CUSTOMER',
        message: safeMessage,
        isInternalNote: false,
      }),
    );

    await this.logAudit(ticket.id, user.userId, user.role || 'CUSTOMER', 'CUSTOMER_REPLIED');

    return message;
  }

  // ── Admin / Operations Operations ─────────────────────────────────────────

  async getAdminTickets(query: AdminTicketFilterDTO) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 15));
    const skip = (page - 1) * limit;

    const queryBuilder = this.ticketRepo.createQueryBuilder('ticket');

    if (query.status) {
      queryBuilder.andWhere('ticket.status = :status', { status: query.status });
    }
    if (query.category) {
      queryBuilder.andWhere('ticket.category = :category', { category: query.category });
    }
    if (query.priority) {
      queryBuilder.andWhere('ticket.priority = :priority', { priority: query.priority });
    }
    if (query.assignedAgentId) {
      queryBuilder.andWhere('ticket.assignedAgentId = :assignedAgentId', {
        assignedAgentId: query.assignedAgentId,
      });
    }
    if (query.search) {
      queryBuilder.andWhere(
        '(ticket.ticketNumber LIKE :s OR ticket.subject LIKE :s OR ticket.customerEmail LIKE :s OR ticket.customerName LIKE :s)',
        { s: `%${query.search.trim()}%` },
      );
    }

    queryBuilder
      .orderBy(
        `CASE WHEN ticket.status IN ('OPEN', 'IN_PROGRESS') THEN 0 ELSE 1 END`,
        'ASC',
      )
      .addOrderBy('ticket.updatedAt', 'DESC')
      .take(limit)
      .skip(skip);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAdminTicketById(user: any, ticketId: string) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Support ticket ${ticketId} not found`);
    }

    // Admin view includes ALL messages including internal notes
    const messages = await this.messageRepo.find({
      where: { ticketId },
      order: { createdAt: 'ASC' },
    });

    const attachments = await this.attachmentRepo.find({
      where: { ticketId },
      order: { createdAt: 'ASC' },
    });

    const auditLogs = await this.auditRepo.find({
      where: { ticketId },
      order: { createdAt: 'DESC' },
    });

    let order: any = null;
    if (ticket.orderId) {
      order = await this.orderRepo.findOne({ where: { id: ticket.orderId } });
    }

    let refund: any = null;
    if (ticket.refundId) {
      refund = await this.refundRepo.findOne({ where: { id: ticket.refundId } });
    }

    let returnRequest: any = null;
    if (ticket.returnRequestId) {
      returnRequest = await this.returnRepo.findOne({ where: { id: ticket.returnRequestId } });
    }

    return {
      ticket,
      messages,
      attachments,
      auditLogs,
      context: {
        order,
        refund,
        returnRequest,
      },
    };
  }

  async assignAgent(
    actorUser: any,
    ticketId: string,
    dto: { agentId: string; agentName?: string },
  ) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Support ticket ${ticketId} not found`);
    }

    // Verify target agent exists and has appropriate role
    const agentUser = await this.userRepo.findOne({ where: { id: dto.agentId } });
    if (!agentUser) {
      throw new NotFoundException(`Agent user ${dto.agentId} not found`);
    }

    const allowedRoles = ['SUPER_ADMIN', 'OPERATIONS', 'SUPPORT', 'CATALOG_ADMIN'];
    if (!allowedRoles.includes(agentUser.role)) {
      throw new BadRequestException(
        `INVALID_AGENT_ROLE: User role ${agentUser.role} is not eligible for support agent assignment`,
      );
    }

    ticket.assignedAgentId = agentUser.id;
    ticket.assignedAgentName = dto.agentName || agentUser.fullName || agentUser.email;
    if (ticket.status === 'OPEN') {
      ticket.status = 'IN_PROGRESS';
    }

    const updated = await this.ticketRepo.save(ticket);

    await this.logAudit(ticket.id, actorUser.userId, actorUser.role, 'TICKET_ASSIGNED', {
      assignedAgentId: agentUser.id,
      assignedAgentName: ticket.assignedAgentName,
    });

    return updated;
  }

  async updateStatus(
    actorUser: any,
    ticketId: string,
    dto: { status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED' },
  ) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Support ticket ${ticketId} not found`);
    }

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'];
    if (!validStatuses.includes(dto.status)) {
      throw new BadRequestException(`Invalid ticket status: ${dto.status}`);
    }

    const oldStatus = ticket.status;
    ticket.status = dto.status;

    if (dto.status === 'RESOLVED') {
      ticket.resolvedAt = new Date();
    } else if (dto.status === 'CLOSED') {
      ticket.closedAt = new Date();
    }

    const updated = await this.ticketRepo.save(ticket);

    await this.logAudit(ticket.id, actorUser.userId, actorUser.role, 'STATUS_CHANGED', {
      oldStatus,
      newStatus: dto.status,
    });

    return updated;
  }

  async updatePriority(
    actorUser: any,
    ticketId: string,
    dto: { priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' },
  ) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Support ticket ${ticketId} not found`);
    }

    const validPriorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
    if (!validPriorities.includes(dto.priority)) {
      throw new BadRequestException(`Invalid priority value: ${dto.priority}`);
    }

    const oldPriority = ticket.priority;
    ticket.priority = dto.priority;
    const updated = await this.ticketRepo.save(ticket);

    await this.logAudit(ticket.id, actorUser.userId, actorUser.role, 'PRIORITY_CHANGED', {
      oldPriority,
      newPriority: dto.priority,
    });

    return updated;
  }

  async addAdminReply(
    actorUser: any,
    ticketId: string,
    dto: { message: string; isInternalNote?: boolean },
  ) {
    if (!dto.message || dto.message.trim().length === 0) {
      throw new BadRequestException('Reply message cannot be empty');
    }

    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Support ticket ${ticketId} not found`);
    }

    const isInternal = Boolean(dto.isInternalNote);

    const message = await this.messageRepo.save(
      this.messageRepo.create({
        ticketId: ticket.id,
        senderUserId: actorUser.userId,
        senderName: actorUser.name || actorUser.email || 'Support Agent',
        senderRole: actorUser.role || 'SUPPORT_AGENT',
        message: dto.message.trim(),
        isInternalNote: isInternal,
      }),
    );

    if (!isInternal) {
      ticket.lastAgentReplyAt = new Date();
      if (ticket.status === 'OPEN') {
        ticket.status = 'IN_PROGRESS';
      }
      await this.ticketRepo.save(ticket);
      await this.logAudit(ticket.id, actorUser.userId, actorUser.role, 'AGENT_REPLIED');
    } else {
      await this.logAudit(ticket.id, actorUser.userId, actorUser.role, 'INTERNAL_NOTE_ADDED');
    }

    return message;
  }
}
