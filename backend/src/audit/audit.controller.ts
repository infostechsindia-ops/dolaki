import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';
import { PageQueryDto } from '../common/dto/pagination.dto';

@Controller('admin/audit-logs')
@Roles(Role.SUPER_ADMIN, Role.OPERATIONS)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  getAuditLogs(
    @Query() query: PageQueryDto & { actorId?: string; action?: string; resourceType?: string },
  ) {
    return this.auditService.findAll(query);
  }
}
