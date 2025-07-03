"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe,
  CheckCircle,
  Clock,
  ExternalLink,
  Settings,
  Building,
  Zap,
  Save,
  RotateCcw,
  Copy,
  Shield,
  AlertCircle,
  Info
} from "lucide-react";

// Mock data for connected website
const websiteData = {
  url: "https://clientdomain.com",
  status: "connected",
  lastUpdated: "Just now",
  hosting: "Managed by ZeroPoint Labs",
  businessDetails: {
    name: "Acme Corporation",
    email: "info@clientdomain.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345"
  }
};

export default function WebsitePage() {
  // Toggle this to simulate connected/not connected states
  const [isConnected, setIsConnected] = useState(true); // Change to false to see placeholder state
  const [formData, setFormData] = useState(websiteData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as Record<string, any>),
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In real implementation, this would save to backend
    setHasUnsavedChanges(false);
    console.log("Saving data:", formData);
  };

  const handleReset = () => {
    setFormData(websiteData);
    setHasUnsavedChanges(false);
  };

  // Placeholder state when website is not connected
  if (!isConnected) {
    return (
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-2">Website Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Your website connection status</p>
          </div>
        </div>

        {/* Not Connected State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center min-h-[400px] sm:min-h-[600px]"
        >
          <DashboardCard className="max-w-2xl mx-auto text-center p-8 sm:p-12">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-600/20 mb-4 sm:mb-6">
                <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-orange-400" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                Website Not Connected Yet
              </h2>
              
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
                Your website is being prepared by the ZeroPoint Labs team. Once it's connected, 
                you'll see full settings and management options here.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="p-3 sm:p-4 rounded-lg bg-muted/20 border border-border">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground">Website Setup</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-muted/20 border border-border">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground">Performance Optimization</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-muted/20 border border-border">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground">Security Configuration</p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-blue-400">
                You'll receive an email notification once your website is ready and connected.
              </p>
            </div>
          </DashboardCard>
        </motion.div>
      </div>
    );
  }

  // Connected state with management interface
  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-2">Website Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your website settings and content</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 flex-1">
              <Button variant="outline" onClick={handleReset} className="flex-1 sm:flex-initial text-sm">
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white flex-1 sm:flex-initial text-sm">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
          <Button variant="outline" className="text-sm">
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            View Live Site
          </Button>
        </div>
      </div>

      {/* Connected Website Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DashboardCard>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-medium text-foreground">Connected Website Overview</h2>
            <Badge className="bg-green-500/20 text-green-400 border-0 flex items-center gap-1 text-xs sm:text-sm">
              <CheckCircle className="h-3 w-3" />
              Connected
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Website URL</p>
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                <span className="text-xs sm:text-sm font-medium text-foreground truncate">{formData.url}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                <span className="text-xs sm:text-sm font-medium text-green-400 capitalize">{formData.status}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Last Updated</p>
              <span className="text-xs sm:text-sm font-medium text-foreground">{formData.lastUpdated}</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Hosting</p>
              <span className="text-xs sm:text-sm font-medium text-foreground">{formData.hosting}</span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
            <Button variant="outline" className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10 text-sm w-full sm:w-auto">
              Request Changes
            </Button>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Business Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DashboardCard>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
              <h2 className="text-lg sm:text-xl font-medium text-foreground">Business Details</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">Business Name</label>
              <input
                type="text"
                value={formData.businessDetails.name}
                onChange={(e) => handleInputChange('businessDetails', 'name', e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-foreground text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">Business Email</label>
              <input
                type="email"
                value={formData.businessDetails.email}
                onChange={(e) => handleInputChange('businessDetails', 'email', e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-foreground text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">Phone Number</label>
              <input
                type="tel"
                value={formData.businessDetails.phone}
                onChange={(e) => handleInputChange('businessDetails', 'phone', e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-foreground text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">Business Address</label>
              <input
                type="text"
                value={formData.businessDetails.address}
                onChange={(e) => handleInputChange('businessDetails', 'address', e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-foreground text-sm"
              />
            </div>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Unsaved Changes Notice */}
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50"
        >
          <DashboardCard className="bg-orange-500/10 border-orange-500/30 p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
              <span className="text-xs sm:text-sm text-orange-400 flex-1">You have unsaved changes</span>
              <Button 
                size="sm" 
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm"
              >
                Save Now
              </Button>
            </div>
          </DashboardCard>
        </motion.div>
      )}
    </div>
  );
} 