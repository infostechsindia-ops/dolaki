# AuraMart Commerce OS — CI/CD Pipeline Guide

## Overview
AuraMart utilizes GitHub Actions workflows for continuous integration and automated release artifact packaging.

---

## 1. Workflows

### Continuous Integration Pipeline (`.github/workflows/ci.yml`)
Triggers on every `push` and `pull_request` to `main` or `develop`.

Steps executed:
1. **Lint & Typecheck**: Executes TypeScript compiler (`npx tsc --noEmit`) across `backend`, `web`, `mobile`, `vendor`, and `admin`.
2. **Execute Full Test Suite**: Runs 614 total unit and integration tests across backend, web, vendor, and admin modules.
3. **Validate Docker Container Builds**: Builds Docker images in dry-run mode to verify container compilation.

### Release Pipeline (`.github/workflows/release.yml`)
Triggers on git version tags (e.g. `v1.0.0`).

Steps executed:
1. **Multi-Architecture Build**: Compiles Docker images for `linux/amd64` and `linux/arm64`.
2. **SBOM Generation**: Generates SPDX JSON Software Bill of Materials using Anchore `sbom-action`.
3. **Vulnerability Scan**: Scans images using Aquasecurity Trivy.
4. **Artifact Packaging**: Bundles Docker configs, scripts, and production compose templates into `auramart-release-bundle.tar.gz`.

---

## 2. Security Safeguards
- Images are **NOT** pushed to public registries automatically.
- No secrets or credentials are hardcoded into CI workflows.
