# Changelog

All notable changes to this project documented chronologically. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — Portfolio polish

### Security

- Fix CodeQL alert _DOM text reinterpreted as HTML_ in `ImageUpload.tsx`. Added `isSafeImageUrl()` helper whitelisting `http(s):`, `blob:`, `data:image/*`, and root-relative paths. Blocks `javascript:`, `data:text/html`, `vbscript:`, `file:` schemes. Covered by 16 new unit tests.

### Added

- **OpenAPI 3.1 spec** auto-generated from `@wms/validations` Zod schemas (`apps/web/src/server/openapi.ts`).
- **Scalar API Reference UI** served at `/api-docs` (public, whitelisted in middleware).
- **Docker self-host stack**: multi-stage `apps/web/Dockerfile` + `docker-compose.yml` with Postgres 16. Image ~150MB via Next.js standalone output.
- **Turborepo 2 pipeline** with cache (`turbo.json`). 30-100x speedup on cached tasks (build/lint/type-check/test).
- **Vitest unit tests** (60 total) — services, utilities, RBAC, JWT lifecycle, URL safety.
- **Husky + lint-staged + Prettier + Commitlint** quality gates.
- **GitHub Actions workflows**: CI (lint/type-check/test/build), CodeQL SAST, Gitleaks secret scan, Dependabot.
- **Mermaid diagrams** in README (system architecture + approve-receipt sequence).
- **Dashboard screenshot** + Quick demo callout in README.
- **MIT LICENSE** file.

### Changed

- Migrated backend from separate Express server (`apps/api`) into Next.js Route Handlers under `apps/web/src/app/api/*`. Single-deployment architecture.
- README rewritten with badges, tech stack tables, RBAC matrix, deploy options (Docker + Vercel), and Quick demo section.
- Updated `package.json` root scripts to use `turbo run`.
- React 19 lint cleanup: refactored stateful components to prev-state pattern + `useSyncExternalStore`.

### Removed

- `apps/api.legacy/` (Express backend) excluded from pnpm workspace.
- Stale ESLint disable directives.

---

## Versioning

Project follows [Semantic Versioning](https://semver.org/) once a `1.0.0` is tagged.
