import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Users,
  Settings,
  UserCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Home,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Tasks", path: "/tasks", icon: ClipboardList },
  { label: "Calendar", path: "/calendar", icon: CalendarDays },
  { label: "Communication", path: "/communication", icon: MessageSquare },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Team", path: "/team", icon: Users },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Profile", path: "/profile", icon: UserCircle },
  { label: "Notifications", path: "/notifications", icon: Bell },
];

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarContent = (
    <div
      className={`flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-60"
      } h-full`}
    >
      {/* Logo & collapse button */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="font-bold text-sm text-sidebar-primary-foreground">
            TeamCollab
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              title={collapsed ? link.label : undefined}
            >
              {link.icon && <link.icon className="h-4 w-4 shrink-0" />}
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info & logout */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="mb-2 px-2">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user.email}
            </p>
          </div>
        )}
        <Link
          to="/"
          onClick={logout}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top bar (mobile only) */}
      <div className="lg:hidden flex items-center justify-between border-b border-border px-4 h-14">
        <Sheet>
          <SheetTrigger>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            {sidebarContent}
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-foreground text-sm">
          TeamCollab
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar (hidden on mobile) */}
        <div className="hidden lg:flex">{sidebarContent}</div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
