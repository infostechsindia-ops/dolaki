import { Injectable, Logger } from '@nestjs/common';
import { IStorageProvider, StorageUploadOptions, StorageObjectResult } from './storage-provider.interface';
import { LocalStorageProvider } from './local-storage.provider';
import { S3StorageProvider } from './s3-storage.provider';
import { R2StorageProvider } from './r2-storage.provider';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly providers: Map<string, IStorageProvider> = new Map();

  constructor(
    private readonly localProvider: LocalStorageProvider,
    private readonly s3Provider: S3StorageProvider,
    private readonly r2Provider: R2StorageProvider,
  ) {
    this.providers.set('LOCAL', localProvider);
    this.providers.set('S3', s3Provider);
    this.providers.set('AWS_S3', s3Provider);
    this.providers.set('R2', r2Provider);
    this.providers.set('CLOUDFLARE_R2', r2Provider);
  }

  private getProvider(): IStorageProvider {
    const configured = (process.env.STORAGE_PROVIDER || 'LOCAL').toUpperCase();
    return this.providers.get(configured) || this.localProvider;
  }

  async uploadObject(options: StorageUploadOptions): Promise<StorageObjectResult> {
    const provider = this.getProvider();
    this.logger.log(`Uploading asset "${options.filename}" using storage provider: ${provider.name}`);
    return provider.uploadObject(options);
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const provider = this.getProvider();
    return provider.getSignedUrl(key, expiresInSeconds);
  }

  async deleteObject(key: string): Promise<boolean> {
    const provider = this.getProvider();
    return provider.deleteObject(key);
  }
}
