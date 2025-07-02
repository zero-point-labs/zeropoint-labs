"use client";

import { motion } from "framer-motion";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Clock
} from "lucide-react";

const trafficSources = [
  { source: "Direct", visitors: "8,234", percentage: 33.5, color: "bg-orange-500" },
  { source: "Organic Search", visitors: "6,123", percentage: 24.9, color: "bg-blue-500" },
  { source: "Social Media", visitors: "4,891", percentage: 19.9, color: "bg-purple-500" },
  { source: "Referral", visitors: "3,234", percentage: 13.2, color: "bg-green-500" },
  { source: "Email", visitors: "2,107", percentage: 8.5, color: "bg-yellow-500" },
];

const topPages = [
  { page: "/", title: "Homepage", views: "45,234", avgTime: "2:34" },
  { page: "/services", title: "Services", views: "23,456", avgTime: "3:12" },
  { page: "/about", title: "About Us", views: "18,234", avgTime: "1:45" },
  { page: "/portfolio", title: "Portfolio", views: "15,678", avgTime: "4:23" },
  { page: "/contact", title: "Contact", views: "12,345", avgTime: "1:23" },
];

const deviceStats = [
  { device: "Desktop", icon: Monitor, percentage: 58.5, sessions: "14,384" },
  { device: "Mobile", icon: Smartphone, percentage: 35.2, sessions: "8,656" },
  { device: "Tablet", icon: Tablet, percentage: 6.3, sessions: "1,549" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">Analytics Overview</h1>
          <p className="text-muted-foreground">Track your website performance and visitor behavior</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 border border-border hover:border-border/70">
            Last 30 days
          </button>
          <button className="px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 border border-border hover:border-border/70">
            Export
          </button>
        </div>
      </div>

      {/* Traffic Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DashboardCard>
          <h2 className="text-xl font-medium text-foreground mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">{source.source}</span>
                  <span className="text-sm text-muted-foreground">{source.visitors} ({source.percentage}%)</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <motion.div 
                    className={`${source.color} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${source.percentage}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </motion.div>

      {/* Top Pages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-foreground">Top Pages</h2>
            <BarChart3 className="h-5 w-5 text-orange-400" />
          </div>
          <div className="space-y-1">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                  <div>
                    <p className="text-sm text-foreground group-hover:text-orange-400 transition-colors">{page.title}</p>
                    <p className="text-xs text-muted-foreground">{page.page}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{page.views}</p>
                  <p className="text-xs text-muted-foreground">Avg: {page.avgTime}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </motion.div>

      {/* Device Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DashboardCard>
          <h2 className="text-xl font-medium text-foreground mb-6">Device Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deviceStats.map((device, index) => {
              const Icon = device.icon;
              return (
                <motion.div
                  key={device.device}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 rounded-lg bg-muted/20 border border-border hover:border-border/70 hover:bg-muted/30 transition-all duration-200 group"
                >
                  <Icon className="h-12 w-12 text-orange-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-semibold text-foreground mb-1">{device.percentage}%</h3>
                  <p className="text-sm text-muted-foreground mb-2">{device.device}</p>
                  <p className="text-xs text-muted-foreground">{device.sessions} sessions</p>
                </motion.div>
              );
            })}
          </div>
        </DashboardCard>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard className="p-4" interactive glow>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-xs text-muted-foreground">Bounce Rate</p>
              <p className="text-lg font-semibold text-foreground">42.3%</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard className="p-4" interactive glow>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-xs text-muted-foreground">New Users</p>
              <p className="text-lg font-semibold text-foreground">68.5%</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard className="p-4" interactive glow>
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-xs text-muted-foreground">Avg. Duration</p>
              <p className="text-lg font-semibold text-foreground">3:42</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard className="p-4" interactive glow>
          <div className="flex items-center gap-3">
            <Globe className="h-8 w-8 text-orange-400" />
            <div>
              <p className="text-xs text-muted-foreground">Countries</p>
              <p className="text-lg font-semibold text-foreground">47</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
} 