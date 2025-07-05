"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Globe,
  Settings
} from "lucide-react";
import { DashboardCard, DashboardStatCard } from "@/components/ui/dashboard-card";
import { CRMDashboard } from "@/components/ui/crm-components";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const stats = [
  {
    label: "Total Visitors",
    value: "24,589",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "from-blue-400 to-blue-600"
  },
  {
    label: "Page Views",
    value: "142,334",
    change: "+8.2%",
    trend: "up",
    icon: Eye,
    color: "from-purple-400 to-purple-600"
  },
  {
    label: "Conversion Rate",
    value: "3.47%",
    change: "-2.1%",
    trend: "down",
    icon: MousePointerClick,
    color: "from-green-400 to-green-600"
  },
  {
    label: "Avg. Session",
    value: "2m 34s",
    change: "+18.7%",
    trend: "up",
    icon: TrendingUp,
    color: "from-orange-400 to-orange-600"
  }
];

const recentActivity = [
  { time: "2 hours ago", event: "New analytics data", details: "gprealty-cy.com - 45 new visitors" },
  { time: "4 hours ago", event: "Website tracking active", details: "Real-time events being recorded" },
  { time: "Yesterday", event: "Analytics setup completed", details: "Tracking script successfully installed" },
  { time: "2 days ago", event: "New website added", details: "gprealty-cy.com configured for tracking" },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's what's happening with your analytics platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DashboardStatCard 
                interactive
                glow
                icon={
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                }
                trend={
                  <div className={`flex items-center gap-1 text-xs sm:text-sm ${
                    isPositive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                  }`}>
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    {stat.change}
                  </div>
                }
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">{stat.value}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </DashboardStatCard>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DashboardCard>
          <h2 className="text-lg sm:text-xl font-medium text-foreground mb-4 sm:mb-6">Analytics Platform</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <button 
              onClick={() => router.push('/dashboard/analytics')}
              className="p-3 sm:p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-border/50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
                <h3 className="text-sm sm:text-base text-foreground font-medium group-hover:text-blue-600 transition-colors">View Analytics</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Real-time website analytics dashboard</p>
            </button>
            
            <button 
              onClick={() => router.push('/setup')}
              className="p-3 sm:p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-border/50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-green-500 group-hover:text-green-600 transition-colors" />
                <h3 className="text-sm sm:text-base text-foreground font-medium group-hover:text-green-600 transition-colors">Setup Tracking</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Add websites and configure tracking</p>
            </button>
            
            <button 
              onClick={() => router.push('/dashboard/settings')}
              className="p-3 sm:p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-border/50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-purple-500 group-hover:text-purple-600 transition-colors" />
                <h3 className="text-sm sm:text-base text-foreground font-medium group-hover:text-purple-600 transition-colors">Settings</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Configure analytics preferences</p>
            </button>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <DashboardCard>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-medium text-foreground">Traffic Overview</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/analytics')}
              >
                View Details
              </Button>
            </div>
            {/* Placeholder for chart - in real app, you'd use a charting library */}
            <div className="h-48 sm:h-64 bg-muted/20 rounded-lg flex items-center justify-center border border-border/30">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm sm:text-base text-muted-foreground">Real analytics charts available in Analytics Dashboard</p>
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DashboardCard>
            <h2 className="text-lg sm:text-xl font-medium text-foreground mb-4 sm:mb-6">Recent Activity</h2>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-border/30 last:border-0 last:pb-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-foreground truncate">{activity.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{activity.details}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <DashboardCard>
          <h2 className="text-lg sm:text-xl font-medium text-foreground mb-4 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <button 
              onClick={() => router.push('/setup')}
              className="p-3 sm:p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-border/50 transition-all duration-200 text-left group"
            >
              <h3 className="text-sm sm:text-base text-foreground font-medium mb-1 group-hover:text-orange-500 transition-colors">Add Website</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Configure tracking for a new website</p>
            </button>
            <button 
              onClick={() => router.push('/dashboard/analytics')}
              className="p-3 sm:p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-border/50 transition-all duration-200 text-left group"
            >
              <h3 className="text-sm sm:text-base text-foreground font-medium mb-1 group-hover:text-orange-500 transition-colors">View Reports</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Detailed analytics reports</p>
            </button>
            <button className="p-3 sm:p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-border/50 transition-all duration-200 text-left group">
              <h3 className="text-sm sm:text-base text-foreground font-medium mb-1 group-hover:text-orange-500 transition-colors">Export Data</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Download analytics data</p>
            </button>
          </div>
        </DashboardCard>
      </motion.div>

      {/* CRM Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <CRMDashboard />
      </motion.div>
    </div>
  );
} 