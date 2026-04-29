import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./lib/logger";
import { attachWebSocketServer } from "./lib/websocket";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import rolesRoutes from "./routes/roles.routes";
import productsRoutes from "./routes/products.routes";
import categoriesRoutes from "./routes/categories.routes";
import suppliersRoutes from "./routes/suppliers.routes";
import recipientsRoutes from "./routes/recipients.routes";
import inboundRoutes from "./routes/inbound.routes";
import outboundRoutes from "./routes/outbound.routes";
import inventoryRoutes from "./routes/inventory.routes";
import alertsRoutes from "./routes/alerts.routes";
import reportsRoutes from "./routes/reports.routes";
import statisticsRoutes from "./routes/statistics.routes";
import activityLogRoutes from "./routes/activityLog.routes";
import settingsRoutes from "./routes/settings.routes";

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
app.use("/categories", categoriesRoutes);
app.use("/suppliers", suppliersRoutes);
app.use("/recipients", recipientsRoutes);
app.use("/inbound", inboundRoutes);
app.use("/outbound", outboundRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/alerts", alertsRoutes);
app.use("/reports", reportsRoutes);
app.use("/statistics", statisticsRoutes);
app.use("/activity-log", activityLogRoutes);
app.use("/settings", settingsRoutes);

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
const server = http.createServer(app);
attachWebSocketServer(server);

server.listen(PORT, () => {
  logger.info(`API running on http://localhost:${PORT}`);
  logger.info(`WebSocket on ws://localhost:${PORT}/ws?token=<accessToken>`);
});

export default app;
