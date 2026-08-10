import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex } from 'typeorm';

export class CreateFladoVipSubscription1723500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add isVip and vipExpiresAt columns to users table if not exists
    const usersTable = await queryRunner.getTable('users');
    if (usersTable) {
      if (!usersTable.findColumnByName('isVip')) {
        await queryRunner.addColumn(
          'users',
          new TableColumn({
            name: 'isVip',
            type: 'boolean',
            default: false,
          }),
        );
      }
      if (!usersTable.findColumnByName('vipExpiresAt')) {
        await queryRunner.addColumn(
          'users',
          new TableColumn({
            name: 'vipExpiresAt',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      }
    }

    // 2. Create flado_vip_subscriptions table
    await queryRunner.createTable(
      new Table({
        name: 'flado_vip_subscriptions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'plan',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'PENDING_PAYMENT'",
            isNullable: false,
          },
          {
            name: 'priceMinor',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'amountPaidMinor',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            default: "'USD'",
            isNullable: false,
          },
          {
            name: 'paymentIntentId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'providerPaymentReference',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cancelAtPeriodEnd',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'activatedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelledAt',
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

    // 3. Add Indexes
    await queryRunner.createIndex(
      'flado_vip_subscriptions',
      new TableIndex({
        name: 'IDX_FLADO_VIP_USER_ID',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'flado_vip_subscriptions',
      new TableIndex({
        name: 'IDX_FLADO_VIP_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'flado_vip_subscriptions',
      new TableIndex({
        name: 'IDX_FLADO_VIP_EXPIRES_AT',
        columnNames: ['expiresAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('flado_vip_subscriptions');

    const usersTable = await queryRunner.getTable('users');
    if (usersTable) {
      if (usersTable.findColumnByName('vipExpiresAt')) {
        await queryRunner.dropColumn('users', 'vipExpiresAt');
      }
      if (usersTable.findColumnByName('isVip')) {
        await queryRunner.dropColumn('users', 'isVip');
      }
    }
  }
}
