export interface StorageUploadOptions {
  filename: string;
  mimeType: string;
  buffer: Buffer;
  folder?: string;
  isPublic?: boolean;
}

export interface StorageObjectResult {
  key: string;
  publicUrl: string;
  provider: string;
  sizeBytes: number;
  mimeType: string;
}

export interface IStorageProvider {
  readonly name: string;
  uploadObject(options: StorageUploadOptions): Promise<StorageObjectResult>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
  deleteObject(key: string): Promise<boolean>;
}
