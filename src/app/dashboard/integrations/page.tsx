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
    name: "Stripe",
    description: "Payment processing and billing",
    icon: Shield,
    category: "Payments",
    popular: true
  },
  {
    name: "Zapier",
    description: "Automate workflows between apps",
    icon: Zap,
    category: "Automation",
    popular: true
  },
  {
    name: "Webhook",
    description: "Custom HTTP callbacks",
    icon: Link,
    category: "Developer",
    popular: false
  },
  {
    name: "WordPress",
    description: "Content management integration",
    icon: Globe,
    category: "CMS",
    popular: true
  },
  {
    name: "Shopify",
    description: "E-commerce platform integration",
    icon: Smartphone,
    category: "E-commerce",
    popular: false
  },
  {
    name: "Airtable",
    description: "Database and spreadsheet management",
    icon: Database,
    category: "Data",
    popular: false
  }
];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIntegrations = availableIntegrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">Integrations</h1>
          <p className="text-muted-foreground">Connect your favorite tools and services</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-muted/50 focus:border-orange-500/50 outline-none"
          />
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
          Search
        </Button>
      </div>

      {/* Active Integrations */}
      <DashboardCard>
        <h2 className="text-xl font-medium text-foreground mb-4">Active Integrations</h2>
        <div className="space-y-4">
          {activeIntegrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border hover:border-border/70 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-foreground font-medium mb-1">{integration.name}</h3>
                      <Badge className="bg-green-500/20 text-green-400 border-0">
                        {integration.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{integration.description}</p>
                    <p className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-muted/30 rounded-lg transition-colors">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-muted/30 rounded-lg transition-colors">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </DashboardCard>

      {/* Available Integrations */}
      <DashboardCard>
        <h2 className="text-xl font-medium text-foreground mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/20 border border-border hover:border-border/70 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-muted/30 group-hover:bg-muted/40 flex items-center justify-center transition-colors">
                    <Icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-foreground font-medium group-hover:text-orange-400 transition-colors">{integration.name}</h4>
                      {integration.popular && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-0 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{integration.category}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted/30 rounded-lg">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </DashboardCard>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard className="p-4 text-center">
          <Activity className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-foreground">API Usage</h3>
          <p className="text-sm text-muted-foreground">This month</p>
          <div className="text-3xl font-semibold text-foreground">12,456</div>
          <p className="text-xs text-muted-foreground">requests</p>
        </DashboardCard>

        <DashboardCard className="p-4 text-center">
          <Link className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-foreground">Webhooks</h3>
          <p className="text-sm text-muted-foreground">Active endpoints</p>
          <div className="text-3xl font-semibold text-foreground">8</div>
          <p className="text-xs text-muted-foreground">configured</p>
        </DashboardCard>

        <DashboardCard className="p-4 text-center">
          <Database className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-foreground">Data Sync</h3>
          <p className="text-sm text-muted-foreground">Success rate</p>
          <div className="text-3xl font-semibold text-foreground">99.9%</div>
          <p className="text-xs text-muted-foreground">uptime</p>
        </DashboardCard>
      </div>
    </div>
  );
} 