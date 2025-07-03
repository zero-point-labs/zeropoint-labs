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
  Database,
  ChevronRight,
  Package
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
  { id: "INV-001", date: "Dec 1, 2024", amount: "$99.00", status: "Paid", description: "Professional Plan - December 2024" },
  { id: "INV-002", date: "Nov 1, 2024", amount: "$99.00", status: "Paid", description: "Professional Plan - November 2024" },
  { id: "INV-003", date: "Oct 1, 2024", amount: "$99.00", status: "Paid", description: "Professional Plan - October 2024" },
  { id: "INV-004", date: "Sep 1, 2024", amount: "$99.00", status: "Paid", description: "Professional Plan - September 2024" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-2">Billing & Subscription</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your subscription and billing details</p>
      </div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DashboardCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-medium text-foreground mb-2">Current Plan</h2>
              <p className="text-sm text-muted-foreground">You're currently on the Professional plan</p>
            </div>
            <Badge className="bg-orange-500/20 text-orange-400 border-0 self-start sm:self-auto">
              Active
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 sm:h-10 sm:w-10 text-orange-400" />
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Professional</h3>
                <p className="text-sm text-muted-foreground">Monthly subscription</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-xl sm:text-2xl font-semibold text-foreground">$99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next billing date</p>
              <p className="text-sm sm:text-base font-medium text-foreground">January 1, 2025</p>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
            <Button variant="outline" className="text-sm">
              Upgrade Plan
            </Button>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DashboardCard>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
            <h2 className="text-lg sm:text-xl font-medium text-foreground">Payment Method</h2>
          </div>
          
          <div className="p-3 sm:p-4 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-foreground">•••• •••• •••• 4242</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Expires 12/2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Update
              </Button>
            </div>
          </div>
          
          <Button variant="outline" className="mt-4 text-sm">
            Add Payment Method
          </Button>
        </DashboardCard>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DashboardCard>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
              <h2 className="text-lg sm:text-xl font-medium text-foreground">Billing History</h2>
            </div>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Export
            </Button>
          </div>
          
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-3 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{invoice.description}</p>
                    <p className="text-xs text-muted-foreground">{invoice.date}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {invoice.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{invoice.amount}</p>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Download
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="text-sm text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-3 px-2">Invoice</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border/50">
                    <td className="py-3 px-2">
                      <p className="font-medium text-foreground">{invoice.description}</p>
                      <p className="text-xs text-muted-foreground">#{invoice.id}</p>
                    </td>
                    <td className="py-3 px-2 text-sm text-foreground">{invoice.date}</td>
                    <td className="py-3 px-2 font-medium text-foreground">{invoice.amount}</td>
                    <td className="py-3 px-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-0">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Button variant="ghost" size="sm">
                        Download
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <DashboardCard className="p-3 sm:p-4 text-center">
          <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto mb-2" />
          <h3 className="text-sm sm:text-lg font-medium text-foreground">Total Spent</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">This year</p>
          <p className="text-xl sm:text-2xl font-semibold text-foreground">$1,188</p>
        </DashboardCard>
        
        <DashboardCard className="p-3 sm:p-4 text-center">
          <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2" />
          <h3 className="text-sm sm:text-lg font-medium text-foreground">Next Payment</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Due Jan 1, 2025</p>
          <p className="text-xl sm:text-2xl font-semibold text-foreground">$99.00</p>
        </DashboardCard>
        
        <DashboardCard className="p-3 sm:p-4 text-center sm:col-span-2 md:col-span-1">
          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 mx-auto mb-2" />
          <h3 className="text-sm sm:text-lg font-medium text-foreground">Active Since</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Customer for</p>
          <p className="text-xl sm:text-2xl font-semibold text-foreground">12 months</p>
        </DashboardCard>
      </div>
    </div>
  );
} 