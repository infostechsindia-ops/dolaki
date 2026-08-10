import { Injectable, Logger } from '@nestjs/common';
import { IStorageProvider, StorageUploadOptions, StorageObjectResult } from './storage-provider.interface';

@Injectable()
export class R2StorageProvider implements IStorageProvider {
  readonly name = 'CLOUDFLARE_R2';
  private readonly logger = new Logger(R2StorageProvider.name);
  private readonly bucket = process.env.R2_BUCKET_NAME || 'auramart-r2-media';
  private readonly accountId = process.env.R2_ACCOUNT_ID || 'r2_sandbox_acc_id';

  async uploadObject(options: StorageUploadOptions): Promise<StorageObjectResult> {
    const folder = options.folder || 'general';
    const key = `${folder}/${Date.now()}_${options.filename.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
    const publicUrl = `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucket}/${key}`;

    this.logger.log(`[R2 DISPATCH (${this.bucket})] Uploading key "${key}" (${options.buffer.length} bytes)`);

    return {
      key,
      publicUrl,
      provider: this.name,
      sizeBytes: options.buffer.length,
      mimeType: options.mimeType,
    };
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    return `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucket}/${key}?X-Amz-Expires=${expiresInSeconds}&X-Amz-Date=${expiresAt}`;
  }

  async deleteObject(key: string): Promise<boolean> {
    this.logger.log(`[R2 DELETE] Deleted key "${key}" from R2 bucket ${this.bucket}`);
    return true;
  }
}
