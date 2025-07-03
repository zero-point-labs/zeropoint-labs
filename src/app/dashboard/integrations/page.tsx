"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Settings,
  Activity,
  Link,
  Zap,
  Mail,
  MessageSquare,
  BarChart3,
  Shield,
  Globe,
  Database,
  Smartphone,
  ExternalLink
} from "lucide-react";

const activeIntegrations = [
  {
    id: 1,
    name: "Google Analytics",
    description: "Track website performance and user behavior",
    icon: BarChart3,
    status: "connected",
    lastSync: "2 minutes ago",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: 2,
    name: "Mailchimp",
    description: "Email marketing and automation",
    icon: Mail,
    status: "connected", 
    lastSync: "5 minutes ago",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    id: 3,
    name: "Slack",
    description: "Team notifications and alerts",
    icon: MessageSquare,
    status: "connected",
    lastSync: "1 hour ago",
    color: "from-purple-400 to-purple-600"
  }
];

const availableIntegrations = [
  {
    id: 4,
    name: "Stripe",
    description: "Payment processing and billing",
    icon: Shield,
    category: "Payments",
    popular: true,
    color: "from-indigo-400 to-indigo-600"
  },
  {
    id: 5,
    name: "Zapier",
    description: "Automate workflows between apps",
    icon: Zap,
    category: "Automation",
    popular: true,
    color: "from-orange-400 to-orange-600"
  },
  {
    id: 6,
    name: "Webhook",
    description: "Custom HTTP callbacks",
    icon: Link,
    category: "Developer",
    popular: false,
    color: "from-gray-400 to-gray-600"
  },
  {
    id: 7,
    name: "WordPress",
    description: "Content management integration",
    icon: Globe,
    category: "CMS",
    popular: true,
    color: "from-blue-400 to-blue-600"
  },
  {
    id: 8,
    name: "Shopify",
    description: "E-commerce platform integration",
    icon: Smartphone,
    category: "E-commerce",
    popular: false,
    color: "from-green-400 to-green-600"
  },
  {
    id: 9,
    name: "Airtable",
    description: "Database and spreadsheet management",
    icon: Database,
    category: "Data",
    popular: false,
    color: "from-purple-400 to-purple-600"
  }
];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIntegrations = availableIntegrations.filter(
    integration => integration.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-2">Integrations</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Connect your favorite tools and services</p>
      </div>

      {/* Connected Integrations */}
      <div>
        <h2 className="text-lg sm:text-xl font-medium text-foreground mb-4">Active Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeIntegrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DashboardCard glow>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center`}>
                      <integration.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-foreground">{integration.name}</h3>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                    Active
                  </Badge>
                </div>
                
                <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <span className="text-foreground font-medium capitalize">{integration.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Sync</span>
                    <span className="text-foreground">{integration.lastSync}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 border-red-500/30 hover:bg-red-500/10 text-xs sm:text-sm">
                    Disconnect
                  </Button>
                </div>
              </DashboardCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-medium text-foreground">Available Integrations</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/30 border-border text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DashboardCard>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center flex-shrink-0`}>
                    <integration.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-foreground">{integration.name}</h3>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground capitalize">{integration.category}</span>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm">
                    Connect
                  </Button>
                </div>
              </DashboardCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <DashboardCard className="p-3 sm:p-4 text-center">
          <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2" />
          <h3 className="text-sm sm:text-lg font-medium text-foreground">API Usage</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">This month</p>
          <div className="text-2xl sm:text-3xl font-semibold text-foreground">12,456</div>
          <p className="text-xs text-muted-foreground">requests</p>
        </DashboardCard>

        <DashboardCard className="p-3 sm:p-4 text-center">
          <Link className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto mb-2" />
          <h3 className="text-sm sm:text-lg font-medium text-foreground">Webhooks</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Active endpoints</p>
          <div className="text-2xl sm:text-3xl font-semibold text-foreground">8</div>
          <p className="text-xs text-muted-foreground">configured</p>
        </DashboardCard>

        <DashboardCard className="p-3 sm:p-4 text-center sm:col-span-2 md:col-span-1">
          <Database className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto mb-2" />
          <h3 className="text-sm sm:text-lg font-medium text-foreground">Data Sync</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Success rate</p>
          <div className="text-2xl sm:text-3xl font-semibold text-foreground">99.9%</div>
          <p className="text-xs text-muted-foreground">uptime</p>
        </DashboardCard>
      </div>
    </div>
  );
} 