"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { getWebsites, getAnalyticsSummary } from '@/lib/appwrite';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Globe,
  Activity,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';
import { DashboardCard, DashboardStatCard } from '@/components/ui/dashboard-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnalyticsData {
  totalVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgDuration: number;
  conversionRate: number;
  topPages: { path: string; views: number }[];
  activeUsers: number;
  totalEvents: number;
}

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [websites, setWebsites] = useState<any[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load user's websites
  useEffect(() => {
    if (user) {
      loadWebsites();
    }
  }, [user]);

  // Load analytics data when website or date range changes
  useEffect(() => {
    if (selectedWebsite) {
      loadAnalyticsData();
    }
  }, [selectedWebsite, dateRange]);

  const loadWebsites = async () => {
    try {
      const userWebsites = await getWebsites(user!.$id);
      setWebsites(userWebsites);
      if (userWebsites.length > 0) {
        setSelectedWebsite(userWebsites[0]);
      }
    } catch (error) {
      console.error('Error loading websites:', error);
      setError('Failed to load websites');
    }
  };

  const loadAnalyticsData = async () => {
    if (!selectedWebsite || !user) return;

    setIsLoadingData(true);
    setError('');

    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '1d':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      const data = await getAnalyticsSummary(
        user.$id,
        selectedWebsite.domain,
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      );

      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case '1d': return 'Last 24 hours';
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      default: return 'Last 7 days';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (websites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">No Websites Found</h1>
          <p className="text-gray-600 mb-6">
            You need to set up website tracking first to view analytics.
          </p>
          <Button onClick={() => router.push('/setup')}>
            Set Up Analytics
          </Button>
        </div>
      </div>
    );
  }

  const stats = analyticsData ? [
    {
      label: "Total Visitors",
      value: analyticsData.totalVisitors.toLocaleString(),
      change: "+12.5%", // TODO: Calculate actual change
      trend: "up",
      icon: Users,
      color: "from-blue-400 to-blue-600"
    },
    {
      label: "Page Views",
      value: analyticsData.pageViews.toLocaleString(),
      change: "+8.2%", // TODO: Calculate actual change
      trend: "up",
      icon: Eye,
      color: "from-purple-400 to-purple-600"
    },
    {
      label: "Bounce Rate",
      value: `${analyticsData.bounceRate}%`,
      change: "-2.1%", // TODO: Calculate actual change
      trend: "down",
      icon: MousePointerClick,
      color: "from-green-400 to-green-600"
    },
    {
      label: "Avg. Duration",
      value: `${Math.floor(analyticsData.avgDuration / 60)}m ${analyticsData.avgDuration % 60}s`,
      change: "+18.7%", // TODO: Calculate actual change
      trend: "up",
      icon: Clock,
      color: "from-orange-400 to-orange-600"
    }
  ] : [];

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Real-time insights for your website performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Website Selector */}
          <select
            value={selectedWebsite?.$id || ''}
            onChange={(e) => {
              const website = websites.find(w => w.$id === e.target.value);
              setSelectedWebsite(website);
            }}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            {websites.map((website) => (
              <option key={website.$id} value={website.$id}>
                {website.domain}
              </option>
            ))}
          </select>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Current Selection Info */}
      {selectedWebsite && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>{selectedWebsite.domain}</span>
          <span>•</span>
          <Calendar className="h-4 w-4" />
          <span>{getDateRangeLabel()}</span>
          {analyticsData && (
            <>
              <span>•</span>
              <Activity className="h-4 w-4" />
              <span>{analyticsData.activeUsers} active users</span>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoadingData && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-muted-foreground">Loading analytics...</span>
        </div>
      )}

      {/* Stats Grid */}
      {analyticsData && (
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
      )}

      {/* Additional Analytics */}
      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Pages
                </CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.topPages.length > 0 ? (
                    analyticsData.topPages.map((page, index) => (
                      <div key={page.path} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-4">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium truncate">
                            {page.path === '/' ? 'Homepage' : page.path}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {page.views} views
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No page data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Conversion & Engagement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Conversion & Engagement
                </CardTitle>
                <CardDescription>User interaction metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="text-sm font-medium">{analyticsData.conversionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bounce Rate</span>
                    <span className="text-sm font-medium">{analyticsData.bounceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Events</span>
                    <span className="text-sm font-medium">{analyticsData.totalEvents.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      {analyticsData.activeUsers}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* No Data State */}
      {analyticsData && analyticsData.totalEvents === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-4">
              No analytics data found for the selected time period. Make sure your tracking script is installed and your website is receiving traffic.
            </p>
            <Button onClick={() => router.push('/setup')}>
              Check Setup
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 