# Contributing to AuraMart Commerce OS

Thank you for contributing to AuraMart Commerce OS! Please follow these guidelines to ensure code quality and consistency across all workspace projects.

---

## Workspace Architecture

AuraMart is structured as a multi-workspace repository:
- `backend/`: NestJS 11 backend API
- `web/`: Next.js 16 Customer Web Application
- `admin/`: Next.js 16 Admin Console
- `vendor/`: Next.js 16 Vendor Portal
- `mobile/`: React Native (Expo) Mobile Apps

---

## Coding Guidelines

1. **Server Authority**: All pricing, discounts, tax, stock availability, and financial computations MUST be server-authoritative in the NestJS backend. Never calculate or trust financial totals on the client.
2. **TypeScript Integrity**: Enforce strict TypeScript typing (`noImplicitAny`, zero `any` usage in core domain code). Run `npx tsc --noEmit` before submitting PRs.
3. **Testing Requirements**:
   - Backend logic must include unit tests in `src/**/*.spec.ts`.
   - Web components must include Jest / Testing Library tests in `test/`.
   - Ensure `npm test` passes 100% before committing.
4. **Code Quality**:
   - No `TODO`, `FIXME`, or `HACK` comments in production paths.
   - Remove stray `console.log` statements before opening PRs.
5. **Security**:
   - Never commit API keys, database passwords, or JWT secrets. Use environment variables.
