"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { DashboardCard, DashboardStatCard } from "@/components/ui/dashboard-card";
import { CRMDashboard } from "@/components/ui/crm-components";

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
  { time: "2 hours ago", event: "New form submission", details: "Contact form - John Doe" },
  { time: "4 hours ago", event: "Site deployed", details: "Version 2.1.0 live" },
  { time: "Yesterday", event: "SSL renewed", details: "Certificate updated successfully" },
  { time: "2 days ago", event: "Backup completed", details: "Full site backup stored" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                }
                trend={
                  <div className={`flex items-center gap-1 text-sm ${
                    isPositive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                  }`}>
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
                }
              >
                <h3 className="text-2xl font-semibold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </DashboardStatCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <DashboardCard>
            <h2 className="text-xl font-medium text-foreground mb-6">Traffic Overview</h2>
            {/* Placeholder for chart - in real app, you'd use a charting library */}
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center border border-border/30">
              <p className="text-muted-foreground">Chart visualization would go here</p>
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
            <h2 className="text-xl font-medium text-foreground mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-border/30 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.details}</p>
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
          <h2 className="text-xl font-medium text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-border/50 transition-all duration-200 text-left group">
              <h3 className="text-foreground font-medium mb-1 group-hover:text-orange-500 transition-colors">Edit Homepage</h3>
              <p className="text-sm text-muted-foreground">Update content and images</p>
            </button>
            <button className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-border/50 transition-all duration-200 text-left group">
              <h3 className="text-foreground font-medium mb-1 group-hover:text-orange-500 transition-colors">View Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed traffic reports</p>
            </button>
            <button className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/30 hover:border-border/50 transition-all duration-200 text-left group">
              <h3 className="text-foreground font-medium mb-1 group-hover:text-orange-500 transition-colors">Check Forms</h3>
              <p className="text-sm text-muted-foreground">New submissions waiting</p>
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