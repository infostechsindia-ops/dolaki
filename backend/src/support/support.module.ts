import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { AdminSupportController } from './admin-support.controller';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupportTicket,
      SupportTicketMessage,
      SupportTicketAttachment,
      SupportTicketAuditLog,
      Order,
      Refund,
      ReturnRequest,
      User,
    ]),
  ],
  controllers: [SupportController, AdminSupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
