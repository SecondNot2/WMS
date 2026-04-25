import React from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { useLayoutStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "./Breadcrumb";

interface TopbarProps {}

export function Topbar({}: TopbarProps) {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();

  return (
    <header className={cn(
      "fixed top-0 right-0 h-16 bg-white border-b border-border-ui shadow-sm z-40 flex items-center justify-between px-6 transition-all duration-300",
      sidebarCollapsed ? "left-18" : "left-60"
    )}>
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-background-app rounded-lg transition-colors text-text-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Breadcrumb />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="pl-10 pr-4 py-2 bg-background-app border-transparent rounded-full text-xs focus:bg-white focus:border-accent outline-none transition-all w-64"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-background-app rounded-lg transition-colors text-text-secondary relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-danger text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-3 pl-3 border-l border-border-ui cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">Nguyễn Văn A</p>
              <p className="text-[10px] text-text-secondary">Quản trị viên</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
