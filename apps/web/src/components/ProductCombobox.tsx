"use client";

import React from "react";
import { Package } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { useProduct, useProducts } from "@/lib/hooks/use-products";
import type { Product } from "@wms/types";

interface ProductComboboxProps {
  value: string;
  onChange: (productId: string, product?: Product) => void;
  hasError?: boolean;
  disabled?: boolean;
  excludeIds?: string[];
  placeholder?: string;
  /** Khi truyền — hiển thị hàng "Thêm mới" trong dropdown (forward sang Combobox) */
  onCreateNew?: (search: string) => void;
}

/**
 * Combobox chọn sản phẩm với search server-side, debounce.
 * Dùng cho form phiếu nhập/xuất khi danh mục sản phẩm có thể lớn (>100).
 */
export function ProductCombobox({
  value,
  onChange,
  hasError,
  disabled,
  excludeIds = [],
  placeholder = "Chọn sản phẩm...",
  onCreateNew,
}: ProductComboboxProps) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const listQuery = useProducts({
    limit: 50,
    isActive: true,
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
  });

  // Lưu snapshot product đã chọn để hiện đúng nhãn dù không có trong list
  const [selectedSnapshot, setSelectedSnapshot] =
    React.useState<Product | null>(null);

  const selectedFromList = listQuery.data?.data.find((p) => p.id === value);

  // Sync snapshot từ list query (pattern React 19 — không setState trong effect)
  const [prevFromListId, setPrevFromListId] = React.useState<string | null>(
    selectedFromList?.id ?? null,
  );
  if ((selectedFromList?.id ?? null) !== prevFromListId) {
    setPrevFromListId(selectedFromList?.id ?? null);
    if (selectedFromList) setSelectedSnapshot(selectedFromList);
  }

  const detailQuery = useProduct(
    value && !selectedFromList && !selectedSnapshot ? value : "",
  );

  // Sync snapshot từ detail query khi product không nằm trong list
  const detailId = detailQuery.data?.id ?? null;
  const [prevDetailId, setPrevDetailId] = React.useState<string | null>(
    detailId,
  );
  if (detailId !== prevDetailId) {
    setPrevDetailId(detailId);
    if (detailQuery.data && !selectedFromList && !selectedSnapshot) {
      const { recentStockHistory: _ignored, ...productLike } = detailQuery.data;
      void _ignored;
      setSelectedSnapshot(productLike as Product);
    }
  }

  const options: ComboboxOption<string>[] = React.useMemo(() => {
    const list = listQuery.data?.data ?? [];
    const visible = list.filter(
      (p) => p.id === value || !excludeIds.includes(p.id),
    );
    // Đảm bảo selected luôn xuất hiện trong list dù search không match
    const selected = selectedSnapshot;
    const baseList =
      selected && !visible.some((p) => p.id === selected.id)
        ? [selected, ...visible]
        : visible;

    return baseList.map((product) => ({
      value: product.id,
      label: product.name,
      description: product.barcode
        ? `${product.sku} · ${product.barcode}`
        : product.sku,
      hint: `Tồn: ${product.currentStock} ${product.unit}`,
      icon: (
        <span className="w-7 h-7 rounded-md bg-accent/10 text-accent flex items-center justify-center">
          <Package className="w-3.5 h-3.5" />
        </span>
      ),
      raw: product,
    }));
  }, [listQuery.data, excludeIds, value, selectedSnapshot]);

  const handleChange = (next: string, option?: ComboboxOption<string>) => {
    if (option?.raw) {
      const product = option.raw as Product;
      setSelectedSnapshot(product);
      onChange(product.id, product);
    } else {
      onChange(next);
    }
  };

  const triggerLabel = React.useCallback(
    (opt?: ComboboxOption<string>) => {
      const product = (opt?.raw as Product | undefined) ?? selectedSnapshot;
      if (!product) return placeholder;
      return (
        <span className="flex items-center gap-2 truncate">
          <span className="font-mono text-[12px] text-text-secondary">
            {product.sku}
          </span>
          <span className="text-text-primary truncate">— {product.name}</span>
        </span>
      );
    },
    [placeholder, selectedSnapshot],
  );

  return (
    <Combobox
      value={value}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
      hasError={hasError}
      disabled={disabled}
      loading={listQuery.isLoading}
      errorMessage={
        listQuery.error ? "Không thể tải sản phẩm. Thử lại sau." : undefined
      }
      emptyMessage={
        debouncedSearch
          ? "Không tìm thấy sản phẩm phù hợp"
          : "Hãy thêm sản phẩm vào hệ thống trước"
      }
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Tìm theo SKU, tên, mã vạch..."
      renderTrigger={triggerLabel}
      onCreateNew={onCreateNew}
    />
  );
}
