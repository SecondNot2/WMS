# Warehouse Management System (WMS)

[![CI](https://github.com/SecondNot2/WMS/actions/workflows/ci.yml/badge.svg)](https://github.com/SecondNot2/WMS/actions/workflows/ci.yml)
[![CodeQL](https://github.com/SecondNot2/WMS/actions/workflows/codeql.yml/badge.svg)](https://github.com/SecondNot2/WMS/actions/workflows/codeql.yml)
[![Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Hệ thống quản lý kho (WMS) hiện đại dành cho logistics cửa khẩu. Dự án dùng monorepo `pnpm workspaces`, với Next.js frontend và backend API được merge vào Next.js Route Handlers để deploy một app duy nhất trên Vercel.

---

## Cấu trúc dự án

- **`apps/web`**: Next.js 16 dashboard + API Route Handlers tại `/api`.
- **`apps/web/prisma`**: Prisma schema và migrations cho Supabase PostgreSQL.
- **`packages/types`**: TypeScript types dùng chung.
- **`packages/validations`**: Zod schemas dùng chung.
- **`packages/config`**: Cấu hình dùng chung.

---

## Công nghệ sử dụng

### App (`apps/web`)

- **Framework**: Next.js 16 App Router + React 19
- **API**: Next.js Route Handlers
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand v5
- **Data Fetching**: TanStack Query v5
- **Form**: React Hook Form + Zod
- **ORM**: Prisma v5 + Supabase PostgreSQL
- **Auth**: JWT access token + refresh token
- **Realtime**: Supabase Realtime Broadcast
- **Excel**: XLSX export endpoints

---

## Cài đặt

### 1. Yêu cầu hệ thống

- **Node.js**: >= 20.x
- **pnpm**: >= 10.x

### 2. Cài dependencies

```bash
pnpm install
```

### 3. Cấu hình môi trường

Tạo `apps/web/.env.local` từ `apps/web/.env.example`, sau đó điền:

- **Database**: `DATABASE_URL`, `DIRECT_URL`
- **JWT**: `JWT_SECRET`, `JWT_REFRESH_SECRET`
- **Supabase client**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Supabase server**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

Không cần `NEXT_PUBLIC_API_URL` trong local/production nếu dùng API cùng domain. Client mặc định gọi `/api`.

### 4. Prisma

```bash
pnpm db:generate
pnpm db:push
```

---

## Lệnh phát triển

```bash
pnpm dev
pnpm build
pnpm type-check
pnpm lint
pnpm test            # chạy unit tests (vitest)
pnpm test:coverage   # tests + coverage report
```

---

## Deploy Vercel

Dự án deploy một app duy nhất lên Vercel. Backend nằm trong `apps/web/src/app/api`, không cần Render/Railway riêng.

1. Import repo vào Vercel.
2. Giữ **Root Directory** là `./`.
3. Thêm env vars theo `apps/web/.env.production.example`.
4. Deploy. `vercel.json` sẽ chạy Prisma migrate trước khi build.

Chi tiết xem `docs/DEPLOY_VERCEL.md`.

---

## API

API nội bộ nằm dưới prefix `/api`.

- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/inbound/:id/approve`
- `GET /api/reports/export`

Danh sách đầy đủ xem `docs/API_ENDPOINTS.md`.

---

## Design

Dự án tuân thủ hệ thống thiết kế tại `docs/DESIGN.md`.

- Sử dụng màu sắc qua CSS variables của Tailwind 4.
- Ưu tiên tái sử dụng shared components trong `apps/web/src/components`.
- Data fetching dùng TanStack Query, không fetch trực tiếp trong component bằng `useEffect`.
