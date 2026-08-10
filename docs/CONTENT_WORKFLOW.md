# AuraMart Commerce OS — Content Authoring Workflow Guide

## Overview
Outlines the content lifecycle from authoring in Admin CMS (`admin/src/app/cms`) to SDUI payload distribution.

---

## 1. Lifecycle Stages
1. **Drafting**: Create page layout, select blocks, enter copy and SEO metadata.
2. **Preview**: Verify page rendering in Admin CMS preview pane.
3. **Publishing**: Set status to `PUBLISHED` to trigger real-time SDUI endpoint updates (`GET /api/v1/sdui/homepage`).
4. **Versioning & Rollback**: Revert to previous revision snapshots when required.
