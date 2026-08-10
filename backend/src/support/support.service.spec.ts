import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SupportService } from './support.service';
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

describe('SupportService — FEAT-001 Customer Support System Tests', () => {
  let service: SupportService;

  let ticketRepo: any;
  let messageRepo: any;
  let attachmentRepo: any;
  let auditRepo: any;
  let orderRepo: any;
  let refundRepo: any;
  let returnRepo: any;
  let userRepo: any;

  const mockCustomerUser = {
    userId: 'cust-101',
    email: 'customer1@auramart.com',
    role: 'CUSTOMER',
    name: 'Alice Customer',
  };

  const mockOtherCustomer = {
    userId: 'cust-202',
    email: 'customer2@auramart.com',
    role: 'CUSTOMER',
    name: 'Bob Customer',
  };

  const mockAgentUser = {
    id: 'agent-303',
    email: 'agent@auramart.com',
    role: 'SUPPORT',
    fullName: 'Sarah Agent',
  };

  const mockNonAgentUser = {
    id: 'cust-404',
    email: 'normal@auramart.com',
    role: 'CUSTOMER',
    fullName: 'Charlie Customer',
  };

  const mockOrder = {
    id: 'order-101',
    orderNumber: 'ORD-1001',
    customerId: 'cust-101',
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    grandTotalMinor: 499900,
    createdAt: new Date(),
  };

  const mockOtherOrder = {
    id: 'order-999',
    orderNumber: 'ORD-9999',
    customerId: 'cust-202',
    status: 'DELIVERED',
  };

  beforeEach(async () => {
    const ticketMap = new Map<string, any>();
    const messageList: any[] = [];
    const auditList: any[] = [];

    ticketRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.id) return Promise.resolve(ticketMap.get(where.id) || null);
        if (where.ticketNumber) {
          for (const t of ticketMap.values()) {
            if (t.ticketNumber === where.ticketNumber) return Promise.resolve(t);
          }
        }
        return Promise.resolve(null);
      }),
      findAndCount: jest.fn().mockImplementation(({ where }) => {
        let results = Array.from(ticketMap.values());
        if (where.customerId) results = results.filter((t) => t.customerId === where.customerId);
        if (where.status) results = results.filter((t) => t.status === where.status);
        if (where.category) results = results.filter((t) => t.category === where.category);
        return Promise.resolve([results, results.length]);
      }),
      create: jest.fn().mockImplementation((dto) => ({
        id: dto.id || `ticket-${Date.now()}-${Math.random().toString().slice(-4)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...dto,
      })),
      save: jest.fn().mockImplementation((t) => {
        ticketMap.set(t.id, t);
        return Promise.resolve(t);
      }),
      createQueryBuilder: jest.fn().mockImplementation(() => {
        const results = Array.from(ticketMap.values());
        return {
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          addOrderBy: jest.fn().mockReturnThis(),
          take: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          getManyAndCount: jest.fn().mockResolvedValue([results, results.length]),
        };
      }),
    };

    messageRepo = {
      find: jest.fn().mockImplementation(({ where }) => {
        let res = messageList.filter((m) => m.ticketId === where.ticketId);
        if (where.isInternalNote === false) {
          res = res.filter((m) => m.isInternalNote === false);
        }
        return Promise.resolve(res);
      }),
      create: jest.fn().mockImplementation((dto) => ({
        id: `msg-${Date.now()}-${Math.random().toString().slice(-4)}`,
        createdAt: new Date(),
        ...dto,
      })),
      save: jest.fn().mockImplementation((m) => {
        messageList.push(m);
        return Promise.resolve(m);
      }),
    };

    attachmentRepo = {
      find: jest.fn().mockResolvedValue([]),
    };

    auditRepo = {
      find: jest.fn().mockImplementation(({ where }) => {
        return Promise.resolve(auditList.filter((a) => a.ticketId === where.ticketId));
      }),
      create: jest.fn().mockImplementation((dto) => ({
        id: `audit-${Date.now()}-${Math.random().toString().slice(-4)}`,
        createdAt: new Date(),
        ...dto,
      })),
      save: jest.fn().mockImplementation((a) => {
        auditList.push(a);
        return Promise.resolve(a);
      }),
    };

    orderRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'order-101') return Promise.resolve(mockOrder);
        if (where.id === 'order-999') return Promise.resolve(mockOtherOrder);
        return Promise.resolve(null);
      }),
    };

    refundRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'refund-101') return Promise.resolve({ id: 'refund-101', customerId: 'cust-101' });
        if (where.id === 'refund-999') return Promise.resolve({ id: 'refund-999', customerId: 'cust-202' });
        return Promise.resolve(null);
      }),
    };

    returnRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'return-101') return Promise.resolve({ id: 'return-101', customerId: 'cust-101' });
        if (where.id === 'return-999') return Promise.resolve({ id: 'return-999', customerId: 'cust-202' });
        return Promise.resolve(null);
      }),
    };

    userRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'agent-303') return Promise.resolve(mockAgentUser);
        if (where.id === 'cust-404') return Promise.resolve(mockNonAgentUser);
        return Promise.resolve(null);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportService,
        { provide: getRepositoryToken(SupportTicket), useValue: ticketRepo },
        { provide: getRepositoryToken(SupportTicketMessage), useValue: messageRepo },
        { provide: getRepositoryToken(SupportTicketAttachment), useValue: attachmentRepo },
        { provide: getRepositoryToken(SupportTicketAuditLog), useValue: auditRepo },
        { provide: getRepositoryToken(SupportTicketAuditLog), useValue: auditRepo },
        { provide: getRepositoryToken(Order), useValue: orderRepo },
        { provide: getRepositoryToken(Refund), useValue: refundRepo },
        { provide: getRepositoryToken(ReturnRequest), useValue: returnRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<SupportService>(SupportService);
  });

  test('1. Customer creates ticket successfully with ticket number and initial message', async () => {
    const ticket = await service.createTicket(mockCustomerUser, {
      category: 'ORDER',
      subject: 'Delayed Order Delivery',
      description: 'My order ORD-1001 is running 2 hours late.',
      orderId: 'order-101',
    });

    expect(ticket.id).toBeDefined();
    expect(ticket.ticketNumber).toMatch(/^SUP-2026-\d{6}$/);
    expect(ticket.customerId).toBe('cust-101');
    expect(ticket.category).toBe('ORDER');
    expect(ticket.status).toBe('OPEN');
    expect(ticket.priority).toBe('NORMAL');
    expect(ticket.orderId).toBe('order-101');
  });

  test('2. IDOR Protection: Customer cannot link another customer order', async () => {
    await expect(
      service.createTicket(mockCustomerUser, {
        category: 'ORDER',
        subject: 'Unauthorized linkage attempt',
        description: 'Trying to reference customer 2 order',
        orderId: 'order-999',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  test('3. IDOR Protection: Customer cannot link another customer refund or return', async () => {
    await expect(
      service.createTicket(mockCustomerUser, {
        category: 'REFUND',
        subject: 'Unauthorized refund link',
        description: 'Trying to reference customer 2 refund',
        refundId: 'refund-999',
      }),
    ).rejects.toThrow(ForbiddenException);

    await expect(
      service.createTicket(mockCustomerUser, {
        category: 'RETURN',
        subject: 'Unauthorized return link',
        description: 'Trying to reference customer 2 return',
        returnRequestId: 'return-999',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  test('4. Customer sees only their own tickets', async () => {
    await service.createTicket(mockCustomerUser, {
      category: 'PAYMENT',
      subject: 'Double Charged',
      description: 'Card was charged twice.',
    });

    const res = await service.getCustomerTickets(mockCustomerUser, {});
    expect(res.items.length).toBe(1);
    expect(res.items[0].customerId).toBe('cust-101');

    const resOther = await service.getCustomerTickets(mockOtherCustomer, {});
    expect(resOther.items.length).toBe(0);
  });

  test('5. IDOR Protection: Customer cannot view another customer ticket', async () => {
    const t = await service.createTicket(mockCustomerUser, {
      category: 'TECHNICAL',
      subject: 'App Crash',
      description: 'App freezes on checkout.',
    });

    await expect(service.getCustomerTicketById(mockOtherCustomer, t.id)).rejects.toThrow(
      ForbiddenException,
    );
  });

  test('6. Internal Note Isolation: Customer view excludes internal notes', async () => {
    const t = await service.createTicket(mockCustomerUser, {
      category: 'OTHER',
      subject: 'Inquiry',
      description: 'Where is my invoice?',
    });

    // Admin adds customer reply AND internal note
    await service.addAdminReply(mockAgentUser, t.id, {
      message: 'Hello Alice, invoice sent to your email.',
      isInternalNote: false,
    });
    await service.addAdminReply(mockAgentUser, t.id, {
      message: 'INTERNAL NOTE: Customer email verified. Do not refund.',
      isInternalNote: true,
    });

    const custView = await service.getCustomerTicketById(mockCustomerUser, t.id);
    expect(custView.messages.length).toBe(2); // initial description + admin reply
    const internalFound = custView.messages.some((m) => m.isInternalNote || m.message.includes('INTERNAL NOTE'));
    expect(internalFound).toBe(false);

    // Admin view includes internal notes
    const adminView = await service.getAdminTicketById(mockAgentUser, t.id);
    expect(adminView.messages.length).toBe(3);
  });

  test('7. Customer reply to RESOLVED ticket reopens it to OPEN (Reopening Policy)', async () => {
    const t = await service.createTicket(mockCustomerUser, {
      category: 'DELIVERY',
      subject: 'Package Missing',
      description: 'Package marked delivered but not at door.',
    });

    await service.updateStatus(mockAgentUser, t.id, { status: 'RESOLVED' });
    const res1 = await service.getCustomerTicketById(mockCustomerUser, t.id);
    expect(res1.ticket.status).toBe('RESOLVED');

    // Customer replies
    await service.addCustomerReply(mockCustomerUser, t.id, 'Actually I checked with security and it is still missing.');

    const res2 = await service.getCustomerTicketById(mockCustomerUser, t.id);
    expect(res2.ticket.status).toBe('OPEN');
  });

  test('8. Customer cannot reply to a permanently CLOSED ticket', async () => {
    const t = await service.createTicket(mockCustomerUser, {
      category: 'ACCOUNT',
      subject: 'Email Change',
      description: 'Need to update email address.',
    });

    await service.updateStatus(mockAgentUser, t.id, { status: 'CLOSED' });

    await expect(
      service.addCustomerReply(mockCustomerUser, t.id, 'Wait I need help again'),
    ).rejects.toThrow(BadRequestException);
  });

  test('9. Admin can assign ticket to eligible support agent', async () => {
    const t = await service.createTicket(mockCustomerUser, {
      category: 'QUICK_COMMERCE',
      subject: 'Flado Item Missing',
      description: 'Missing 1 milk carton.',
    });

    const updated = await service.assignAgent(mockAgentUser, t.id, { agentId: 'agent-303' });
    expect(updated.assignedAgentId).toBe('agent-303');
    expect(updated.assignedAgentName).toBe('Sarah Agent');
    expect(updated.status).toBe('IN_PROGRESS');
  });

  test('10. Reject assignment to non-support customer account', async () => {
    const t = await service.createTicket(mockCustomerUser, {
      category: 'OTHER',
      subject: 'General Question',
      description: 'What are store hours?',
    });

    await expect(
      service.assignAgent(mockAgentUser, t.id, { agentId: 'cust-404' }),
    ).rejects.toThrow(BadRequestException);
  });

  test('11. Status state machine validates transitions & records audit trail', async () => {
    const t = await service.createTicket(mockCustomerUser, {
      category: 'PAYMENT',
      subject: 'Failed Payment',
      description: 'UPI transaction timed out.',
    });

    await service.updateStatus(mockAgentUser, t.id, { status: 'WAITING_FOR_CUSTOMER' });
    await service.updateStatus(mockAgentUser, t.id, { status: 'RESOLVED' });
    const final = await service.updateStatus(mockAgentUser, t.id, { status: 'CLOSED' });

    expect(final.status).toBe('CLOSED');
    expect(final.resolvedAt).toBeDefined();
    expect(final.closedAt).toBeDefined();

    const adminDetails = await service.getAdminTicketById(mockAgentUser, t.id);
    expect(adminDetails.auditLogs.length).toBeGreaterThanOrEqual(4);
  });
});
