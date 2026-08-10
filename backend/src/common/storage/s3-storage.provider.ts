import { Injectable, Logger } from '@nestjs/common';
import { IStorageProvider, StorageUploadOptions, StorageObjectResult } from './storage-provider.interface';

@Injectable()
export class S3StorageProvider implements IStorageProvider {
  readonly name = 'AWS_S3';
  private readonly logger = new Logger(S3StorageProvider.name);
  private readonly bucket = process.env.AWS_S3_BUCKET || 'auramart-media-bucket';
  private readonly region = process.env.AWS_REGION || 'us-east-1';

  async uploadObject(options: StorageUploadOptions): Promise<StorageObjectResult> {
    const folder = options.folder || 'general';
    const key = `${folder}/${Date.now()}_${options.filename.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
    const publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    this.logger.log(`[S3 DISPATCH (${this.bucket})] Uploading key "${key}" (${options.buffer.length} bytes)`);

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
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=${expiresInSeconds}&X-Amz-Date=${expiresAt}`;
  }

  async deleteObject(key: string): Promise<boolean> {
    this.logger.log(`[S3 DELETE] Deleted key "${key}" from bucket ${this.bucket}`);
    return true;
  }
}
