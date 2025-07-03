"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search,
  Filter,
  Download,
  X,
  Copy,
  FileText,
  Mail,
  Calendar,
  User,
  MessageSquare,
  CheckCircle,
  RotateCcw,
  ExternalLink,
  Globe,
  Phone,
  DollarSign,
  MapPin,
  Building,
  Clock,
  Monitor,
  Smartphone,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  Send
} from "lucide-react";

// Mock data representing flexible form submissions
const formSubmissions = [
  {
    id: 1,
    name: "Sarah Jones",
    email: "sarah@mail.com",
    formName: "Contact",
    submittedAt: "2025-07-02T13:45:00Z",
    pushedToCrm: false,
    sourcePage: "/contact",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    fields: {
      phone: "+1 555 0123",
      company: "Tech Solutions Inc",
      message: "Looking to redesign our company website with modern UI/UX.",
      budget: "$5,000 – $10,000",
      timeline: "2-3 months"
    }
  },
  {
    id: 2,
    name: "Alex Smith",
    email: "alex@domain.com",
    formName: "Quote",
    submittedAt: "2025-07-01T10:20:00Z",
    pushedToCrm: true,
    sourcePage: "/quote",
    ipAddress: "10.0.0.5",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
    fields: {
      phone: "+1 555 9876",
      projectType: "E-commerce Website",
      budget: "$15,000 – $25,000",
      preferredStartDate: "August 2025",
      features: "Payment integration, inventory management, customer accounts",
      message: "Need a complete e-commerce solution for our retail business."
    }
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@startup.io",
    formName: "Newsletter",
    submittedAt: "2025-06-30T16:15:00Z",
    pushedToCrm: false,
    sourcePage: "/blog/article-1",
    ipAddress: "203.0.113.1",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    fields: {
      interests: "Web Development, UX Design",
      company: "StartupXYZ",
      role: "Product Manager"
    }
  },
  {
    id: 4,
    name: "Michael Chen",
    email: "m.chen@corporate.com",
    formName: "Contact",
    submittedAt: "2025-06-29T09:30:00Z",
    pushedToCrm: true,
    sourcePage: "/services",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
    fields: {
      phone: "+1 555 4567",
      company: "Corporate Solutions Ltd",
      department: "IT",
      urgency: "High",
      message: "Need immediate assistance with website security audit.",
      meetingPreference: "Video call"
    }
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa@agency.co",
    formName: "Partnership",
    submittedAt: "2025-06-28T14:22:00Z",
    pushedToCrm: false,
    sourcePage: "/partners",
    ipAddress: "192.0.2.146",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    fields: {
      phone: "+1 555 7890",
      company: "Creative Agency Co",
      partnershipType: "Referral Program",
      companySize: "10-50 employees",
      services: "Branding, Marketing",
      message: "Interested in establishing a strategic partnership for client referrals."
    }
  }
];

const formStats = [
  { label: "Total Submissions", value: "347", change: "+23 this week", icon: FileText },
  { label: "Pending CRM Push", value: "12", change: "3 new today", icon: RotateCcw },
  { label: "Response Rate", value: "94%", change: "+2% vs last month", icon: CheckCircle },
  { label: "Avg. Response Time", value: "1.2h", change: "-30m improvement", icon: Clock }
];

const formTypes = ["All", "Contact", "Quote", "Newsletter", "Partnership"];

export default function FormsPage() {
  const [selectedForm, setSelectedForm] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [internalNote, setInternalNote] = useState("");

  // Filter submissions based on form type and search query
  const filteredSubmissions = formSubmissions.filter(submission => {
    const matchesForm = selectedForm === "All" || submission.formName === selectedForm;
    const matchesSearch = searchQuery === "" || 
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.formName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesForm && matchesSearch;
  });

  const handleRowClick = (submission: any) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedSubmission(null);
    setInternalNote("");
  };

  const handlePushToCrm = (submissionId: number) => {
    // In real implementation, this would call the CRM API
    console.log("Pushing submission to CRM:", submissionId);
    
    // Update the submission status
    const submissionIndex = formSubmissions.findIndex(s => s.id === submissionId);
    if (submissionIndex !== -1) {
      formSubmissions[submissionIndex].pushedToCrm = true;
    }
    
    if (selectedSubmission && selectedSubmission.id === submissionId) {
      setSelectedSubmission({...selectedSubmission, pushedToCrm: true});
    }
  };

  const handleBulkPush = () => {
    console.log("Bulk pushing submissions to CRM:", selectedSubmissions);
    // Update all selected submissions
    selectedSubmissions.forEach(id => handlePushToCrm(id));
    setSelectedSubmissions([]);
  };

  const handleExportCSV = () => {
    console.log("Exporting submissions to CSV");
    // In real implementation, generate and download CSV
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + " - " + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In real implementation, show toast notification
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('iPhone') || userAgent.includes('Android')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">Form Submissions</h1>
          <p className="text-muted-foreground">Manage form submissions and CRM integration</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedSubmissions.length > 0 && (
            <Button 
              onClick={handleBulkPush}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Push Selected ({selectedSubmissions.length})
            </Button>
          )}
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <Icon className="h-8 w-8 text-orange-400" />
                </div>
              </DashboardCard>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or form type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-foreground"
          />
        </div>
        <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-1">
          {formTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedForm(type)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedForm === type
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DashboardCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-sm text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubmissions(filteredSubmissions.map(s => s.id));
                        } else {
                          setSelectedSubmissions([]);
                        }
                      }}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Form</th>
                  <th className="text-left py-3 px-4">Submitted On</th>
                  <th className="text-center py-3 px-4">Push to CRM</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(submission)}
                  >
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.includes(submission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubmissions([...selectedSubmissions, submission.id]);
                          } else {
                            setSelectedSubmissions(selectedSubmissions.filter(id => id !== submission.id));
                          }
                        }}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{submission.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-muted-foreground">{submission.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{submission.formName}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(submission.submittedAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      {submission.pushedToCrm ? (
                        <Badge className="bg-green-500/20 text-green-400 border-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Sent
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePushToCrm(submission.id)}
                          className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Push
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Detailed Submission Modal */}
      <AnimatePresence>
        {showDetailModal && selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Submission Details</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubmission.formName} form - {formatDate(selectedSubmission.submittedAt)}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-muted/30 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-muted-foreground">Name</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{selectedSubmission.name}</span>
                            <button
                              onClick={() => copyToClipboard(selectedSubmission.name)}
                              className="p-1 hover:bg-muted/30 rounded"
                            >
                              <Copy className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-muted-foreground">Email</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{selectedSubmission.email}</span>
                            <button
                              onClick={() => copyToClipboard(selectedSubmission.email)}
                              className="p-1 hover:bg-muted/30 rounded"
                            >
                              <Copy className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </div>
                        </div>

                        {selectedSubmission.fields.phone && (
                          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-orange-400" />
                              <span className="text-sm text-muted-foreground">Phone</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{selectedSubmission.fields.phone}</span>
                              <button
                                onClick={() => copyToClipboard(selectedSubmission.fields.phone)}
                                className="p-1 hover:bg-muted/30 rounded"
                              >
                                <Copy className="h-3 w-3 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technical Information */}
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Technical Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-muted-foreground">Source Page</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">{selectedSubmission.sourcePage}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-muted-foreground">IP Address</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">{selectedSubmission.ipAddress}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(selectedSubmission.userAgent)}
                            <span className="text-sm text-muted-foreground">Device</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {selectedSubmission.userAgent.includes('iPhone') ? 'Mobile' : 
                             selectedSubmission.userAgent.includes('Android') ? 'Mobile' : 'Desktop'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Form Fields */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Form Data</h3>
                      <div className="space-y-3">
                        {Object.entries(selectedSubmission.fields).map(([key, value]) => (
                          <div key={key} className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-start justify-between">
                              <span className="text-sm text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                              {typeof value === 'string' && value.length < 100 && (
                                <button
                                  onClick={() => copyToClipboard(value as string)}
                                  className="p-1 hover:bg-muted/30 rounded ml-2 flex-shrink-0"
                                >
                                  <Copy className="h-3 w-3 text-muted-foreground" />
                                </button>
                              )}
                            </div>
                            <div className="mt-1">
                              <span className="text-sm font-medium text-foreground whitespace-pre-wrap">
                                {value as string}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Internal Notes</h3>
                      <textarea
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        placeholder="Add internal notes about this submission..."
                        rows={4}
                        className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-foreground"
                      />
                      <Button 
                        size="sm" 
                        className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => console.log("Saving note:", internalNote)}
                      >
                        <StickyNote className="h-4 w-4 mr-2" />
                        Save Note
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Source Page
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {!selectedSubmission.pushedToCrm && (
                    <Button 
                      onClick={() => handlePushToCrm(selectedSubmission.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Push to CRM
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 