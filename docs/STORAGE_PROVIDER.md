# AuraMart Commerce OS — Object Storage Provider Guide

## 1. Overview
The Object Storage Framework (`backend/src/common/storage`) provides multi-provider asset storage for CMS hero banners, product images, vendor document uploads, and support attachments.

---

## 2. Supported Providers
- **Local Storage**: Local filesystem storage under `/uploads` (`STORAGE_PROVIDER=local`). Default for development.
- **AWS S3**: Amazon S3 bucket storage (`STORAGE_PROVIDER=s3`).
- **Cloudflare R2**: Cloudflare S3-compatible R2 storage (`STORAGE_PROVIDER=r2`).

---

## 3. Presigned URLs & Security
All providers implement `getSignedUrl(key, expiresInSeconds)` to issue temporary presigned download URLs for private assets (e.g., vendor KYC documents or support attachments).
