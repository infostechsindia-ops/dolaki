import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CmsMediaAsset } from '../database/entities';
import { SduiService } from './sdui.service';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export class UploadAssetDto {
  filename: string;
  mimeType: string;
  buffer?: Buffer;
  base64Data?: string;
  assetType?: string;
  altText?: string;
  width?: number;
  height?: number;
}

@Injectable()
export class CmsAssetsService {
  private readonly uploadDir: string;

  constructor(
    @InjectRepository(CmsMediaAsset)
    private readonly assetRepo: Repository<CmsMediaAsset>,
    private readonly sduiService: SduiService,
  ) {
    this.uploadDir = path.join(process.cwd(), 'uploads', 'cms');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadAsset(dto: UploadAssetDto, userId: string): Promise<CmsMediaAsset> {
    if (!userId) {
      throw new ForbiddenException('User authentication required for CMS media upload');
    }

    // 1. Resolve file buffer
    let fileBuffer: Buffer;
    if (dto.buffer && Buffer.isBuffer(dto.buffer)) {
      fileBuffer = dto.buffer;
    } else if (dto.base64Data) {
      const cleanBase64 = dto.base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      fileBuffer = Buffer.from(cleanBase64, 'base64');
    } else {
      throw new BadRequestException('File buffer or base64 data must be provided');
    }

    // 2. Validate file size (Max 5MB, non-empty)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (fileBuffer.length === 0) {
      throw new BadRequestException('Empty file upload rejected');
    }
    if (fileBuffer.length > MAX_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds maximum allowed limit of 5MB');
    }

    // 3. Validate MIME type
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const mimeType = (dto.mimeType || '').toLowerCase().trim();

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(
        `Invalid file type "${mimeType}". Only JPEG, PNG, and WebP images are permitted for CMS banners.`,
      );
    }

    // 4. Validate extension & filename sanitization (Path Traversal & Executable Bypass Defense)
    const safeOriginalFilename = path.basename(dto.filename || 'banner_asset').replace(/[^a-zA-Z0-9_.-]/g, '_');
    
    // Check extension against malicious patterns
    const forbiddenExtensions = /\.(php|sh|exe|pl|py|jsp|asp|html|htm|svg|js|cgi)$/i;
    if (forbiddenExtensions.test(safeOriginalFilename) || safeOriginalFilename.includes('\0')) {
      throw new BadRequestException('Disallowed or dangerous file extension detected');
    }

    // Double extension check (e.g. banner.png.php)
    const extensionParts = safeOriginalFilename.split('.');
    if (extensionParts.length > 2) {
      const secondLastExt = extensionParts[extensionParts.length - 2].toLowerCase();
      if (['php', 'sh', 'exe', 'html', 'js'].includes(secondLastExt)) {
        throw new BadRequestException('Multiple extension bypass pattern detected');
      }
    }

    const fileExt = path.extname(safeOriginalFilename).toLowerCase() || (mimeType === 'image/webp' ? '.webp' : mimeType === 'image/png' ? '.png' : '.jpg');

    // 5. Generate collision-resistant storage key
    const uniqueHash = crypto.randomUUID();
    const storageKey = `cms_${uniqueHash}${fileExt}`;
    const targetPath = path.join(this.uploadDir, storageKey);

    // Ensure path traversal safety
    if (!targetPath.startsWith(this.uploadDir)) {
      throw new BadRequestException('Path traversal attempt detected');
    }

    // 6. Write file to local storage directory
    fs.writeFileSync(targetPath, fileBuffer);

    // 7. Compute public URL without exposing internal filesystem paths
    const publicUrl = `/api/v1/admin/cms/assets/file/${storageKey}`;

    // 8. Persist metadata record
    const asset = this.assetRepo.create({
      originalFilename: safeOriginalFilename,
      storageKey,
      mimeType,
      sizeBytes: fileBuffer.length,
      width: dto.width || null,
      height: dto.height || null,
      assetType: dto.assetType || 'HERO_BANNER',
      publicUrl,
      altText: dto.altText || null,
      uploadedByUserId: userId,
    });

    return this.assetRepo.save(asset);
  }

  async getAssets(query?: { page?: number; limit?: number; search?: string; assetType?: string }) {
    const page = Math.max(1, Number(query?.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query?.limit || 20)));
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (query?.search) {
      whereClause.originalFilename = Like(`%${query.search.trim()}%`);
    }
    if (query?.assetType) {
      whereClause.assetType = query.assetType;
    }

    const [assets, total] = await this.assetRepo.findAndCount({
      where: whereClause,
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    const homepage = await this.sduiService.getHomepageLayout();
    const flado = await this.sduiService.getFladoLayout();

    const assetsWithUsage = assets.map((asset) => {
      const locations: string[] = [];
      const hpStr = JSON.stringify(homepage);
      const flStr = JSON.stringify(flado);

      if (hpStr.includes(asset.publicUrl) || hpStr.includes(asset.storageKey)) {
        locations.push('Homepage Layout');
      }
      if (flStr.includes(asset.publicUrl) || flStr.includes(asset.storageKey)) {
        locations.push('Flado Quick Commerce');
      }

      return {
        ...asset,
        usageCount: locations.length,
        usedInLocations: locations,
      };
    });

    return {
      assets: assetsWithUsage,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAssetById(id: string): Promise<CmsMediaAsset> {
    const asset = await this.assetRepo.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`CMS Media Asset with ID "${id}" not found`);
    }
    return asset;
  }

  async getAssetFilePath(storageKey: string): Promise<{ filePath: string; mimeType: string }> {
    const cleanKey = path.basename(storageKey);
    const asset = await this.assetRepo.findOne({ where: { storageKey: cleanKey } });
    const targetPath = path.join(this.uploadDir, cleanKey);

    if (!fs.existsSync(targetPath)) {
      throw new NotFoundException('Asset file not found on disk');
    }

    return {
      filePath: targetPath,
      mimeType: asset?.mimeType || 'image/jpeg',
    };
  }

  async deleteAsset(id: string): Promise<{ success: boolean; message: string }> {
    const asset = await this.getAssetById(id);

    // Safety Check: Verify if asset is referenced in active SDUI layout configuration
    const isReferenced = await this.checkIfAssetIsReferencedInCMS(asset);
    if (isReferenced) {
      throw new BadRequestException(
        'Cannot delete media asset because it is currently referenced by an active CMS banner/layout. Please unassign or replace the banner image before deleting.',
      );
    }

    // Delete local file if it exists
    const filePath = path.join(this.uploadDir, asset.storageKey);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        // Continue DB deletion even if disk file removal log occurs
      }
    }

    await this.assetRepo.remove(asset);
    return { success: true, message: 'Media asset deleted successfully' };
  }

  private async checkIfAssetIsReferencedInCMS(asset: CmsMediaAsset): Promise<boolean> {
    try {
      const homepage = await this.sduiService.getHomepageLayout();
      const flado = await this.sduiService.getFladoLayout();

      const layoutsJson = JSON.stringify([homepage, flado]);
      return layoutsJson.includes(asset.publicUrl) || layoutsJson.includes(asset.storageKey);
    } catch {
      return false;
    }
  }
}
