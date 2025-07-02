import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface DashboardCardProps extends React.ComponentProps<typeof Card> {
  glow?: boolean;
  interactive?: boolean;
}

export function DashboardCard({
  className,
  glow = false,
  interactive = false,
  ...props
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        // Base styles - theme aware with proper borders
        "relative backdrop-blur-xl p-6",
        // Dark mode styles
        "dark:bg-black/40 dark:border-white/20",
        // Light mode styles  
        "bg-white/80 border-slate-200/50",
        // Subtle shadow for depth
        "shadow-lg",
        "dark:shadow-black/20 shadow-slate-200/50",
        // Hover effects when interactive
        interactive && [
          "dark:hover:bg-black/50 hover:bg-white/90",
          "dark:hover:border-white/30 hover:border-slate-200/70",
          "hover:shadow-xl",
          "dark:hover:shadow-black/30 hover:shadow-slate-200/70",
          "transition-all duration-300 cursor-pointer",
        ],
        // Optional glow effect
        glow && [
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-gradient-to-r before:from-orange-500/10 before:to-orange-600/10",
          "before:blur-xl before:-z-10",
          "before:transition-opacity before:duration-500",
          "hover:before:opacity-100 before:opacity-0",
        ],
        className
      )}
      {...props}
    />
  );
}

// Stat card variant with icon slot
interface DashboardStatCardProps extends DashboardCardProps {
  icon?: React.ReactNode;
  trend?: React.ReactNode;
}

export function DashboardStatCard({
  icon,
  trend,
  children,
  className,
  ...props
}: DashboardStatCardProps) {
  return (
    <DashboardCard className={cn("group", className)} {...props}>
      {(icon || trend) && (
        <div className="flex items-center justify-between mb-4">
          {icon}
          {trend}
        </div>
      )}
      {children}
    </DashboardCard>
  );
} 