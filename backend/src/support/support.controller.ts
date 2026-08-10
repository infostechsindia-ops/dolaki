import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { SupportService, CreateTicketDTO } from './support.service';

@Controller('support')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  /**
   * POST /api/v1/support/tickets — customer creates a new support ticket.
   */
  @Post('tickets')
  @Roles('CUSTOMER', 'SUPER_ADMIN', 'OPERATIONS', 'SUPPORT')
  createTicket(@Request() req: any, @Body() body: CreateTicketDTO) {
    return this.supportService.createTicket(req.user, body);
  }

  /**
   * GET /api/v1/support/tickets — customer views their support tickets list.
   */
  @Get('tickets')
  @Roles('CUSTOMER', 'SUPER_ADMIN', 'OPERATIONS', 'SUPPORT')
  getCustomerTickets(
    @Request() req: any,
    @Query() query: { page?: number; limit?: number; status?: string; category?: string },
  ) {
    return this.supportService.getCustomerTickets(req.user, query);
  }

  /**
   * GET /api/v1/support/tickets/:id — customer views ticket details (sanitized timeline, no internal notes).
   */
  @Get('tickets/:id')
  @Roles('CUSTOMER', 'SUPER_ADMIN', 'OPERATIONS', 'SUPPORT')
  getCustomerTicketById(@Request() req: any, @Param('id') id: string) {
    return this.supportService.getCustomerTicketById(req.user, id);
  }

  /**
   * POST /api/v1/support/tickets/:id/messages — customer replies to ticket.
   */
  @Post('tickets/:id/messages')
  @Roles('CUSTOMER', 'SUPER_ADMIN', 'OPERATIONS', 'SUPPORT')
  addCustomerReply(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { message: string },
  ) {
    return this.supportService.addCustomerReply(req.user, id, body.message);
  }
}
