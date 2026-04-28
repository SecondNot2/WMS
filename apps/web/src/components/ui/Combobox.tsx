"use client";

import React from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption<TValue extends string = string> {
  value: TValue;
  label: string;
  description?: string;
  hint?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Raw object cho render tùy biến */
  raw?: unknown;
}

interface ComboboxProps<TValue extends string = string> {
  value: TValue | "";
  onChange: (value: TValue | "", option?: ComboboxOption<TValue>) => void;
  options: ComboboxOption<TValue>[];

  /** Placeholder khi chưa chọn */
  placeholder?: string;
  /** Label hiển thị nhỏ phía trên (optional) */
  label?: string;

  /** Bật ô tìm kiếm nội bộ (mặc định bật khi >7 options) */
  searchable?: boolean;
  /** Khi truyền — combobox sẽ gọi onSearchChange khi gõ (server-side search) */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  /** Cho phép xóa selection (hiện nút X) */
  clearable?: boolean;

  /** Trạng thái */
  loading?: boolean;
  errorMessage?: string;
  emptyMessage?: string;

  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  /** Width của dropdown — default theo button */
  dropdownWidth?: number;
  /** Render tùy biến cho item */
  renderOption?: (option: ComboboxOption<TValue>) => React.ReactNode;
  /** Render tùy biến cho text trong button */
  renderTrigger?: (option?: ComboboxOption<TValue>) => React.ReactNode;
}

const DROPDOWN_OFFSET = 4;
const DROPDOWN_MAX_HEIGHT = 320;

/**
 * Combobox dùng chung — render dropdown qua React Portal để KHÔNG bị clip
 * bởi các container `overflow-*`. Hỗ trợ search nội bộ hoặc server-side,
 * keyboard navigation (↑ ↓ Enter Esc), clearable, disabled state.
 */
export function Combobox<TValue extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  label,
  searchable,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Tìm...",
  clearable = false,
  loading,
  errorMessage,
  emptyMessage = "Không có kết quả",
  hasError,
  disabled,
  className,
  dropdownWidth,
  renderOption,
  renderTrigger,
}: ComboboxProps<TValue>) {
  const [open, setOpen] = React.useState(false);
  const [internalSearch, setInternalSearch] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
    placeAbove: boolean;
  } | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isControlledSearch = searchValue !== undefined && onSearchChange;
  const search = isControlledSearch ? (searchValue ?? "") : internalSearch;
  const showSearch =
    searchable ?? (isControlledSearch || options.length > 7);

  const filtered = React.useMemo(() => {
    if (isControlledSearch || !showSearch || !search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        o.hint?.toLowerCase().includes(q),
    );
  }, [options, isControlledSearch, showSearch, search]);

  const selected = options.find((o) => o.value === value);

  const computePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const width = dropdownWidth ?? rect.width;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const placeAbove =
      spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow;

    const top = placeAbove
      ? rect.top - DROPDOWN_OFFSET
      : rect.bottom + DROPDOWN_OFFSET;

    // Tránh tràn khỏi viewport ngang
    let left = rect.left;
    if (left + width > window.innerWidth - 8) {
      left = window.innerWidth - width - 8;
    }
    if (left < 8) left = 8;

    setPosition({ top, left, width, placeAbove });
  }, [dropdownWidth]);

  React.useEffect(() => {
    if (!open) return;
    computePosition();
    const handler = () => computePosition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open, computePosition]);

  // Đóng khi click ngoài
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset highlight khi danh sách đổi
  React.useEffect(() => {
    setHighlight(0);
  }, [filtered.length, open]);

  // Focus input khi mở
  React.useEffect(() => {
    if (open && showSearch) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, showSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[highlight];
      if (target && !target.disabled) {
        handleSelect(target);
      }
    }
  };

  const handleSelect = (option: ComboboxOption<TValue>) => {
    onChange(option.value, option);
    setOpen(false);
    if (!isControlledSearch) setInternalSearch("");
    triggerRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <label className="block text-[12px] font-semibold text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full px-3 py-2 text-sm bg-card-white border rounded-lg outline-none transition-all flex items-center justify-between gap-2 group",
          hasError ? "border-danger" : "border-border-ui",
          open && !hasError && "border-accent ring-2 ring-accent/15",
          disabled && "opacity-60 cursor-not-allowed",
          !disabled && "hover:border-accent/60",
        )}
      >
        <span
          className={cn(
            "truncate text-left flex-1 min-w-0",
            !selected && "text-text-secondary",
          )}
        >
          {renderTrigger
            ? renderTrigger(selected)
            : selected
              ? (
                  <span className="flex items-center gap-2 truncate">
                    {selected.icon}
                    <span className="truncate text-text-primary">
                      {selected.label}
                    </span>
                  </span>
                )
              : placeholder}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {clearable && selected && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              className="p-0.5 text-text-secondary hover:text-danger rounded transition-colors"
              aria-label="Xóa lựa chọn"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronsUpDown
            className={cn(
              "w-4 h-4 text-text-secondary transition-transform",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      {open &&
        position &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            style={{
              position: "fixed",
              top: position.placeAbove ? undefined : position.top,
              bottom: position.placeAbove
                ? window.innerHeight - position.top
                : undefined,
              left: position.left,
              width: position.width,
              zIndex: 70,
            }}
            className="bg-card-white border border-border-ui rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {showSearch && (
              <div className="relative border-b border-border-ui">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => {
                    if (isControlledSearch) onSearchChange?.(e.target.value);
                    else setInternalSearch(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-card-white outline-none"
                />
              </div>
            )}

            <div
              className="overflow-y-auto"
              style={{ maxHeight: DROPDOWN_MAX_HEIGHT - (showSearch ? 44 : 0) }}
            >
              {loading ? (
                <div className="flex items-center gap-2 px-4 py-6 text-sm text-text-secondary">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                </div>
              ) : errorMessage ? (
                <div className="px-4 py-6 text-sm text-danger">
                  {errorMessage}
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-text-secondary">
                  {emptyMessage}
                </div>
              ) : (
                <ul className="py-1">
                  {filtered.map((option, index) => {
                    const isSelected = option.value === value;
                    const isHighlighted = index === highlight;
                    return (
                      <li key={option.value} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          disabled={option.disabled}
                          onMouseEnter={() => setHighlight(index)}
                          onClick={() => handleSelect(option)}
                          className={cn(
                            "w-full flex items-start gap-3 px-3 py-2 text-left transition-colors",
                            isHighlighted && !option.disabled
                              ? "bg-background-app/80"
                              : "",
                            isSelected && "bg-accent/5",
                            option.disabled && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          {option.icon && (
                            <span className="shrink-0 mt-0.5">{option.icon}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            {renderOption ? (
                              renderOption(option)
                            ) : (
                              <>
                                <p className="text-[13px] font-medium text-text-primary truncate">
                                  {option.label}
                                </p>
                                {option.description && (
                                  <p className="text-[11px] text-text-secondary truncate">
                                    {option.description}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          {option.hint && (
                            <span className="text-[11px] text-text-secondary shrink-0 mt-0.5">
                              {option.hint}
                            </span>
                          )}
                          {isSelected && (
                            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
