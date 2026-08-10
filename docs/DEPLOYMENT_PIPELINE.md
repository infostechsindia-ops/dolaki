# AuraMart Commerce OS — Zero-Downtime Deployment Pipeline Guide

## Overview
AuraMart implements a Blue/Green zero-downtime deployment strategy with automated smoke-test verification and instant rollback.

---

## 1. Deployment Workflow

```
+-------------------+      +--------------------+      +--------------------+
| 1. Backup DB &    | ---> | 2. Spin Up Target  | ---> | 3. Automated       |
|    Run Migrations |      |    Stack (Green)   |      |    Smoke Tests     |
+-------------------+      +--------------------+      +--------------------+
                                                                  |
                                              +-------------------+-------------------+
                                              |                                       |
                                         (Tests Pass)                            (Tests Fail)
                                              |                                       |
                                              v                                       v
                                   +--------------------+                  +--------------------+
                                   | 4. Switch Traffic  |                  | 4. Automatic       |
                                   |    in Nginx Proxy  |                  |    Rollback (Blue) |
                                   +--------------------+                  +--------------------+
```

---

## 2. Deployment Scripts

- [`scripts/deploy-blue-green.sh`](file:///Users/arifalnukhbah/antigravity/AuraMart/scripts/deploy-blue-green.sh): Performs Blue/Green deployment sequence.
- [`scripts/smoke-test.sh`](file:///Users/arifalnukhbah/antigravity/AuraMart/scripts/smoke-test.sh): Tests 4 key post-deployment health & catalog endpoints.
- [`scripts/rollback.sh`](file:///Users/arifalnukhbah/antigravity/AuraMart/scripts/rollback.sh): Immediately routes traffic back to previous active stack.
