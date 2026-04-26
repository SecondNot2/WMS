import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // pnpm monorepo dùng symlinks (giống pnpm link) → Turbopack cần
  // root trỏ tới thư mục cha chứa cả project và linked deps = monorepo root.
  // Script luôn chạy từ apps/web nên cwd = apps/web → root = ../..
  // Ref: node_modules/next/dist/docs/.../turbopack.md
  turbopack: {
    root: path.resolve(process.cwd(), "..", ".."),
  },
};

export default nextConfig;
