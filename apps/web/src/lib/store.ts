import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@wms/types";

// ─────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────

interface LayoutState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed: boolean) =>
    set({ sidebarCollapsed: collapsed }),
}));

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────

const AUTH_COOKIE = "accessToken";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7d (refresh token TTL)

function setAuthCookie(token: string | null) {
  if (typeof document === "undefined") return;
  if (token) {
    document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } else {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: ({ user, accessToken, refreshToken }) => {
        setAuthCookie(accessToken);
        set({ user, accessToken, refreshToken });
      },
      setAccessToken: (accessToken) => {
        setAuthCookie(accessToken);
        set({ accessToken });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        setAuthCookie(null);
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: "wms-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync cookie từ localStorage khi rehydrate (refresh trang)
        if (state?.accessToken) setAuthCookie(state.accessToken);
      },
    },
  ),
);
