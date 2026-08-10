import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CmsAssetsService } from './cms-assets.service';
import { SduiService } from './sdui.service';
import { CmsMediaAsset } from '../database/entities';
import * as fs from 'fs';

describe('CmsAssetsService — FEAT-006 Backend Unit Tests', () => {
  let service: CmsAssetsService;
  let assetRepo: any;
  let sduiService: any;

  const mockAdminUser = { userId: 'admin-user-101', role: 'SUPER_ADMIN' };
  const mockCustomerUser = { userId: 'customer-user-202', role: 'CUSTOMER' };

  const mockAssetRecord: any = {
    id: 'asset-uuid-1',
    originalFilename: 'hero_promo_banner.png',
    storageKey: 'cms_12345678-1234-1234-1234-1234567890ab.png',
    mimeType: 'image/png',
    sizeBytes: 150000,
    width: 1200,
    height: 400,
    assetType: 'HERO_BANNER',
    publicUrl: '/api/v1/admin/cms/assets/file/cms_12345678-1234-1234-1234-1234567890ab.png',
    altText: 'Summer Collection Hero Banner',
    uploadedByUserId: 'admin-user-101',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    assetRepo = {
      create: jest.fn().mockImplementation((dto) => ({ id: 'asset-uuid-' + Date.now(), ...dto })),
      save: jest.fn().mockImplementation((asset) => Promise.resolve({ id: asset.id || 'asset-uuid-saved', ...asset })),
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'asset-uuid-1' || where.storageKey === mockAssetRecord.storageKey) {
          return Promise.resolve({ ...mockAssetRecord });
        }
        if (where.id === 'referenced-asset-id') {
          return Promise.resolve({
            ...mockAssetRecord,
            id: 'referenced-asset-id',
            publicUrl: '/api/v1/admin/cms/assets/file/referenced_banner.png',
            storageKey: 'referenced_banner.png',
          });
        }
        return Promise.resolve(null);
      }),
      findAndCount: jest.fn().mockResolvedValue([[mockAssetRecord], 1]),
      remove: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    sduiService = {
      getHomepageLayout: jest.fn().mockResolvedValue({
        sections: [
          {
            id: 'hero_1',
            type: 'hero_banners',
            config: {
              banners: [
                {
                  id: 'b1',
                  imageUrl: '/api/v1/admin/cms/assets/file/referenced_banner.png',
                },
              ],
            },
          },
        ],
      }),
      getFladoLayout: jest.fn().mockResolvedValue({ sections: [] }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CmsAssetsService,
        { provide: getRepositoryToken(CmsMediaAsset), useValue: assetRepo },
        { provide: SduiService, useValue: sduiService },
      ],
    }).compile();

    service = module.get<CmsAssetsService>(CmsAssetsService);
  });

  test('1. Authorized CMS image upload creates asset record with clean publicUrl', async () => {
    const validImageBuffer = Buffer.from('fake-png-binary-content-header-12345');
    const result = await service.uploadAsset(
      {
        filename: 'summer_hero_banner.png',
        mimeType: 'image/png',
        buffer: validImageBuffer,
        assetType: 'HERO_BANNER',
        altText: 'Summer Super Sale',
      },
      mockAdminUser.userId,
    );

    expect(result).toBeDefined();
    expect(result.originalFilename).toBe('summer_hero_banner.png');
    expect(result.mimeType).toBe('image/png');
    expect(result.publicUrl).toContain('/api/v1/admin/cms/assets/file/');
    expect(result.publicUrl).not.toContain('/Users/');
    expect(result.publicUrl).not.toContain('/var/');
    expect(result.uploadedByUserId).toBe(mockAdminUser.userId);
  });

  test('2. Unauthorized/missing userId upload request is rejected', async () => {
    const validImageBuffer = Buffer.from('fake-png-content');
    await expect(
      service.uploadAsset(
        {
          filename: 'banner.png',
          mimeType: 'image/png',
          buffer: validImageBuffer,
        },
        '',
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  test('3. Invalid MIME type (e.g. SVG, Executable, or HTML) is rejected', async () => {
    const fileBuffer = Buffer.from('<svg></svg>');
    await expect(
      service.uploadAsset(
        {
          filename: 'vector_logo.svg',
          mimeType: 'image/svg+xml',
          buffer: fileBuffer,
        },
        mockAdminUser.userId,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  test('4. Oversized image file (> 5MB) is rejected', async () => {
    const hugeBuffer = Buffer.alloc(5 * 1024 * 1024 + 1024);
    await expect(
      service.uploadAsset(
        {
          filename: 'giant_banner.png',
          mimeType: 'image/png',
          buffer: hugeBuffer,
        },
        mockAdminUser.userId,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  test('5. Unsafe path traversal or double extension (.png.php) is rejected/sanitized', async () => {
    const fileBuffer = Buffer.from('malicious-payload');
    await expect(
      service.uploadAsset(
        {
          filename: '../../../etc/passwd.php',
          mimeType: 'image/png',
          buffer: fileBuffer,
        },
        mockAdminUser.userId,
      ),
    ).rejects.toThrow(BadRequestException);

    await expect(
      service.uploadAsset(
        {
          filename: 'banner.png.php',
          mimeType: 'image/png',
          buffer: fileBuffer,
        },
        mockAdminUser.userId,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  test('6. Asset listing returns paginated metadata records', async () => {
    const result = await service.getAssets({ page: 1, limit: 10 });
    expect(result.assets).toBeDefined();
    expect(result.assets.length).toBe(1);
    expect(result.total).toBe(1);
  });

  test('7. Referenced banner asset deletion is rejected with 400 Bad Request error', async () => {
    await expect(service.deleteAsset('referenced-asset-id')).rejects.toThrow(BadRequestException);
  });

  test('8. Unreferenced asset deletion succeeds cleanly', async () => {
    const result = await service.deleteAsset('asset-uuid-1');
    expect(result.success).toBe(true);
    expect(assetRepo.remove).toHaveBeenCalled();
  });

  test('9. Internal server filesystem paths are never exposed in public URL', async () => {
    const result = await service.getAssetById('asset-uuid-1');
    expect(result.publicUrl).toBe('/api/v1/admin/cms/assets/file/cms_12345678-1234-1234-1234-1234567890ab.png');
    expect(result.publicUrl).not.toContain(process.cwd());
  });
});
