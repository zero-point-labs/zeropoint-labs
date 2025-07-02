"use client";

import { motion } from "framer-motion";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Download,
  CheckCircle,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap,
  Shield,
  Users,
  Database
} from "lucide-react";

const currentPlan = {
  name: "Professional",
  price: "$99",
  billing: "monthly",
  features: ["Unlimited pages", "Custom domain", "Analytics", "Priority support", "SSL certificate"],
  usage: {
    bandwidth: { used: 450, total: 1000, unit: "GB" },
    storage: { used: 8.5, total: 50, unit: "GB" },
    email: { used: 15, total: 100, unit: "accounts" }
  }
};

const plans = [
  {
    name: "Starter",
    price: "$29",
    popular: false,
    features: ["5 pages", "Custom domain", "Basic analytics", "Email support"],
    limits: { bandwidth: "100 GB", storage: "10 GB", email: "10 accounts" }
  },
  {
    name: "Professional",
    price: "$99",
    popular: true,
    features: ["Unlimited pages", "Custom domain", "Advanced analytics", "Priority support", "SSL certificate"],
    limits: { bandwidth: "1 TB", storage: "50 GB", email: "100 accounts" }
  },
  {
    name: "Enterprise",
    price: "$299",
    popular: false,
    features: ["Everything in Pro", "White-label", "API access", "Custom integrations", "Dedicated support"],
    limits: { bandwidth: "Unlimited", storage: "500 GB", email: "Unlimited" }
  }
];

const invoices = [
  { id: "INV-2024-001", date: "Jan 1, 2024", amount: "$99.00", status: "paid" },
  { id: "INV-2023-012", date: "Dec 1, 2023", amount: "$99.00", status: "paid" },
  { id: "INV-2023-011", date: "Nov 1, 2023", amount: "$99.00", status: "paid" },
  { id: "INV-2023-010", date: "Oct 1, 2023", amount: "$99.00", status: "paid" },
  { id: "INV-2023-009", date: "Sep 1, 2023", amount: "$99.00", status: "paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">Billing & Plans</h1>
          <p className="text-muted-foreground">Manage your subscription and billing information</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors flex items-center gap-2 border border-border hover:border-border/70">
            <Download className="h-4 w-4" />
            Download Invoice
          </button>
        </div>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-foreground">Current Plan</h2>
            <Badge className="bg-orange-500/20 text-orange-400">Active</Badge>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-2xl font-semibold text-foreground">{currentPlan.name}</p>
              <p className="text-sm text-muted-foreground">Billed {currentPlan.billing}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-foreground">{currentPlan.price}/mo</p>
              <p className="text-sm text-muted-foreground">Next billing: Jan 1, 2025</p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Bandwidth</span>
                <span className="text-foreground">{currentPlan.usage.bandwidth.used} {currentPlan.usage.bandwidth.unit}</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentPlan.usage.bandwidth.used / currentPlan.usage.bandwidth.total) * 100}%` }}
                  transition={{ delay: 0.2, duration: 1 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentPlan.usage.bandwidth.total - currentPlan.usage.bandwidth.used} {currentPlan.usage.bandwidth.unit} remaining
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Storage</span>
                <span className="text-foreground">{currentPlan.usage.storage.used} {currentPlan.usage.storage.unit}</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentPlan.usage.storage.used / currentPlan.usage.storage.total) * 100}%` }}
                  transition={{ delay: 0.4, duration: 1 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentPlan.usage.storage.total - currentPlan.usage.storage.used} {currentPlan.usage.storage.unit} remaining
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Email Accounts</span>
                <span className="text-foreground">{currentPlan.usage.email.used}</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentPlan.usage.email.used / currentPlan.usage.email.total) * 100}%` }}
                  transition={{ delay: 0.6, duration: 1 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentPlan.usage.email.total - currentPlan.usage.email.used} accounts remaining
              </p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
            <Zap className="h-8 w-8 text-orange-400" />
            <Button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white">
              Upgrade Plan
            </Button>
          </div>
        </DashboardCard>
      </div>

      {/* Available Plans */}
      <DashboardCard>
        <h2 className="text-xl font-medium text-foreground mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-xl border transition-all duration-200 ${
                plan.popular 
                  ? "border-orange-500/50 bg-orange-500/5" 
                  : "border-border bg-muted/10 hover:border-border/70"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-orange-600 text-white border-0">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
                    : "border border-border hover:bg-muted text-foreground"
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.name === currentPlan.name ? "Current Plan" : "Choose Plan"}
              </Button>
            </motion.div>
          ))}
        </div>
      </DashboardCard>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <h2 className="text-xl font-medium text-foreground">Payment Method</h2>
          <div className="mt-6">
            <div className="p-4 rounded-lg bg-muted/20 border border-border">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-foreground" />
                <div>
                  <p className="text-foreground font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 border-border hover:bg-muted">
              Update Payment Method
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-foreground">Recent Invoices</h2>
            <Button variant="outline" className="border-border hover:bg-muted">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {invoices.slice(0, 4).map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors group"
              >
                <div>
                  <p className="text-sm text-foreground">{invoice.date}</p>
                  <p className="text-xs text-muted-foreground">{invoice.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-medium">{invoice.amount}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard className="p-4 text-center">
          <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-foreground">Total Spent</h3>
          <p className="text-sm text-muted-foreground">This year</p>
          <p className="text-2xl font-semibold text-foreground">$1,188</p>
        </DashboardCard>
        
        <DashboardCard className="p-4 text-center">
          <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-foreground">Next Payment</h3>
          <p className="text-sm text-muted-foreground">Due Jan 1, 2025</p>
          <p className="text-2xl font-semibold text-foreground">$99.00</p>
        </DashboardCard>
        
        <DashboardCard className="p-4 text-center">
          <TrendingUp className="h-8 w-8 text-orange-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-foreground">Active Since</h3>
          <p className="text-sm text-muted-foreground">Customer for</p>
          <p className="text-2xl font-semibold text-foreground">12 months</p>
        </DashboardCard>
      </div>
    </div>
  );
} 