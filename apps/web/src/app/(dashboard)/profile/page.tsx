"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  KeyRound,
  Mail,
  Shield,
  UserCircle2,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMe } from "@/lib/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { ProfileInfoForm } from "./_components/ProfileInfoForm";
import { ChangePasswordForm } from "./_components/ChangePasswordForm";
import { ROLE_LABELS } from "@/lib/permissions";

type TabKey = "info" | "password";

export default function ProfilePage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-5">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-text-secondary">
            Đang tải...
          </div>
        </div>
      }
    >
      <ProfilePageContent />
    </React.Suspense>
  );
}

function ProfilePageContent() {
  const { data: user, isLoading, isError, error } = useMe();
  const searchParams = useSearchParams();
  const initialTab: TabKey =
    searchParams.get("tab") === "password" ? "password" : "info";
  const [tab, setTab] = React.useState<TabKey>(initialTab);

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-text-secondary">
          Đang tải...
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-5">
        <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-10 text-center text-sm text-danger">
          {getApiErrorMessage(error, "Không thể tải thông tin tài khoản")}
        </div>
      </div>
    );
  }

  const avatar =
    user.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
  const roleLabel = ROLE_LABELS[user.role] ?? user.role;

  return (
    <div className="p-5 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          Tài khoản của tôi
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Quản lý thông tin cá nhân và bảo mật tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 text-center">
            <img
              src={avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border border-border-ui bg-background-app mx-auto"
            />
            <h2 className="text-xl font-bold text-text-primary mt-4">
              {user.name}
            </h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
            <div className="mt-4 flex justify-center">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-info/10 text-info">
                {roleLabel}
              </span>
            </div>
          </div>

          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold">
                  Email
                </p>
                <p className="text-sm font-semibold text-text-primary break-all">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-info" />
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold">
                  Vai trò
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {roleLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-success" />
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold">
                  Mã tài khoản
                </p>
                <p className="text-xs font-mono text-text-primary break-all">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-5">
          <div className="bg-card-white rounded-xl border border-border-ui shadow-sm flex">
            <button
              type="button"
              onClick={() => setTab("info")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2",
                tab === "info"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary",
              )}
            >
              <UserRound className="w-4 h-4" />
              Thông tin cá nhân
            </button>
            <button
              type="button"
              onClick={() => setTab("password")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2",
                tab === "password"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary",
              )}
            >
              <KeyRound className="w-4 h-4" />
              Đổi mật khẩu
            </button>
          </div>

          {tab === "info" ? (
            <ProfileInfoForm user={user} />
          ) : (
            <ChangePasswordForm />
          )}
        </div>
      </div>

      {/* Decoration: header icon */}
      <div className="sr-only">
        <UserCircle2 />
      </div>
    </div>
  );
}
