"use client";

import { motion } from "framer-motion";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Edit3, 
  Globe,
  Image as ImageIcon,
  Settings,
  Code,
  FileText,
  Eye,
  Calendar,
  MoreHorizontal,
  Upload,
  Trash2,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

const sitePages = [
  { 
    id: 1, 
    title: "Homepage", 
    path: "/", 
    status: "published", 
    lastModified: "2 hours ago",
    views: "1,234"
  },
  { 
    id: 2, 
    title: "About Us", 
    path: "/about", 
    status: "published", 
    lastModified: "1 day ago",
    views: "856"
  },
  { 
    id: 3, 
    title: "Services", 
    path: "/services", 
    status: "published", 
    lastModified: "3 days ago",
    views: "2,103"
  },
  { 
    id: 4, 
    title: "Portfolio", 
    path: "/portfolio", 
    status: "draft", 
    lastModified: "5 days ago",
    views: "0"
  },
  { 
    id: 5, 
    title: "Contact", 
    path: "/contact", 
    status: "published", 
    lastModified: "1 week ago",
    views: "567"
  }
];

const mediaFiles = [
  { name: "hero-bg.jpg", size: "2.5 MB", type: "image", uploaded: "2 days ago" },
  { name: "logo.png", size: "156 KB", type: "image", uploaded: "1 week ago" },
  { name: "portfolio-1.jpg", size: "1.8 MB", type: "image", uploaded: "3 days ago" },
  { name: "team-photo.jpg", size: "3.2 MB", type: "image", uploaded: "5 days ago" },
  { name: "icon-sprite.svg", size: "45 KB", type: "image", uploaded: "1 week ago" },
  { name: "video-intro.mp4", size: "25.6 MB", type: "video", uploaded: "1 day ago" }
];

const siteFeatures = [
  { name: "SSL Certificate", enabled: true, description: "Secure HTTPS connection" },
  { name: "SEO Optimization", enabled: true, description: "Search engine friendly" },
  { name: "Mobile Responsive", enabled: true, description: "Works on all devices" },
  { name: "Contact Forms", enabled: true, description: "Lead capture functionality" },
  { name: "Analytics Tracking", enabled: false, description: "Google Analytics integration" },
  { name: "Social Media Links", enabled: true, description: "Connected social profiles" }
];

export default function WebsitePage() {
  const getStatusBadge = (status: string) => {
    const config = {
      published: { color: "bg-green-500/20 text-green-400", icon: CheckCircle },
      draft: { color: "bg-yellow-500/20 text-yellow-400", icon: Clock },
      archived: { color: "bg-slate-500/20 text-slate-400", icon: XCircle }
    };
    
    const { color, icon: Icon } = config[status as keyof typeof config] || config.draft;
    
    return (
      <Badge className={`${color} border-0 flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">Website Management</h1>
          <p className="text-muted-foreground">Manage your website content and settings</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-orange-500/20">
          <Globe className="h-4 w-4" />
          View Live Site
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard className="p-4 hover:bg-muted/20 transition-colors cursor-pointer group">
          <Edit3 className="h-5 w-5 text-foreground mb-2" />
          <div>
            <h3 className="text-foreground font-medium">Edit Pages</h3>
            <p className="text-xs text-muted-foreground">Update content and layout</p>
          </div>
        </DashboardCard>

        <DashboardCard className="p-4 hover:bg-muted/20 transition-colors cursor-pointer group">
          <ImageIcon className="h-5 w-5 text-foreground mb-2" />
          <div>
            <h3 className="text-foreground font-medium">Media Library</h3>
            <p className="text-xs text-muted-foreground">Manage images and files</p>
          </div>
        </DashboardCard>

        <DashboardCard className="p-4 hover:bg-muted/20 transition-colors cursor-pointer group">
          <Settings className="h-5 w-5 text-foreground mb-2" />
          <div>
            <h3 className="text-foreground font-medium">Site Settings</h3>
            <p className="text-xs text-muted-foreground">Configure preferences</p>
          </div>
        </DashboardCard>

        <DashboardCard className="p-4 hover:bg-muted/20 transition-colors cursor-pointer group">
          <Code className="h-5 w-5 text-foreground mb-2" />
          <div>
            <h3 className="text-foreground font-medium">Custom Code</h3>
            <p className="text-xs text-muted-foreground">Add scripts and styles</p>
          </div>
        </DashboardCard>
      </div>

      {/* Pages Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-foreground">Site Pages</h2>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              <FileText className="h-4 w-4 mr-2" />
              New Page
            </Button>
          </div>
          
          <div className="space-y-3">
            {sitePages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/20 border border-border hover:border-border/70 transition-all duration-200 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-foreground font-medium group-hover:text-orange-400 transition-colors">{page.title}</h4>
                    {getStatusBadge(page.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{page.path}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Modified {page.lastModified}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {page.views} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>

        {/* Recent Media */}
        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-foreground">Recent Media</h2>
            <Button size="sm" variant="outline" className="border-border hover:bg-muted">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {mediaFiles.slice(0, 6).map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square bg-muted/20 rounded-lg overflow-hidden hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {file.type === "image" ? (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 bg-black/50 rounded">
                    <MoreHorizontal className="h-3 w-3 text-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button variant="outline" className="w-full border-border hover:bg-muted">
              View All Media
            </Button>
          </div>
        </DashboardCard>
      </div>

      {/* Site Features */}
      <DashboardCard>
        <h2 className="text-xl font-medium text-foreground mb-6">Site Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siteFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${feature.enabled ? "bg-green-400" : "bg-slate-400"}`} />
                <div>
                  <h4 className="text-foreground font-medium">{feature.name}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  defaultChecked={feature.enabled}
                />
                <div className="w-11 h-6 bg-muted/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </motion.div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
} 