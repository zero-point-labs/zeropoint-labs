"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Mail, 
  Calendar,
  User,
  MessageSquare,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Archive,
  MoreHorizontal,
  Send
} from "lucide-react";

const submissions = [
  {
    id: 1,
    formName: "Contact Form",
    name: "John Doe",
    email: "john.doe@example.com",
    message: "I'm interested in your web development services for my startup...",
    date: "2024-01-15T10:30:00",
    status: "new",
    priority: "high"
  },
  {
    id: 2,
    formName: "Quote Request",
    name: "Sarah Smith",
    email: "sarah@company.com",
    message: "We need a complete website redesign with e-commerce capabilities...",
    date: "2024-01-14T14:20:00",
    status: "replied",
    priority: "medium"
  },
  {
    id: 3,
    formName: "Support Ticket",
    name: "Mike Johnson",
    email: "mike.j@email.com",
    message: "Having issues with the contact form on mobile devices...",
    date: "2024-01-13T09:15:00",
    status: "resolved",
    priority: "low"
  },
  {
    id: 4,
    formName: "Newsletter Signup",
    name: "Emma Wilson",
    email: "emma.w@gmail.com",
    message: "",
    date: "2024-01-12T16:45:00",
    status: "new",
    priority: "low"
  },
  {
    id: 5,
    formName: "Contact Form",
    name: "David Chen",
    email: "david@techcorp.com",
    message: "Looking for ongoing website maintenance services...",
    date: "2024-01-11T11:00:00",
    status: "pending",
    priority: "medium"
  }
];

const formStats = [
  { label: "Total Submissions", value: "156", icon: FileText, change: "+12", color: "text-blue-400" },
  { label: "Unread", value: "8", icon: Mail, change: "2 new", color: "text-orange-400" },
  { label: "Response Rate", value: "94%", icon: CheckCircle, change: "+3%", color: "text-green-400" },
  { label: "Avg. Response Time", value: "2.4h", icon: Clock, change: "-30m", color: "text-purple-400" }
];

export default function FormsPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

  const filteredSubmissions = selectedStatus === "all" 
    ? submissions 
    : submissions.filter(sub => sub.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: "bg-orange-500/20 text-orange-400", icon: Mail },
      pending: { color: "bg-yellow-500/20 text-yellow-400", icon: Clock },
      replied: { color: "bg-blue-500/20 text-blue-400", icon: MessageSquare },
      resolved: { color: "bg-green-500/20 text-green-400", icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getPriorityDot = (priority: string) => {
    const colors = {
      high: "bg-red-400",
      medium: "bg-yellow-400",
      low: "bg-green-400"
    };
    return <div className={`w-2 h-2 rounded-full ${colors[priority as keyof typeof colors]}`} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "replied":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getFormIcon = (formType: string) => {
    switch (formType) {
      case "Contact Form":
        return Mail;
      case "Quote Request":
        return MessageSquare;
      default:
        return Mail;
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">Form Submissions</h1>
          <p className="text-muted-foreground">Manage and respond to form submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors flex items-center gap-2 border border-border hover:border-border/70">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors flex items-center gap-2 border border-border hover:border-border/70">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {formStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DashboardCard className="p-4" interactive glow>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </DashboardCard>
            </motion.div>
          );
        })}
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-lg w-fit">
        {["all", "new", "pending", "replied"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedStatus === status
                ? "bg-orange-500/20 text-orange-400"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Recent Submissions */}
      <DashboardCard>
        <h2 className="text-lg font-medium text-foreground">Recent Submissions</h2>
        <div className="mt-6 space-y-4">
          {filteredSubmissions.map((submission, index) => {
            const FormIcon = getFormIcon(submission.formName);
            return (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-muted/20 transition-colors group cursor-pointer"
                onClick={() => setSelectedSubmission(submission.id === selectedSubmission ? null : submission.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center group-hover:bg-muted/40 transition-colors">
                    <FormIcon className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-foreground font-medium group-hover:text-orange-400 transition-colors">{submission.name}</h3>
                      <div className="flex items-center gap-3">
                        {getPriorityDot(submission.priority)}
                        {getStatusBadge(submission.status)}
                        <span className="text-xs text-muted-foreground">
                          {new Date(submission.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{submission.email}</p>
                        <p className="text-sm text-foreground mt-1 truncate max-w-md">
                          {submission.message || submission.formName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-muted/30 rounded-lg transition-colors">
                          <Send className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-muted/30 rounded-lg transition-colors">
                          <Archive className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </DashboardCard>

      {/* Form Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <h3 className="text-lg font-medium text-foreground mb-4">Form Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted/20 transition-colors">
              <span className="text-sm text-muted-foreground">Contact Form</span>
              <span className="text-sm text-foreground">67 submissions</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted/20 transition-colors">
              <span className="text-sm text-muted-foreground">Quote Request</span>
              <span className="text-sm text-foreground">45 submissions</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted/20 transition-colors">
              <span className="text-sm text-muted-foreground">Newsletter</span>
              <span className="text-sm text-foreground">234 signups</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <h3 className="text-lg font-medium text-foreground mb-4">Response Times</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted/20 transition-colors">
              <span className="text-sm text-muted-foreground">Average</span>
              <span className="text-sm text-foreground">2.4 hours</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-orange-400 h-2 rounded-full w-3/4" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mt-2">
              <span>Fast (&lt;1h)</span>
              <span>Medium (1-4h)</span>
              <span>Slow (&gt;4h)</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Conversion Rate</h3>
            <div className="text-center">
              <div className="text-3xl font-semibold text-foreground mb-2">94%</div>
              <p className="text-sm text-muted-foreground">Forms completed successfully</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
} 