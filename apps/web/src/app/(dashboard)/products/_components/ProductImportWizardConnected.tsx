"use client";

import React from "react";
import { AlertCircle, CheckCircle2, FileUp } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/Toast";
import { useImportProducts } from "@/lib/hooks/use-products";

export function ProductImportWizardConnected() {
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const importMutation = useImportProducts();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!file) {
      setError("Vui lòng chọn file Excel");
      return;
    }
    setError(null);
    try {
      const r = await importMutation.mutateAsync(file);
      toast.success(
        `Nhập sản phẩm: ${r.imported} thành công, ${r.skipped} bỏ qua, ${r.errors.length} lỗi`,
      );
    } catch (err) {
      const msg = getApiErrorMessage(err, "Không thể nhập sản phẩm");
      setError(msg);
      toast.error(msg);
    }
  };

  const result = importMutation.data;

  return (
    <div className="bg-card-white rounded-2xl border border-border-ui shadow-sm overflow-hidden w-full">
      <div className="p-8 space-y-6">
        <div className="aspect-video bg-background-app/50 border-3 border-dashed border-border-ui rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <FileUp className="w-8 h-8 text-accent" />
          </div>
          <h4 className="text-lg font-bold text-text-primary">
            Tải file sản phẩm lên hệ thống
          </h4>
          <p className="text-sm text-text-secondary mt-1">
            Hỗ trợ file .xlsx hoặc .xls
          </p>
          <label className="mt-6 px-6 py-2 bg-card-white border border-border-ui text-sm font-bold text-text-primary rounded-xl shadow-sm hover:border-accent hover:text-accent transition-colors cursor-pointer">
            Chọn file Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          {file && (
            <p className="text-xs text-text-secondary mt-3">
              Đã chọn: {file.name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 p-4 bg-info/5 border border-info/20 rounded-2xl text-info">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-[12px] leading-relaxed">
            File cần có các cột tối thiểu: SKU, Tên sản phẩm, Đơn vị, Mã danh
            mục. Các dòng lỗi sẽ được bỏ qua và trả về lý do.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-danger/5 border border-danger/20 text-sm text-danger">
            {error}
          </div>
        )}

        {result && (
          <div className="p-5 rounded-xl bg-success/5 border border-success/20 space-y-3">
            <div className="flex items-center gap-2 text-success font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> Hoàn tất import
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-card-white border border-border-ui rounded-lg p-3">
                Imported: <b>{result.imported}</b>
              </div>
              <div className="bg-card-white border border-border-ui rounded-lg p-3">
                Skipped: <b>{result.skipped}</b>
              </div>
              <div className="bg-card-white border border-border-ui rounded-lg p-3">
                Errors: <b>{result.errors.length}</b>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="max-h-64 overflow-auto bg-card-white border border-border-ui rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background-app/50">
                    <tr>
                      <th className="px-3 py-2">Dòng</th>
                      <th className="px-3 py-2">Lý do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((item) => (
                      <tr
                        key={`${item.row}-${item.reason}`}
                        className="border-t border-border-ui"
                      >
                        <td className="px-3 py-2 font-bold">{item.row}</td>
                        <td className="px-3 py-2 text-text-secondary">
                          {item.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={importMutation.isPending}
          className="w-full py-3 bg-accent text-white font-bold rounded-xl shadow-xl shadow-accent/20 disabled:opacity-60 hover:bg-accent/90 transition-colors"
        >
          {importMutation.isPending ? "Đang nhập..." : "Nhập sản phẩm"}
        </button>
      </div>
    </div>
  );
}
