import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { SupportService, AdminTicketFilterDTO } from './support.service';

@Controller('admin/support')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminSupportController {
  constructor(private readonly supportService: SupportService) {}

  /**
   * GET /api/v1/admin/support/tickets — central admin support queue.
   */
  @Get('tickets')
  @Roles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT', 'CATALOG_ADMIN')
  getAdminTickets(@Query() query: AdminTicketFilterDTO) {
    return this.supportService.getAdminTickets(query);
  }

  /**
   * GET /api/v1/admin/support/tickets/:id — admin detailed view (includes internal notes and audit logs).
   */
  @Get('tickets/:id')
  @Roles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT', 'CATALOG_ADMIN')
  getAdminTicketById(@Request() req: any, @Param('id') id: string) {
    return this.supportService.getAdminTicketById(req.user, id);
  }

  /**
   * POST /api/v1/admin/support/tickets/:id/assign — assign ticket to a support agent.
   */
  @Post('tickets/:id/assign')
  @Roles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT')
  assignAgent(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { agentId: string; agentName?: string },
  ) {
    return this.supportService.assignAgent(req.user, id, body);
  }

  /**
   * PATCH /api/v1/admin/support/tickets/:id/status — update ticket status.
   */
  @Patch('tickets/:id/status')
  @Roles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT')
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED' },
  ) {
    return this.supportService.updateStatus(req.user, id, body);
  }

  /**
   * PATCH /api/v1/admin/support/tickets/:id/priority — update ticket priority.
   */
  @Patch('tickets/:id/priority')
  @Roles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT')
  updatePriority(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' },
  ) {
    return this.supportService.updatePriority(req.user, id, body);
  }

  /**
   * POST /api/v1/admin/support/tickets/:id/messages — admin reply or internal note.
   */
  @Post('tickets/:id/messages')
  @Roles('SUPER_ADMIN', 'OPERATIONS', 'SUPPORT')
  addAdminReply(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { message: string; isInternalNote?: boolean },
  ) {
    return this.supportService.addAdminReply(req.user, id, body);
  }
}
