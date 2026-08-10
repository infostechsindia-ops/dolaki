import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCmsMediaAssetTable1723700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cms_media_assets',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'originalFilename',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'storageKey',
            type: 'varchar',
            isUnique: true,
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
            name: 'width',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'height',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'assetType',
            type: 'varchar',
            default: "'HERO_BANNER'",
            isNullable: false,
          },
          {
            name: 'publicUrl',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'altText',
            type: 'varchar',
            isNullable: true,
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
      'cms_media_assets',
      new TableIndex({
        name: 'IDX_CMS_MEDIA_ASSETS_UPLOADED_BY',
        columnNames: ['uploadedByUserId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cms_media_assets');
  }
}
