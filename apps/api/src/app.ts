import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./lib/logger";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import rolesRoutes from "./routes/roles.routes";
import productsRoutes from "./routes/products.routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("dev", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }),
);

// Health check
app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", uptime: process.uptime() } });
});

// Mount feature routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/roles", rolesRoutes);
app.use("/products", productsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} không tồn tại`,
    },
  });
});

// Global error handler — phải ở cuối
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  logger.info(`API running on http://localhost:${PORT}`);
});

export default app;
