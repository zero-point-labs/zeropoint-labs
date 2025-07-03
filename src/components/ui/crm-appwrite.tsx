"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  MapPin,
  Star,
  Activity,
  X,
  Save,
  Settings,
  ArrowUp,
  ArrowDown,
  GripVertical,
  BarChart3,
  Database,
  Columns3,
  SlidersHorizontal,
  EyeOff,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react";
import { DashboardCard } from "./dashboard-card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card } from "./card";
import { Input } from "./input";
import { FieldEditor } from "./crm-field-editor";
import { DashboardCustomizer } from "./crm-dashboard-customizer";
import { useCRM, type FieldConfig, type ColumnConfig, type DashboardCardConfig, type Customer } from "@/lib/useCRM";
import { useAuth } from "@/lib/auth-context";
import * as Icons from "lucide-react";

export function CRMDashboardAppwrite() {
  const { user, isDemoMode } = useAuth();
  const {
    customers,
    fields,
    columns,
    dashboardCards,
    loading,
    error,
    configLoading,
    configError,
    addCustomer,
    updateCustomer,
    removeCustomer,
    updateFields,
    updateColumns,
    updateDashboardCards,
    clearError,
    refreshData
  } = useCRM();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customizationMode, setCustomizationMode] = useState<'fields' | 'columns' | 'dashboard' | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  // Get visible fields and columns
  const visibleFields = fields.filter(f => f.visible).sort((a, b) => (a.order || 0) - (b.order || 0));
  const visibleColumns = columns.filter(c => c.visible).sort((a, b) => a.order - b.order);
  const visibleDashboardCards = dashboardCards.filter(c => c.visible).sort((a, b) => a.order - b.order);

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return Object.values(customer).some(value => 
      value && value.toString().toLowerCase().includes(searchLower)
    );
  });

  // Enhanced value formatting with new field types
  const formatValue = (value: any, fieldType: string) => {
    if (value === null || value === undefined || value === '') return '-';
    
    switch (fieldType) {
      case 'currency':
        if (typeof value === 'number') {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        }
        return value;
      case 'percentage':
        if (typeof value === 'number') {
          return `${value}%`;
        }
        return value;
      case 'number':
        if (typeof value === 'number') {
          return new Intl.NumberFormat('en-US').format(value);
        }
        return value;
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        if (value) {
          return new Date(value).toLocaleDateString();
        }
        return '-';
      case 'url':
        if (value && value.startsWith('http')) {
          return (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {value.replace(/^https?:\/\//, '')}
            </a>
          );
        }
        return value;
      default:
        return value;
    }
  };

  // Calculate dashboard card values
  const calculateCardValue = (card: DashboardCardConfig): string => {
    let data = customers;

    // Apply filter if exists
    if (card.filter) {
      data = customers.filter(customer => {
        const fieldValue = customer[card.filter!.field];
        const filterValue = card.filter!.value;

        switch (card.filter!.operator) {
          case 'equals':
            return fieldValue === filterValue;
          case 'not_equals':
            return fieldValue !== filterValue;
          case 'contains':
            return fieldValue && fieldValue.toString().toLowerCase().includes(filterValue.toLowerCase());
          case 'greater_than':
            return Number(fieldValue) > Number(filterValue);
          case 'less_than':
            return Number(fieldValue) < Number(filterValue);
          default:
            return true;
        }
      });
    }

    switch (card.calculation) {
      case 'count':
        return data.length.toString();
      case 'sum':
        if (card.field) {
          const sum = data.reduce((total, customer) => total + (Number(customer[card.field!]) || 0), 0);
          const field = fields.find(f => f.id === card.field);
          return formatValue(sum, field?.type || 'number').toString();
        }
        return '0';
      case 'average':
        if (card.field) {
          const sum = data.reduce((total, customer) => total + (Number(customer[card.field!]) || 0), 0);
          const avg = data.length > 0 ? sum / data.length : 0;
          const field = fields.find(f => f.id === card.field);
          return formatValue(avg, field?.type || 'number').toString();
        }
        return '0';
      case 'custom':
        // Simple custom formula implementation
        if (card.customFormula) {
          let formula = card.customFormula;
          formula = formula.replace(/\{total_count\}/g, customers.length.toString());
          formula = formula.replace(/\{active_count\}/g, customers.filter(c => c.status === 'active').length.toString());
          formula = formula.replace(/\{prospect_count\}/g, customers.filter(c => c.status === 'prospect').length.toString());
          
          try {
            const result = eval(formula);
            return result.toString();
          } catch {
            return 'Error';
          }
        }
        return '0';
      default:
        return '0';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "prospect":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const resetForm = () => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.type === 'boolean') {
        initialData[field.id] = false;
      } else if (field.type === 'number' || field.type === 'currency' || field.type === 'percentage') {
        initialData[field.id] = 0;
      } else if (field.type === 'select' && field.options) {
        initialData[field.id] = field.options[0];
      } else {
        initialData[field.id] = '';
      }
    });
    setFormData(initialData);
  };

  // Update form when fields change to ensure new fields are included
  useEffect(() => {
    if (isAddModalOpen && !editingCustomer) {
      resetForm();
    }
  }, [fields, isAddModalOpen]);

  const openAddModal = () => {
    resetForm();
    setEditingCustomer(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    const updatedFormData = { ...customer };
    // Ensure all current fields have values in form data
    fields.forEach(field => {
      if (!(field.id in updatedFormData)) {
        if (field.type === 'boolean') {
          updatedFormData[field.id] = false;
        } else if (field.type === 'number' || field.type === 'currency' || field.type === 'percentage') {
          updatedFormData[field.id] = 0;
        } else if (field.type === 'select' && field.options) {
          updatedFormData[field.id] = field.options[0];
        } else {
          updatedFormData[field.id] = '';
        }
      }
    });
    setFormData(updatedFormData);
    setEditingCustomer(customer);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingCustomer(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Clean and normalize form data
      const cleanedFormData = { ...formData };
      
      // Remove Appwrite metadata fields that shouldn't be sent
      delete cleanedFormData.$id;
      delete cleanedFormData.$collectionId;
      delete cleanedFormData.$databaseId;
      delete cleanedFormData.$createdAt;
      delete cleanedFormData.$updatedAt;
      delete cleanedFormData.$permissions;
      
      // Process each field
      fields.forEach(field => {
        const value = cleanedFormData[field.id];
        
        if (field.type === 'url') {
          if (value && value.trim() !== '') {
            // Normalize URL: add https:// if no protocol is present
            let normalizedUrl = value.trim();
            if (!normalizedUrl.match(/^https?:\/\//)) {
              normalizedUrl = `https://${normalizedUrl}`;
            }
            cleanedFormData[field.id] = normalizedUrl;
          } else {
            // Remove empty URL fields to prevent validation errors
            delete cleanedFormData[field.id];
          }
        } else if (!value || (typeof value === 'string' && value.trim() === '')) {
          // Remove completely empty fields
          delete cleanedFormData[field.id];
        }
      });
      
      if (editingCustomer) {
        await updateCustomer(editingCustomer.$id!, cleanedFormData);
      } else {
        await addCustomer(cleanedFormData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await removeCustomer(customerId);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  // Enhanced form field rendering with new field types
  const renderFormField = (field: FieldConfig) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px] resize-vertical"
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-border rounded"
            />
            <span className="ml-2 text-sm text-muted-foreground">Yes</span>
          </div>
        );
      case 'currency':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
            min={field.validation?.min || 0}
            max={field.validation?.max}
          />
        );
      case 'percentage':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
            min={0}
            max={100}
          />
        );
      case 'url':
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
            min={field.type === 'number' ? field.validation?.min || 0 : undefined}
            max={field.type === 'number' ? field.validation?.max : undefined}
          />
        );
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as any;
    return Icon ? <Icon className="h-5 w-5 text-white" /> : <Icons.HelpCircle className="h-5 w-5 text-white" />;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please log in to access your CRM</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CRM Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-light text-foreground">Customer Management</h2>
            {isDemoMode && (
              <Badge className="bg-orange-500/20 text-orange-600">Demo Mode</Badge>
            )}
            {!isDemoMode && (
              <div className="flex items-center gap-1">
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500">Live</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground">Completely customizable CRM - fields, columns, and dashboard cards</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshData}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setCustomizationMode('fields')}
            variant="outline"
            size="sm"
          >
            <Database className="h-4 w-4 mr-2" />
            Fields
          </Button>
          <Button 
            onClick={() => setCustomizationMode('columns')}
            variant="outline"
            size="sm"
          >
            <Columns3 className="h-4 w-4 mr-2" />
            Columns
          </Button>
          <Button 
            onClick={() => setCustomizationMode('dashboard')}
            variant="outline"
            size="sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Cards
          </Button>
          <Button 
            onClick={openAddModal}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={loading}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {(error || configError) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-600">{error || configError}</p>
          </div>
          <Button variant="outline" size="sm" onClick={clearError}>
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Loading State for Configuration */}
      {configLoading && (
        <div className="bg-muted/20 border border-border rounded-lg p-4 flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
          />
          <p className="text-muted-foreground">Loading CRM configuration...</p>
        </div>
      )}

      {/* Dynamic CRM Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleDashboardCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DashboardCard glow>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {loading ? '...' : calculateCardValue(card)}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  {getIconComponent(card.icon)}
                </div>
              </div>
            </DashboardCard>
          </motion.div>
        ))}
      </div>

      {/* Customer List */}
      <DashboardCard>
        <div className="mb-6">
          <h3 className="text-xl font-medium text-foreground mb-4">Customer Database</h3>
          
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Loading State for Customers */}
        {loading && (
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full mx-auto mb-4"
            />
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        )}

        {/* Customer List - Responsive Design */}
        {!loading && (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-3">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-border/30 bg-background hover:bg-muted/20 transition-colors"
                >
                  {/* Customer Header - Always Visible */}
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setExpandedCustomer(expandedCustomer === customer.$id ? null : customer.$id!)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {customer.name ? customer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{customer.name || 'Unnamed Customer'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground truncate">
                            {customer.email || customer.company || 'No contact info'}
                          </p>
                          {customer.status && (
                            <Badge className={`${getStatusColor(customer.status)} text-xs px-2 py-0.5`}>
                              {customer.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(customer);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <motion.div
                        animate={{ rotate: expandedCustomer === customer.$id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedCustomer === customer.$id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-border/30">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {visibleFields.map((field) => {
                              const value = customer[field.id];
                              if (!value && value !== 0 && value !== false) return null;
                              
                              return (
                                <div key={field.id} className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {field.label}
                                  </p>
                                  <div className="text-sm text-foreground">
                                    {field.id === 'status' ? (
                                      <Badge className={`${getStatusColor(value)} text-xs`}>
                                        {value}
                                      </Badge>
                                    ) : (
                                      <div className="break-words">
                                        {formatValue(value, field.type)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(customer)}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Customer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCustomer(customer.$id!);
                              }}
                              className="text-red-500 hover:text-red-600 border-red-500/30 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No customers found matching your search.' : 'No customers yet.'}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={openAddModal}
                      className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Your First Customer
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block w-full">
              <div className="overflow-x-auto border border-border/30 rounded-lg">
                <div style={{ minWidth: visibleColumns.length > 4 ? `${visibleColumns.length * 150 + 130}px` : 'auto' }}>
                  <table 
                    className="border-collapse bg-background w-full"
                    style={{
                      tableLayout: 'fixed',
                      minWidth: '100%'
                    }}
                  >
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/5">
                        <th 
                          className="text-left p-2 text-xs font-medium text-muted-foreground sticky left-0 bg-muted/5 z-10 border-r border-border/20" 
                          style={{ width: '50px', minWidth: '50px' }}
                        >
                          <div className="truncate">Avatar</div>
                        </th>
                        {visibleColumns.map((column, index) => {
                          const columnWidth = column.width 
                            ? (column.width.includes('px') ? column.width : `${parseInt(column.width, 10)}px`) 
                            : '140px';
                          return (
                            <th 
                              key={column.id} 
                              className="text-left p-2 text-xs font-medium text-muted-foreground border-r border-border/20 whitespace-nowrap" 
                              style={{ 
                                width: columnWidth, 
                                minWidth: columnWidth
                              }}
                            >
                              <div className="truncate" title={column.label}>
                                {column.label}
                              </div>
                            </th>
                          );
                        })}
                        <th 
                          className="text-right p-2 text-xs font-medium text-muted-foreground sticky right-0 bg-muted/5 z-10" 
                          style={{ width: '80px', minWidth: '80px' }}
                        >
                          <div className="truncate">Actions</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer, index) => (
                        <motion.tr
                          key={customer.$id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border/10 hover:bg-muted/10 cursor-pointer group"
                          onClick={() => openEditModal(customer)}
                        >
                          <td 
                            className="p-2 sticky left-0 bg-background group-hover:bg-muted/10 z-10 border-r border-border/20" 
                            style={{ width: '50px', minWidth: '50px' }}
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                              {customer.name ? customer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '?'}
                            </div>
                          </td>
                          {visibleColumns.map(column => {
                            const field = fields.find(f => f.id === column.id);
                            const value = customer[column.id];
                            const columnWidth = column.width 
                              ? (column.width.includes('px') ? column.width : `${parseInt(column.width, 10)}px`) 
                              : '140px';
                            
                            return (
                              <td 
                                key={column.id} 
                                className="p-2 text-xs border-r border-border/20 whitespace-nowrap" 
                                style={{ 
                                  width: columnWidth, 
                                  minWidth: columnWidth
                                }}
                                title={value ? String(value) : ''}
                              >
                                {column.id === 'status' ? (
                                  <Badge className={`${getStatusColor(value)} text-xs px-1 py-0.5`}>
                                    {value}
                                  </Badge>
                                ) : (
                                  <div className="truncate w-full text-foreground">
                                    {formatValue(value, field?.type || 'text')}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td 
                            className="p-2 sticky right-0 bg-background group-hover:bg-muted/10 z-10" 
                            style={{ width: '80px', minWidth: '80px' }}
                          >
                            <div className="flex items-center gap-1 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(customer);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteCustomer(customer.$id!);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No customers found matching your search.' : 'No customers yet.'}
                    </p>
                    {!searchTerm && (
                      <Button 
                        onClick={openAddModal}
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Your First Customer
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DashboardCard>

      {/* Customization Modals */}
      <AnimatePresence>
        {customizationMode === 'fields' && (
          <FieldEditor 
            fields={fields}
            onFieldsChange={updateFields}
            onClose={() => setCustomizationMode(null)}
          />
        )}

        {customizationMode === 'dashboard' && (
          <DashboardCustomizer 
            cards={dashboardCards}
            fields={fields}
            onCardsChange={updateDashboardCards}
            onClose={() => setCustomizationMode(null)}
          />
        )}

        {customizationMode === 'columns' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setCustomizationMode(null)}
          >
            {/* Column configuration modal content - keeping existing implementation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Column Configuration</h3>
                <Button variant="outline" size="sm" onClick={() => setCustomizationMode(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Available Fields to Add as Columns */}
                  <div>
                    <h4 className="text-md font-medium text-foreground mb-4">Available Fields</h4>
                    <p className="text-sm text-muted-foreground mb-4">Click to add fields as table columns</p>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {fields.sort((a, b) => (a.order || 0) - (b.order || 0)).map((field) => {
                        const hasColumn = columns.find(c => c.id === field.id && c.visible);
                        return (
                          <div
                            key={field.id}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                              hasColumn 
                                ? 'bg-orange-500/10 border-orange-500/30 text-orange-600' 
                                : 'bg-muted/20 border-border/30 hover:bg-muted/30'
                            }`}
                            onClick={() => {
                              const existingColumn = columns.find(c => c.id === field.id);
                              if (existingColumn) {
                                // Toggle visibility
                                updateColumns(columns.map(c => 
                                  c.id === field.id ? { ...c, visible: !c.visible } : c
                                ));
                              } else {
                                // Add new column
                                const newColumn = {
                                  id: field.id,
                                  label: field.label,
                                  visible: true,
                                  order: Math.max(0, ...columns.map(c => c.order)) + 1,
                                  width: '140px'
                                };
                                updateColumns([...columns, newColumn]);
                              }
                            }}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{field.label}</span>
                                {!field.visible && (
                                  <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-500 rounded">Hidden Field</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {field.type} {field.required && '• Required'} {field.isCustom && '• Custom'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {hasColumn ? (
                                <Badge className="bg-orange-500 text-white">In Table</Badge>
                              ) : (
                                <Button variant="outline" size="sm">
                                  <Plus className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current Table Columns */}
                  <div>
                    <h4 className="text-md font-medium text-foreground mb-4">Table Columns</h4>
                    <p className="text-sm text-muted-foreground mb-4">Configure visible columns and their order</p>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {columns.sort((a, b) => a.order - b.order).map((column, index) => (
                        <div key={column.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                          column.visible 
                            ? 'bg-muted/20 border-border/30' 
                            : 'bg-muted/10 border-border/20 opacity-50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{column.label}</span>
                                {!column.visible && (
                                  <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-500 rounded">Hidden</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">Width: {column.width}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={column.width}
                              onChange={(e) => {
                                updateColumns(columns.map(c => 
                                  c.id === column.id ? { ...c, width: e.target.value } : c
                                ));
                              }}
                              className="text-xs px-2 py-1 border border-border rounded bg-background"
                            >
                              <option value="80px">80px</option>
                              <option value="100px">100px</option>
                              <option value="120px">120px</option>
                              <option value="140px">140px</option>
                              <option value="150px">150px</option>
                              <option value="180px">180px</option>
                              <option value="200px">200px</option>
                              <option value="250px">250px</option>
                              <option value="300px">300px</option>
                              <option value="350px">350px</option>
                            </select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                updateColumns(columns.map(c => 
                                  c.id === column.id ? { ...c, visible: !c.visible } : c
                                ));
                              }}
                              title={column.visible ? 'Hide column' : 'Show column'}
                            >
                              {column.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
                  <Button variant="outline" onClick={() => setCustomizationMode(null)}>
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Customer Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h3>
                <Button variant="outline" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {editingCustomer ? 'Update Customer' : 'Add Customer'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 