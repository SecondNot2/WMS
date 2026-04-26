"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "text-danger bg-danger/10",
      button: "bg-danger hover:bg-danger/90 shadow-danger/20",
    },
    warning: {
      icon: "text-warning bg-warning/10",
      button: "bg-warning hover:bg-warning/90 shadow-warning/20",
    },
    info: {
      icon: "text-accent bg-accent/10",
      button: "bg-accent hover:bg-accent/90 shadow-accent/20",
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-border-ui w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", style.icon)}>
              <AlertCircle className="w-8 h-8" />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-background-app rounded-full transition-colors text-text-secondary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-bold text-text-primary tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-border-ui text-sm font-bold text-text-primary rounded-xl hover:bg-background-app transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn(
                "flex-1 py-3 text-white text-sm font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0",
                style.button
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
