"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardCard, DashboardStatCard } from "@/components/ui/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  Eye,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Mail,
  Activity,
  Target,
  MapPin,
  Chrome,
  Search,
  Link2,
  Share2,
  CreditCard,
  FileText,
  PlayCircle,
  ChevronDown,
  Filter,
  RefreshCw,
  ExternalLink,
  Zap
} from "lucide-react";

// Mock data for comprehensive analytics
const performanceMetrics = {
  today: {
    visitors: "1,234",
    unique: "987",
    bounceRate: "42.3%",
    avgDuration: "3:42",
    pageViews: "5,678",
    conversionRate: "3.2%"
  },
  week: {
    visitors: "8,456",
    unique: "6,234",
    bounceRate: "38.7%",
    avgDuration: "4:12",
    pageViews: "42,334",
    conversionRate: "3.8%"
  },
  month: {
    visitors: "34,567",
    unique: "28,901",
    bounceRate: "41.2%",
    avgDuration: "3:56",
    pageViews: "178,234",
    conversionRate: "3.5%"
  }
};

const trafficSources = [
  { source: "Organic Search", visitors: "12,456", percentage: 35.2, change: "+12.3%", trend: "up", icon: Search, details: { google: "9,234", bing: "2,456", other: "766" } },
  { source: "Direct Traffic", visitors: "8,234", percentage: 23.3, change: "+5.7%", trend: "up", icon: Globe, details: { typed: "5,123", bookmarks: "3,111" } },
  { source: "Social Media", visitors: "6,891", percentage: 19.5, change: "-2.1%", trend: "down", icon: Share2, details: { facebook: "3,456", instagram: "2,234", twitter: "1,201" } },
  { source: "Referral", visitors: "4,567", percentage: 12.9, change: "+8.9%", trend: "up", icon: Link2, details: { "example.com": "2,345", "blog.site": "1,234", other: "988" } },
  { source: "Email Campaign", visitors: "2,107", percentage: 6.0, change: "+15.2%", trend: "up", icon: Mail, details: { newsletter: "1,543", promotional: "564" } },
  { source: "Paid Ads", visitors: "1,098", percentage: 3.1, change: "-5.3%", trend: "down", icon: CreditCard, details: { google: "678", meta: "420" } },
];

const topPages = [
  { page: "/", title: "Homepage", views: "45,234", avgTime: "2:34", exitRate: "23.4%", change: "+12.3%" },
  { page: "/services", title: "Services", views: "23,456", avgTime: "3:12", exitRate: "34.2%", change: "+8.7%" },
  { page: "/about", title: "About Us", views: "18,234", avgTime: "1:45", exitRate: "42.1%", change: "-2.3%" },
  { page: "/portfolio", title: "Portfolio", views: "15,678", avgTime: "4:23", exitRate: "28.9%", change: "+15.6%" },
  { page: "/contact", title: "Contact", views: "12,345", avgTime: "1:23", exitRate: "67.8%", change: "+3.2%" },
  { page: "/blog/article-1", title: "Blog: SEO Tips", views: "8,901", avgTime: "5:12", exitRate: "45.6%", change: "+24.5%" },
  { page: "/pricing", title: "Pricing", views: "7,654", avgTime: "2:56", exitRate: "52.3%", change: "-1.2%" },
];

const demographics = {
  countries: [
    { name: "United States", visitors: "12,345", percentage: 34.5, flag: "🇺🇸" },
    { name: "United Kingdom", visitors: "6,789", percentage: 19.0, flag: "🇬🇧" },
    { name: "Canada", visitors: "4,567", percentage: 12.8, flag: "🇨🇦" },
    { name: "Australia", visitors: "3,456", percentage: 9.7, flag: "🇦🇺" },
    { name: "Germany", visitors: "2,345", percentage: 6.5, flag: "🇩🇪" },
    { name: "Others", visitors: "6,234", percentage: 17.5, flag: "🌍" },
  ],
  devices: [
    { device: "Desktop", icon: Monitor, percentage: 58.5, sessions: "20,789", browser: { chrome: 65, safari: 20, firefox: 10, other: 5 } },
    { device: "Mobile", icon: Smartphone, percentage: 35.2, sessions: "12,456", os: { ios: 55, android: 43, other: 2 } },
    { device: "Tablet", icon: Tablet, percentage: 6.3, sessions: "2,234", os: { ios: 70, android: 28, other: 2 } },
  ],
  browsers: [
    { name: "Chrome", percentage: 62.3, color: "bg-blue-500" },
    { name: "Safari", percentage: 18.7, color: "bg-gray-500" },
    { name: "Firefox", percentage: 9.2, color: "bg-orange-500" },
    { name: "Edge", percentage: 6.8, color: "bg-green-500" },
    { name: "Others", percentage: 3.0, color: "bg-purple-500" },
  ]
};

const userBehavior = {
  events: [
    { event: "Button Clicks", count: "4,567", change: "+12.3%", trend: "up", icon: MousePointerClick },
    { event: "Form Starts", count: "2,345", change: "+8.7%", trend: "up", icon: FileText },
    { event: "Video Plays", count: "1,234", change: "+24.5%", trend: "up", icon: PlayCircle },
    { event: "File Downloads", count: "567", change: "-2.1%", trend: "down", icon: Download },
  ],
  scrollDepth: [
    { depth: "25%", percentage: 85 },
    { depth: "50%", percentage: 62 },
    { depth: "75%", percentage: 38 },
    { depth: "100%", percentage: 12 },
  ]
};

const conversions = {
  goals: [
    { name: "Contact Form", completions: "234", rate: "2.3%", value: "$11,700", change: "+15.2%", trend: "up" },
    { name: "Quote Request", completions: "156", rate: "1.5%", value: "$23,400", change: "+8.9%", trend: "up" },
    { name: "Newsletter Signup", completions: "567", rate: "5.6%", value: "$2,835", change: "+22.1%", trend: "up" },
    { name: "Download Brochure", completions: "89", rate: "0.9%", value: "$445", change: "-5.3%", trend: "down" },
  ],
  funnels: [
    { step: "Landing Page", visitors: "10,234", dropoff: "0%" },
    { step: "Service Page", visitors: "6,123", dropoff: "40.2%" },
    { step: "Contact Form", visitors: "2,456", dropoff: "59.9%" },
    { step: "Form Submit", visitors: "234", dropoff: "90.5%" },
  ]
};

const realTimeData = {
  activeUsers: "47",
  currentPageViews: "156",
  topActivePages: [
    { page: "/services", users: "12" },
    { page: "/", users: "9" },
    { page: "/contact", users: "7" },
    { page: "/about", users: "5" },
  ],
  recentEvents: [
    { time: "Just now", event: "Form submission", page: "/contact" },
    { time: "1 min ago", event: "Video play", page: "/about" },
    { time: "2 min ago", event: "Button click", page: "/services" },
    { time: "3 min ago", event: "Page view", page: "/portfolio" },
  ]
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("visitors");
  const [compareMode, setCompareMode] = useState(false);

  const currentMetrics = performanceMetrics[timeRange as keyof typeof performanceMetrics];

  const getChangeIndicator = (value: string, isPositive: boolean = true) => {
    const expectedPositive = !value.includes('bounce') && !value.includes('exit');
    const actuallyPositive = isPositive ? expectedPositive : !expectedPositive;
    
    return (
      <div className={`flex items-center gap-1 text-sm ${
        actuallyPositive ? "text-green-500" : "text-red-500"
      }`}>
        {actuallyPositive ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
        {value}
      </div>
    );
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header with Date Range */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your website performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-1">
            <button
              onClick={() => setTimeRange("today")}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                timeRange === "today" 
                  ? "bg-orange-500 text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange("week")}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                timeRange === "week" 
                  ? "bg-orange-500 text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              7 Days
          </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                timeRange === "month" 
                  ? "bg-orange-500 text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              30 Days
          </button>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div>
        <h2 className="text-xl font-medium text-foreground mb-4">Website Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <DashboardStatCard 
            interactive 
            glow
            icon={<Users className="h-5 w-5 text-blue-400" />}
            trend={getChangeIndicator("+12.5%")}
          >
            <h3 className="text-2xl font-semibold text-foreground">{currentMetrics.visitors}</h3>
            <p className="text-sm text-muted-foreground">Total Visitors</p>
          </DashboardStatCard>

          <DashboardStatCard 
            interactive 
            glow
            icon={<Users className="h-5 w-5 text-purple-400" />}
            trend={getChangeIndicator("+8.3%")}
          >
            <h3 className="text-2xl font-semibold text-foreground">{currentMetrics.unique}</h3>
            <p className="text-sm text-muted-foreground">Unique Visitors</p>
          </DashboardStatCard>

          <DashboardStatCard 
            interactive 
            glow
            icon={<Activity className="h-5 w-5 text-red-400" />}
            trend={getChangeIndicator("-2.1%", false)}
          >
            <h3 className="text-2xl font-semibold text-foreground">{currentMetrics.bounceRate}</h3>
            <p className="text-sm text-muted-foreground">Bounce Rate</p>
          </DashboardStatCard>

          <DashboardStatCard 
            interactive 
            glow
            icon={<Clock className="h-5 w-5 text-green-400" />}
            trend={getChangeIndicator("+18.7%")}
          >
            <h3 className="text-2xl font-semibold text-foreground">{currentMetrics.avgDuration}</h3>
            <p className="text-sm text-muted-foreground">Avg. Duration</p>
          </DashboardStatCard>

          <DashboardStatCard 
            interactive 
            glow
            icon={<Eye className="h-5 w-5 text-orange-400" />}
            trend={getChangeIndicator("+15.4%")}
          >
            <h3 className="text-2xl font-semibold text-foreground">{currentMetrics.pageViews}</h3>
            <p className="text-sm text-muted-foreground">Page Views</p>
          </DashboardStatCard>

          <DashboardStatCard 
            interactive 
            glow
            icon={<Target className="h-5 w-5 text-indigo-400" />}
            trend={getChangeIndicator("+0.3%")}
          >
            <h3 className="text-2xl font-semibold text-foreground">{currentMetrics.conversionRate}</h3>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </DashboardStatCard>
        </div>
      </div>

      {/* Real-Time Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-medium text-foreground">Real-Time Analytics</h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-500">Live</span>
              </div>
            </div>
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 mb-3">
                <span className="text-3xl font-bold text-green-400">{realTimeData.activeUsers}</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Users Now</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground mb-2">Top Active Pages</p>
              {realTimeData.topActivePages.map((page, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{page.page}</span>
                  <Badge variant="secondary">{page.users} users</Badge>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground mb-2">Recent Events</p>
              {realTimeData.recentEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground text-xs">{event.time}</span>
                  <div>
                    <p className="text-foreground">{event.event}</p>
                    <p className="text-xs text-muted-foreground">{event.page}</p>
                  </div>
                </div>
              ))}
              </div>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Traffic Sources & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DashboardCard>
            <h2 className="text-xl font-medium text-foreground mb-6">Traffic Sources</h2>
            <div className="space-y-4">
              {trafficSources.map((source, index) => {
                const Icon = source.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{source.source}</span>
          </div>
                <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{source.visitors}</span>
                        <span className={`text-sm ${source.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {source.change}
                        </span>
                  </div>
                </div>
                    <div className="relative">
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${source.percentage}%` }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                        />
                      </div>
                </div>
              </div>
                );
              })}
          </div>
        </DashboardCard>
      </motion.div>

        {/* Geographic Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        >
          <DashboardCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-foreground">Visitor Demographics</h2>
              <MapPin className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-3">
              {demographics.countries.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{country.name}</p>
                      <p className="text-xs text-muted-foreground">{country.percentage}% of traffic</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{country.visitors}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </motion.div>
      </div>

      {/* Device & Browser Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
      >
        <DashboardCard>
          <h2 className="text-xl font-medium text-foreground mb-6">Device Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demographics.devices.map((device, index) => {
              const Icon = device.icon;
              return (
                  <div
                  key={device.device}
                    className="text-center p-4 rounded-lg bg-muted/20 border border-border hover:border-orange-500/30 transition-all duration-200"
                >
                    <Icon className="h-10 w-10 text-orange-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-semibold text-foreground mb-1">{device.percentage}%</h3>
                    <p className="text-sm text-muted-foreground mb-1">{device.device}</p>
                  <p className="text-xs text-muted-foreground">{device.sessions} sessions</p>
                  </div>
              );
            })}
          </div>
        </DashboardCard>
      </motion.div>

        {/* Browser Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DashboardCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-foreground">Browsers</h2>
              <Chrome className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-3">
              {demographics.browsers.map((browser, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{browser.name}</span>
                    <span className="text-sm text-muted-foreground">{browser.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <motion.div 
                      className={`${browser.color} h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${browser.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </DashboardCard>
        </motion.div>
      </div>

      {/* Top Pages with Enhanced Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-foreground">Top Pages Performance</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-sm text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-3 px-2">Page</th>
                  <th className="text-right py-3 px-2">Views</th>
                  <th className="text-right py-3 px-2">Avg. Time</th>
                  <th className="text-right py-3 px-2">Exit Rate</th>
                  <th className="text-right py-3 px-2">Change</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{page.title}</p>
                        <p className="text-xs text-muted-foreground">{page.page}</p>
                      </div>
                    </td>
                    <td className="text-right py-3 px-2 text-sm text-foreground">{page.views}</td>
                    <td className="text-right py-3 px-2 text-sm text-foreground">{page.avgTime}</td>
                    <td className="text-right py-3 px-2">
                      <span className={`text-sm ${parseFloat(page.exitRate) > 50 ? 'text-red-500' : 'text-foreground'}`}>
                        {page.exitRate}
                      </span>
                    </td>
                    <td className="text-right py-3 px-2">
                      <span className={`text-sm ${page.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {page.change}
                      </span>
                    </td>
                    <td className="text-right py-3 px-2">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </motion.div>

      {/* User Behavior & Conversions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Behavior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <DashboardCard>
            <h2 className="text-xl font-medium text-foreground mb-6">User Behavior</h2>
            
            <div className="space-y-6">
              {/* Event Tracking */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Event Tracking</p>
                <div className="grid grid-cols-2 gap-3">
                  {userBehavior.events.map((event, index) => {
                    const Icon = event.icon;
                    return (
                      <div key={index} className="p-3 rounded-lg bg-muted/20 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <Icon className="h-4 w-4 text-orange-400" />
                          <span className={`text-xs ${event.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {event.change}
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">{event.count}</p>
                        <p className="text-xs text-muted-foreground">{event.event}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Scroll Depth */}
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Average Scroll Depth</p>
                <div className="space-y-2">
                  {userBehavior.scrollDepth.map((depth, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{depth.depth}</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <div className="flex-1 bg-muted/30 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${depth.percentage}%` }}
                            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{depth.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        {/* Conversions & Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <DashboardCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-foreground">Conversions & Goals</h2>
              <Target className="h-5 w-5 text-orange-400" />
            </div>
            
            <div className="space-y-4">
              {conversions.goals.map((goal, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/20 border border-border hover:border-orange-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">{goal.name}</h4>
                    <span className={`text-sm ${goal.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {goal.change}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Completions</p>
                      <p className="font-semibold text-foreground">{goal.completions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Conv. Rate</p>
                      <p className="font-semibold text-foreground">{goal.rate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Value</p>
                      <p className="font-semibold text-green-500">{goal.value}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </DashboardCard>
        </motion.div>
      </div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium text-foreground mb-2">Export & Share Reports</h2>
              <p className="text-sm text-muted-foreground">Generate and share comprehensive analytics reports</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Share2 className="h-4 w-4 mr-2" />
                Share Dashboard
              </Button>
            </div>
          </div>
        </DashboardCard>
      </motion.div>
    </div>
  );
} 