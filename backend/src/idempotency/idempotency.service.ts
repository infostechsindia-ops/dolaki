import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { IdempotencyKey } from '../database/entities';
import * as crypto from 'crypto';

const KEY_REGEX = /^[a-zA-Z0-9_\-\.\:]{1,128}$/;

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);

  constructor(
    @InjectRepository(IdempotencyKey)
    private readonly repository: Repository<IdempotencyKey>,
  ) {}

  isValidKeyFormat(key: string): boolean {
    if (!key || typeof key !== 'string') return false;
    return KEY_REGEX.test(key.trim());
  }

  buildScopedKey(actorOrTenantId: string, operation: string, key: string): string {
    const cleanActor = (actorOrTenantId || 'ANONYMOUS').trim();
    const cleanOp = (operation || 'GLOBAL').trim().toUpperCase();
    const cleanKey = key.trim();
    return `${cleanActor}:${cleanOp}:${cleanKey}`;
  }

  /**
   * Deterministic request fingerprinting:
   * sha256(METHOD + ":" + ROUTE + ":" + SORTED_QUERY + ":" + SORTED_PARAMS + ":" + SORTED_BODY)
   */
  computeFingerprint(
    method: string,
    routePath: string,
    queryParams: any,
    routeParams: any,
    body: any,
  ): string {
    const normMethod = (method || 'POST').toUpperCase();
    const normPath = (routePath || '/').toLowerCase();

    const sortObject = (obj: any): any => {
      if (obj === null || obj === undefined || typeof obj !== 'object') {
        return obj;
      }
      if (Array.isArray(obj)) {
        return obj.map(sortObject);
      }
      const sorted: Record<string, any> = {};
      Object.keys(obj)
        .sort()
        .forEach((key) => {
          sorted[key] = sortObject(obj[key]);
        });
      return sorted;
    };

    const canonicalQuery = JSON.stringify(sortObject(queryParams || {}));
    const canonicalParams = JSON.stringify(sortObject(routeParams || {}));
    const canonicalBody = JSON.stringify(sortObject(body || {}));

    const rawString = `${normMethod}:${normPath}:${canonicalQuery}:${canonicalParams}:${canonicalBody}`;
    return crypto.createHash('sha256').update(rawString).digest('hex');
  }

  async findByScopedKey(scopedKey: string): Promise<IdempotencyKey | null> {
    return this.repository.findOne({ where: { scopedKey } });
  }

  /**
   * DB-Atomic key acquisition.
   * Leverages unique constraint on `scopedKey` column as final authority.
   * Returns created entity if acquired; returns null if concurrent request acquired it.
   */
  async claimKey(
    scopedKey: string,
    actorId: string,
    operation: string,
    idempotencyKey: string,
    requestHash: string,
    ttlSeconds = 86400,
  ): Promise<IdempotencyKey | null> {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    const record = this.repository.create({
      scopedKey,
      actorId,
      operation,
      idempotencyKey,
      requestHash,
      status: 'PROCESSING',
      expiresAt,
    });

    let retries = 5;
    while (retries > 0) {
      try {
        return await this.repository.save(record);
      } catch (err: any) {
        const msg = String(err?.message || '') + String(err?.driverError?.message || '');
        const code = String(err?.code || '') + String(err?.driverError?.code || '');
        if (
          (msg.includes('SQLITE_BUSY') || msg.includes('locked') || code.includes('SQLITE_BUSY')) &&
          retries > 1
        ) {
          retries--;
          await new Promise((r) => setTimeout(r, 50));
          continue;
        }
        if (
          err?.code === 'SQLITE_CONSTRAINT' ||
          err?.code === '23505' ||
          err?.message?.includes('UNIQUE constraint failed') ||
          err?.message?.includes('duplicate key')
        ) {
          this.logger.warn(`Atomic key claim collision for scopedKey: ${scopedKey}`);
          return null;
        }
        throw err;
      }
    }
    return null;
  }

  async completeKey(
    scopedKey: string,
    statusCode: number,
    responseBody: any,
  ): Promise<void> {
    const record = await this.findByScopedKey(scopedKey);
    if (record) {
      record.status = 'COMPLETED';
      record.statusCode = statusCode;
      record.responseBody =
        typeof responseBody === 'string'
          ? responseBody
          : JSON.stringify(responseBody);
      let retries = 5;
      while (retries > 0) {
        try {
          await this.repository.save(record);
          break;
        } catch (err: any) {
          const msg = String(err?.message || '') + String(err?.driverError?.message || '');
          if ((msg.includes('SQLITE_BUSY') || msg.includes('locked')) && retries > 1) {
            retries--;
            await new Promise((r) => setTimeout(r, 40));
            continue;
          }
          break;
        }
      }
    }
  }

  async failKey(
    scopedKey: string,
    statusCode: number,
    errorBody: any,
  ): Promise<void> {
    const record = await this.findByScopedKey(scopedKey);
    if (record) {
      record.status = 'FAILED';
      record.statusCode = statusCode;
      record.responseBody =
        typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody);
      let retries = 5;
      while (retries > 0) {
        try {
          await this.repository.save(record);
          break;
        } catch (err: any) {
          const msg = String(err?.message || '') + String(err?.driverError?.message || '');
          if ((msg.includes('SQLITE_BUSY') || msg.includes('locked')) && retries > 1) {
            retries--;
            await new Promise((r) => setTimeout(r, 40));
            continue;
          }
          break;
        }
      }
    }
  }

  async deleteKey(scopedKey: string): Promise<void> {
    await this.repository.delete({ scopedKey });
  }

  async purgeExpired(): Promise<void> {
    await this.repository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
