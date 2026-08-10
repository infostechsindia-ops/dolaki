# AuraMart Darkstore App Architecture & Security (DARKSTORE-001)

## 1. Security & Offline Isolation

The Darkstore App Architecture enforces role validation (`Role.DARKSTORE_STAFF`), secure JWT session handling, offline-first read caching, and strict mutation protection when disconnected.
