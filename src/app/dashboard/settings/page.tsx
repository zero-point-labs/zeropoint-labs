"use client";

import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield,
  Monitor,
  Globe,
  Trash2,
  Download,
  Upload
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-orange-400" />
          <h2 className="text-xl font-medium text-foreground">Profile Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">First Name</label>
            <Input
              id="firstName"
              defaultValue="John"
              className="bg-muted/30 border-border text-foreground focus:border-orange-500/50"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">Last Name</label>
            <Input
              id="lastName"
              defaultValue="Doe"
              className="bg-muted/30 border-border text-foreground focus:border-orange-500/50"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <Input
              id="email"
              type="email"
              defaultValue="john.doe@example.com"
              className="bg-muted/30 border-border text-foreground focus:border-orange-500/50"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">Bio</label>
            <textarea
              id="bio"
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange-500/50 outline-none resize-none"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-6">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Save Changes
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted">
            Cancel
          </Button>
        </div>
      </DashboardCard>

      {/* Notification Settings */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5 text-orange-400" />
          <h2 className="text-xl font-medium text-foreground">Notification Preferences</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
            <div>
              <h4 className="text-foreground font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive updates about your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
            <div>
              <h4 className="text-foreground font-medium">SMS Notifications</h4>
              <p className="text-sm text-muted-foreground">Get text alerts for urgent updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-muted/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
            <div>
              <h4 className="text-foreground font-medium">Marketing Communications</h4>
              <p className="text-sm text-muted-foreground">Newsletters and product updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </DashboardCard>

      {/* Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-medium text-foreground">Password & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-2">Current Password</label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className="bg-muted/30 border-border text-foreground focus:border-orange-500/50"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">New Password</label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="bg-muted/30 border-border text-foreground focus:border-orange-500/50"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="bg-muted/30 border-border text-foreground focus:border-orange-500/50"
              />
            </div>
            <Button variant="outline" className="mt-4 border-border hover:bg-muted">
              Update Password
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-medium text-foreground">Two-Factor Authentication</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
              <div>
                <h4 className="text-foreground font-medium">SMS Authentication</h4>
                <p className="text-sm text-muted-foreground">Get verification codes via SMS</p>
              </div>
              <Button variant="outline" className="border-border hover:bg-muted">
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
              <div>
                <h4 className="text-foreground font-medium">Authenticator App</h4>
                <p className="text-sm text-muted-foreground">Use Google Authenticator or similar</p>
              </div>
              <Button variant="outline" className="border-border hover:bg-muted">
                Setup
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
              <div>
                <h4 className="text-foreground font-medium">Backup Codes</h4>
                <p className="text-sm text-muted-foreground">Download emergency access codes</p>
              </div>
              <Button variant="outline" className="border-border hover:bg-muted">
                Generate
              </Button>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Data & Privacy */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-6">
          <Monitor className="h-5 w-5 text-orange-400" />
          <h2 className="text-xl font-medium text-foreground">Data & Privacy</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
            <div>
              <h4 className="text-foreground font-medium">Export Data</h4>
              <p className="text-xs text-muted-foreground">Download your account data</p>
            </div>
            <Button size="sm" variant="outline" className="border-border hover:bg-muted">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
            <div>
              <h4 className="text-foreground font-medium">Import Data</h4>
              <p className="text-xs text-muted-foreground">Upload data from backup</p>
            </div>
            <Button size="sm" variant="outline" className="border-border hover:bg-muted">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border">
            <div>
              <h4 className="text-foreground font-medium text-red-400">Delete Account</h4>
              <p className="text-xs text-muted-foreground">Permanently remove account</p>
            </div>
            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
} 