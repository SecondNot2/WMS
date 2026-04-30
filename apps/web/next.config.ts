import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Self-contained server build for Docker (~150MB image vs ~1GB).
  // Vercel ignores this flag and uses its own build pipeline.
  output: "standalone",

  // pnpm monorepo dùng symlinks (giống pnpm link) → Turbopack cần
  // root trỏ tới thư mục cha chứa cả project và linked deps = monorepo root.
  // Script luôn chạy từ apps/web nên cwd = apps/web → root = ../..
  // Ref: node_modules/next/dist/docs/.../turbopack.md
  turbopack: {
    root: path.resolve(process.cwd(), "..", ".."),
  },

  // For Next.js standalone in monorepos, trace files from repo root.
  outputFileTracingRoot: path.resolve(process.cwd(), "..", ".."),
};

export default nextConfig;
