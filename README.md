# Warehouse Management System (WMS)

Hệ thống quản lý kho (WMS) hiện đại, hiệu năng cao dành cho logistics cửa khẩu. Dự án được xây dựng dưới dạng **Monorepo** giúp quản lý đồng bộ cả Backend, Frontend và các gói thư viện dùng chung.

---

## 🏗️ Cấu trúc dự án (Monorepo)

Dự án sử dụng `pnpm workspaces` để quản lý các gói:

- **`apps/web`**: Frontend dashboard xây dựng bằng Next.js 16 (App Router).
- **`apps/api`**: Backend RESTful API xây dựng bằng Express, Prisma và PostgreSQL.
- **`packages/types`**: Chứa các TypeScript interface/types dùng chung cho cả Web và API.
- **`packages/validations`**: Định nghĩa các schema Zod để validate dữ liệu ở cả hai đầu.
- **`packages/config`**: Các cấu hình dùng chung (ESLint, Prettier, Shared Config).

---

## 🚀 Công nghệ sử dụng

### Frontend (`apps/web`)
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4 (với hệ thống `@theme` variables)
- **State Management**: Zustand v5
- **Data Fetching**: TanStack Query v5 (React Query)
- **Form**: React Hook Form + Zod
- **Visualization**: Recharts v3
- **Icons**: Lucide React

### Backend (`apps/api`)
- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **ORM**: Prisma v5 (PostgreSQL)
- **Authentication**: JWT (Access Token & Refresh Token)
- **Logger**: Winston + Morgan
- **File Handling**: Multer (Upload ảnh) & XLSX (Xử lý Excel)

---

## 🛠️ Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- **Node.js**: >= 20.x
- **pnpm**: >= 10.x (Bắt buộc để quản lý Monorepo)

### 2. Cài đặt Dependencies
Từ thư mục gốc của dự án, chạy:
```bash
pnpm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` từ các file mẫu trong từng folder ứng dụng:
- Tại `apps/api/.env`: Cấu hình `DATABASE_URL` (PostgreSQL) và `JWT_SECRET`.
- Tại `apps/web/.env`: Cấu hình `NEXT_PUBLIC_API_URL` trỏ về Backend.

### 4. Thiết lập Cơ sở dữ liệu (Backend)
```bash
cd apps/api
pnpm db:generate  # Tạo Prisma Client
pnpm db:push      # Đẩy schema lên database
pnpm db:seed      # Khởi tạo dữ liệu mẫu (Admin, Roles, v.v.)
```

---

## 💻 Lệnh phát triển

Chạy các lệnh sau tại thư mục gốc:

- **Phát triển toàn bộ dự án (cả Web & API):**
  ```bash
  pnpm dev
  ```

- **Chỉ chạy Frontend:**
  ```bash
  pnpm dev:web
  ```

- **Chỉ chạy Backend:**
  ```bash
  pnpm dev:api
  ```

- **Kiểm tra lỗi TypeScript:**
  ```bash
  pnpm type-check
  ```

---

## 🎨 Quy chuẩn Design (Frontend)
Dự án tuân thủ nghiêm ngặt hệ thống thiết kế tại `docs/DESIGN.md`:
- Sử dụng màu sắc qua **CSS Variables** của Tailwind 4 (VD: `bg-card-white`, `text-text-primary`).
- Tuyệt đối không hardcode mã màu Hex trong component.
- Ưu tiên tái sử dụng các Shared Components trong `src/components/`.

---

## 📄 Giấy phép
Dự án nội bộ / Bản quyền thuộc về SecondNot2.
