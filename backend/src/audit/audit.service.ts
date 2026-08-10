import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../database/entities';

export interface AuditEventInput {
  actorId?: string;
  actorRole?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  vendorId?: string;
  shopId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditQueryDto {
  page?: number;
  pageSize?: number;
  actorId?: string;
  action?: string;
  resourceType?: string;
}

const SENSITIVE_KEY_PATTERN =
  /password|pass|token|refreshtoken|refresh_token|access_token|jwt|secret|otp|verificationotp|verification_otp|cvv|creditcard|credit_card|authorization|cookie/i;

export function redactSensitiveFields(obj: any, depth = 0): any {
  if (depth > 10 || obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveFields(item, depth + 1));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = redactSensitiveFields(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  redactSensitiveFields(obj: any): any {
    return redactSensitiveFields(obj);
  }

  async log(input: AuditEventInput): Promise<AuditLog> {
    try {
      const sanitizedDetails = input.details
        ? redactSensitiveFields(input.details)
        : null;

      const actorId = input.actorId || 'SYSTEM';
      const resourceId = input.resourceId || null;
      const resourceType = input.resourceType || 'SYSTEM';

      const entry = this.auditRepository.create({
        adminId: actorId,
        actorId: actorId,
        actorRole: input.actorRole || 'ANONYMOUS',
        action: input.action,
        targetId: resourceId,
        resourceId: resourceId,
        targetType: resourceType,
        resourceType: resourceType,
        vendorId: input.vendorId || null,
        shopId: input.shopId || null,
        details: sanitizedDetails ? JSON.stringify(sanitizedDetails) : null,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
      } as Partial<AuditLog>);

      return await this.auditRepository.save(entry);
    } catch (err) {
      this.logger.error(`Failed to record audit log: ${input.action}`, err);
      // Non-blocking catch to ensure audit failure does not break business operation
      return null as any;
    }
  }

  async findAll(query?: AuditQueryDto): Promise<{ data: any[]; meta: any }> {
    const page = Math.max(1, Number(query?.page) || 1);
    const rawPageSize = Number(query?.pageSize) || 20;
    const pageSize = Math.min(100, Math.max(1, rawPageSize));

    const where: any = {};
    if (query?.actorId) {
      where.actorId = query.actorId;
    }
    if (query?.action) {
      where.action = query.action;
    }
    if (query?.resourceType) {
      where.resourceType = query.resourceType;
    }

    const [logs, total] = await this.auditRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const data = logs.map((log) => {
      let parsedDetails: any = null;
      if (log.details) {
        try {
          parsedDetails = JSON.parse(log.details);
        } catch (e) {
          parsedDetails = log.details;
        }
      }
      return {
        id: log.id,
        actorId: log.actorId || log.adminId,
        actorRole: log.actorRole,
        action: log.action,
        resourceType: log.resourceType || log.targetType,
        resourceId: log.resourceId || log.targetId,
        vendorId: log.vendorId,
        shopId: log.shopId,
        details: parsedDetails,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        hasNextPage: page * pageSize < total,
      },
    };
  }
}
