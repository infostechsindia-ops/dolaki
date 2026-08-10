import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IStorageProvider, StorageUploadOptions, StorageObjectResult } from './storage-provider.interface';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  readonly name = 'LOCAL';
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadObject(options: StorageUploadOptions): Promise<StorageObjectResult> {
    const folder = options.folder || 'general';
    const targetDir = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const safeFilename = `${Date.now()}_${path.basename(options.filename).replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
    const filePath = path.join(targetDir, safeFilename);

    await fs.promises.writeFile(filePath, options.buffer);

    const relativePath = path.join(folder, safeFilename);
    const publicUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;

    this.logger.log(`[LOCAL STORAGE] Saved ${options.buffer.length} bytes to ${filePath}`);

    return {
      key: relativePath,
      publicUrl,
      provider: this.name,
      sizeBytes: options.buffer.length,
      mimeType: options.mimeType,
    };
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    // Local storage returns static relative URL with signed expiration token query
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const cleanKey = key.replace(/\\/g, '/');
    return `/uploads/${cleanKey}?exp=${expiresAt}&sig=local_sandbox_signature`;
  }

  async deleteObject(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (e) {
      this.logger.error(`Failed to delete local object ${key}`, e);
      return false;
    }
  }
}
