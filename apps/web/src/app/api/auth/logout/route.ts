import { handle, ok } from "@/server/middleware/handler";

export const POST = handle({ authenticated: true }, async () => {
  // Stateless JWT — client tự xóa token. Endpoint chỉ để FE gọi cho đúng quy trình.
  return ok({ message: "Đã đăng xuất" });
});
