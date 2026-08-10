# AuraMart Commerce OS — Search Provider Guide

## 1. Overview
The Search Framework (`backend/src/products/search`) decouples full-text product search, category filtering, and facet generation from the primary relational database.

---

## 2. Supported Search Engines
- **SQL Fallback**: Relational database `LIKE` query search with category & price filtering (`SEARCH_PROVIDER=sql`). Default development provider.
- **Typesense**: Fast, typo-tolerant open-source search engine (`SEARCH_PROVIDER=typesense`).
- **Meilisearch**: Lightning-fast, hyper-relevant search engine (`SEARCH_PROVIDER=meilisearch`).

---

## 3. Resilience & Fallback
If the configured external search engine returns 0 hits or encounters a network error, `SearchService` automatically falls back to `SqlSearchProvider` to ensure catalog search is never broken.
