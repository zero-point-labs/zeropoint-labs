"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  CreditCard,
  Globe,
  Menu,
  X,
  LogOut,
  Puzzle,
  ChevronLeft,
  ChevronRight,
  Database,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Dashboard overview"
  },
  {
    href: "/dashboard/setup",
    label: "Setup",
    icon: Database,
    description: "Analytics configuration"
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Traffic & performance"
  },
  {
    href: "/dashboard/website",
    label: "Website",
    icon: Globe,
    description: "Manage your site"
  },
  {
    href: "/dashboard/forms",
    label: "Forms",
    icon: FileText,
    description: "Form submissions"
  },
  {
    href: "/dashboard/crm",
    label: "CRM",
    icon: Users,
    description: "Customer management"
  },
  {
    href: "/dashboard/integrations",
    label: "Integrations",
    icon: Puzzle,
    description: "Connected services"
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
    description: "Plans & invoices"
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    description: "Account settings"
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const { user, isLoading, isDemoMode, logout } = useAuth();

  // Protect the dashboard - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login even if logout fails
      router.push("/login");
    }
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
        />
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!user) {
    return null;
  }

  // Dynamic sidebar classes based on theme
  const getSidebarClasses = () => {
    const baseClasses = `fixed lg:relative inset-y-0 left-0 z-50 flex flex-col backdrop-blur-xl border-r transition-all duration-300 ${
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0 w-72 sm:w-80`;
    
    if (theme === 'dark') {
      return `${baseClasses} bg-black/40 border-white/10`;
    } else {
      return `${baseClasses} sidebar-light border-black/10`;
    }
  };

  // Dynamic backdrop classes
  const getBackdropClasses = () => {
    if (theme === 'dark') {
      return "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden";
    } else {
      return "fixed inset-0 bg-white/60 backdrop-blur-sm z-40 lg:hidden";
    }
  };

  // Dynamic top bar classes
  const getTopBarClasses = () => {
    const baseClasses = "sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-xl border-b";
    
    if (theme === 'dark') {
      return `${baseClasses} bg-black/40 border-white/10`;
    } else {
      return `${baseClasses} bg-white/90 border-black/10`;
    }
  };

  return (
    <div className={`min-h-screen text-foreground flex ${theme === 'dark' ? 'bg-black' : 'bg-slate-50'}`}>
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className={getBackdropClasses()}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "320px",
        }}
        className={getSidebarClasses()}
      >
        {/* Logo */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${
          theme === 'dark' ? 'border-white/10' : 'border-black/10'
        }`}>
          <Link href="/dashboard" className={`transition-opacity duration-200 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
            <Image
              src={theme === 'light' ? "/zeropoint-logo-black.png" : "/zeropoint-logo.png"}
              alt="Zero Point Labs"
              width={150}
              height={180}
              className="transition-all duration-300 w-32 sm:w-[150px]"
            />
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-white/5 hover:bg-white/10 text-slate-400' 
                : 'bg-black/5 hover:bg-black/10 text-slate-600'
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`lg:hidden transition-colors ${
              theme === 'dark' 
                ? 'text-slate-400 hover:text-white' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info - Show demo mode indicator */}
        {!isCollapsed && (
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${
            theme === 'dark' ? 'border-white/10' : 'border-black/10'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                isDemoMode 
                  ? 'bg-orange-500 text-white' 
                  : theme === 'dark'
                    ? 'bg-white/10 text-white'
                    : 'bg-black/10 text-black'
              }`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  {user.name}
                </p>
                <p className={`text-xs truncate ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {user.email}
                </p>
                {isDemoMode && (
                  <span className="inline-block px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded-full mt-1">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? theme === 'dark'
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30"
                      : "bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-600 border border-orange-500/20"
                    : theme === 'dark'
                      ? "hover:bg-white/5 text-slate-400 hover:text-white"
                      : "hover:bg-black/5 text-slate-600 hover:text-black"
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                  isActive 
                    ? theme === 'dark' 
                      ? "text-orange-400" 
                      : "text-orange-600"
                    : theme === 'dark'
                      ? "text-slate-500 group-hover:text-white"
                      : "text-slate-500 group-hover:text-black"
                }`} />
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                    <span className={`text-xs transition-all duration-200 ${
                      isActive 
                        ? theme === 'dark' 
                          ? "text-orange-400/70" 
                          : "text-orange-600/70"
                        : theme === 'dark'
                          ? "text-slate-600 group-hover:text-slate-400"
                          : "text-slate-500 group-hover:text-slate-600"
                    }`}>
                      {item.description}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section with theme toggle and logout */}
        <div className={`p-3 sm:p-4 border-t space-y-2 ${
          theme === 'dark' ? 'border-white/10' : 'border-black/10'
        }`}>
          {/* Theme Toggle */}
          <ThemeToggle 
            variant="full" 
            className={isCollapsed ? "w-12 h-12 justify-center px-0" : ""}
          />
          
          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`w-full justify-start gap-3 transition-colors ${
              isCollapsed ? "px-3" : ""
            } ${
              theme === 'dark'
                ? "text-slate-400 hover:text-white hover:bg-white/5"
                : "text-slate-600 hover:text-black hover:bg-black/5"
            }`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className={getTopBarClasses()}>
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden transition-colors ${
                theme === 'dark'
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-black"
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className={`text-lg sm:text-xl font-semibold truncate ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Dashboard {isDemoMode && <span className="text-orange-500 text-sm sm:text-base">(Demo)</span>}
            </h1>
          </div>
          <div className="hidden sm:block lg:hidden">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 