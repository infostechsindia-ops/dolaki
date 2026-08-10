import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSupportTicketTables1723600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create support_tickets table
    await queryRunner.createTable(
      new Table({
        name: 'support_tickets',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'ticketNumber',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'customerId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'customerName',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'customerEmail',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'subject',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'priority',
            type: 'varchar',
            default: "'NORMAL'",
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'OPEN'",
            isNullable: false,
          },
          {
            name: 'orderId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'refundId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'returnRequestId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'assignedAgentId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'assignedAgentName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lastCustomerReplyAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'lastAgentReplyAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'resolvedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'closedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'support_tickets',
      new TableIndex({
        name: 'IDX_SUPPORT_TICKETS_CUSTOMER_ID',
        columnNames: ['customerId'],
      }),
    );

    await queryRunner.createIndex(
      'support_tickets',
      new TableIndex({
        name: 'IDX_SUPPORT_TICKETS_STATUS',
        columnNames: ['status'],
      }),
    );

    // 2. Create support_ticket_messages table
    await queryRunner.createTable(
      new Table({
        name: 'support_ticket_messages',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'ticketId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'senderUserId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'senderName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'senderRole',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'isInternalNote',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'support_ticket_messages',
      new TableIndex({
        name: 'IDX_SUPPORT_TICKET_MESSAGES_TICKET_ID',
        columnNames: ['ticketId'],
      }),
    );

    // 3. Create support_ticket_attachments table
    await queryRunner.createTable(
      new Table({
        name: 'support_ticket_attachments',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'ticketId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'messageId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'fileName',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'fileUrl',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'mimeType',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sizeBytes',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'uploadedByUserId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 4. Create support_ticket_audit_logs table
    await queryRunner.createTable(
      new Table({
        name: 'support_ticket_audit_logs',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'ticketId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'actorUserId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'actorRole',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'action',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'previousStateJson',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'newStateJson',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('support_ticket_audit_logs');
    await queryRunner.dropTable('support_ticket_attachments');
    await queryRunner.dropTable('support_ticket_messages');
    await queryRunner.dropTable('support_tickets');
  }
}
