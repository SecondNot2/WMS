"use client";

export default function ProductActivityLogPage() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Nhật ký hoạt động sản phẩm
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Nhật ký tổng hợp sẽ được kết nối khi có endpoint activity-log riêng.
          </p>
        </div>
      </div>

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-background-app mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📦</span>
        </div>
        <h2 className="text-sm font-bold text-text-primary mb-2">
          Chưa có endpoint nhật ký tổng hợp
        </h2>
        <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
          Lịch sử tồn kho theo từng sản phẩm đã được kết nối trong trang chi
          tiết sản phẩm qua endpoint /products/:id/stock-history.
        </p>
      </div>
    </div>
  );
}
