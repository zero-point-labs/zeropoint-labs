"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  createCustomer, 
  getCustomers, 
  updateCustomer, 
  deleteCustomer,
  saveCRMConfiguration,
  getCRMConfiguration,
  subscribeToCustomers,
  subscribeToCRMConfig
} from './appwrite';
import { useAuth } from './auth-context';

// Types
export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'date' | 'textarea' | 'url' | 'boolean' | 'currency' | 'percentage';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  visible?: boolean;
  order?: number;
  isCustom?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  width?: string;
}

export interface DashboardCardConfig {
  id: string;
  label: string;
  field?: string;
  calculation: 'count' | 'sum' | 'average' | 'custom';
  filter?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  icon: string;
  color: string;
  order: number;
  visible: boolean;
  customFormula?: string;
}

export interface Customer {
  $id?: string;
  id?: number;
  [key: string]: any;
}

interface CRMState {
  customers: Customer[];
  fields: FieldConfig[];
  columns: ColumnConfig[];
  dashboardCards: DashboardCardConfig[];
  loading: boolean;
  error: string | null;
  configLoading: boolean;
  configError: string | null;
}

// Default configurations
const defaultFields: FieldConfig[] = [
  { id: 'name', label: 'Full Name', type: 'text', required: true, visible: true, order: 1, isCustom: false },
  { id: 'email', label: 'Email Address', type: 'email', required: true, visible: true, order: 2, isCustom: false },
  { id: 'phone', label: 'Phone Number', type: 'phone', visible: true, order: 3, isCustom: false },
  { id: 'company', label: 'Company', type: 'text', visible: true, order: 4, isCustom: false },
  { id: 'status', label: 'Status', type: 'select', options: ['prospect', 'active', 'inactive'], visible: true, order: 5, isCustom: false },
  { id: 'value', label: 'Customer Value', type: 'currency', visible: true, order: 6, isCustom: false },
  { id: 'website', label: 'Website', type: 'url', visible: false, order: 7, isCustom: false },
  { id: 'notes', label: 'Notes', type: 'textarea', visible: false, order: 8, isCustom: false },
  { id: 'lastContact', label: 'Last Contact', type: 'date', visible: false, order: 9, isCustom: false },
  { id: 'industry', label: 'Industry', type: 'select', options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Education', 'Other'], visible: false, order: 10, isCustom: false },
  { id: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'], visible: false, order: 11, isCustom: false },
  { id: 'isVip', label: 'VIP Customer', type: 'boolean', visible: false, order: 12, isCustom: false }
];

const defaultColumns: ColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true, order: 1, width: '180px' },
  { id: 'company', label: 'Company', visible: true, order: 2, width: '160px' },
  { id: 'email', label: 'Email', visible: true, order: 3, width: '200px' },
  { id: 'phone', label: 'Phone', visible: true, order: 4, width: '150px' },
  { id: 'status', label: 'Status', visible: true, order: 5, width: '120px' },
  { id: 'value', label: 'Value', visible: true, order: 6, width: '120px' }
];

const defaultDashboardCards: DashboardCardConfig[] = [
  { id: 'total_customers', label: 'Total Customers', calculation: 'count', icon: 'Users', color: 'from-blue-400 to-blue-600', order: 1, visible: true },
  { id: 'active_customers', label: 'Active Customers', calculation: 'count', field: 'status', filter: { field: 'status', operator: 'equals', value: 'active' }, icon: 'CheckCircle', color: 'from-green-400 to-green-600', order: 2, visible: true },
  { id: 'prospects', label: 'Prospects', calculation: 'count', field: 'status', filter: { field: 'status', operator: 'equals', value: 'prospect' }, icon: 'TrendingUp', color: 'from-purple-400 to-purple-600', order: 3, visible: true },
  { id: 'total_value', label: 'Total Value', calculation: 'sum', field: 'value', icon: 'DollarSign', color: 'from-orange-400 to-orange-600', order: 4, visible: true }
];

export function useCRM() {
  const { user, isDemoMode } = useAuth();
  const [state, setState] = useState<CRMState>({
    customers: [],
    fields: defaultFields,
    columns: defaultColumns,
    dashboardCards: defaultDashboardCards,
    loading: false,
    error: null,
    configLoading: false,
    configError: null
  });

  // Load CRM configuration on mount
  useEffect(() => {
    if (user && !isDemoMode) {
      loadCRMConfiguration();
    }
  }, [user, isDemoMode]);

  // Load customers on mount and when configuration changes
  useEffect(() => {
    if (user) {
      loadCustomers();
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (user && !isDemoMode) {
      const customersUnsubscribe = subscribeToCustomers(user.$id, (payload) => {
        console.log('Real-time customer update:', payload);
        // Refresh customers on real-time updates
        loadCustomers();
      });

      const configUnsubscribe = subscribeToCRMConfig(user.$id, (payload) => {
        console.log('Real-time config update:', payload);
        // Refresh configuration on real-time updates
        loadCRMConfiguration();
      });

      return () => {
        if (customersUnsubscribe) customersUnsubscribe();
        if (configUnsubscribe) configUnsubscribe();
      };
    }
  }, [user, isDemoMode]);

  const loadCRMConfiguration = async () => {
    if (!user || isDemoMode) return;

    setState(prev => ({ ...prev, configLoading: true, configError: null }));
    
    try {
      const config = await getCRMConfiguration(user.$id);
      if (config) {
        setState(prev => ({
          ...prev,
          fields: config.fields.length > 0 ? config.fields : defaultFields,
          columns: config.columns.length > 0 ? config.columns : defaultColumns,
          dashboardCards: config.dashboardCards.length > 0 ? config.dashboardCards : defaultDashboardCards,
          configLoading: false
        }));
      } else {
        // No configuration found, save default configuration
        await saveCRMConfiguration(user.$id, {
          fields: defaultFields,
          columns: defaultColumns,
          dashboardCards: defaultDashboardCards
        });
        setState(prev => ({ ...prev, configLoading: false }));
      }
    } catch (error) {
      console.error('Error loading CRM configuration:', error);
      setState(prev => ({
        ...prev,
        configError: error instanceof Error ? error.message : 'Failed to load configuration',
        configLoading: false
      }));
    }
  };

  const loadCustomers = async () => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (isDemoMode) {
        // Use demo data
        const demoCustomers = [
          {
            $id: 'demo-1',
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "+1 (555) 123-4567",
            company: "Tech Solutions Inc",
            status: "active",
            value: 25000,
            website: "https://techsolutions.com",
            notes: "Key decision maker, interested in enterprise solutions",
            lastContact: "2024-01-15",
            industry: "Technology",
            priority: "High",
            isVip: true
          },
          {
            $id: 'demo-2',
            id: 2,
            name: "Sarah Johnson",
            email: "sarah@designco.com",
            phone: "+1 (555) 987-6543",
            company: "Design Co",
            status: "prospect",
            value: 15000,
            website: "https://designco.com",
            notes: "Looking for branding package",
            lastContact: "2024-01-14",
            industry: "Retail",
            priority: "Medium",
            isVip: false
          }
        ];
        setState(prev => ({ ...prev, customers: demoCustomers, loading: false }));
      } else {
        const customers = await getCustomers(user.$id);
        setState(prev => ({ ...prev, customers, loading: false }));
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load customers',
        loading: false
      }));
    }
  };

  const addCustomer = async (customerData: Omit<Customer, '$id' | 'id'>) => {
    if (!user) throw new Error('User not authenticated');

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (isDemoMode) {
        // Demo mode - add locally
        const newCustomer = {
          ...customerData,
          $id: `demo-${Date.now()}`,
          id: Math.max(0, ...state.customers.map(c => c.id || 0)) + 1
        };
        setState(prev => ({
          ...prev,
          customers: [...prev.customers, newCustomer],
          loading: false
        }));
        return newCustomer;
      } else {
        // Clean and normalize data for Appwrite
        const cleanedData = { ...customerData };
        
        // Remove any metadata fields that shouldn't be sent
        delete cleanedData.$id;
        delete cleanedData.$collectionId;
        delete cleanedData.$databaseId;
        delete cleanedData.$createdAt;
        delete cleanedData.$updatedAt;
        delete cleanedData.$permissions;
        
        // Process fields for URL normalization and cleanup
        state.fields.forEach(field => {
          const value = cleanedData[field.id];
          
          if (field.type === 'url') {
            if (value && value.toString().trim() !== '') {
              // Normalize URL: add https:// if no protocol is present
              let normalizedUrl = value.toString().trim();
              if (!normalizedUrl.match(/^https?:\/\//)) {
                normalizedUrl = `https://${normalizedUrl}`;
              }
              cleanedData[field.id] = normalizedUrl;
            } else {
              // Remove empty URL fields to prevent validation errors
              delete cleanedData[field.id];
            }
          }
        });
        
        const newCustomer = await createCustomer(cleanedData, user.$id);
        setState(prev => ({
          ...prev,
          customers: [...prev.customers, newCustomer],
          loading: false
        }));
        return newCustomer;
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add customer',
        loading: false
      }));
      throw error;
    }
  };

  const updateCustomerData = async (customerId: string, customerData: Partial<Customer>) => {
    if (!user) throw new Error('User not authenticated');

    // Optimistic update
    setState(prev => ({
      ...prev,
      customers: prev.customers.map(customer =>
        customer.$id === customerId ? { ...customer, ...customerData } : customer
      )
    }));

    try {
      if (isDemoMode) {
        // Demo mode - already updated optimistically
        return;
      } else {
        // Clean and normalize data for Appwrite
        const cleanedData = { ...customerData };
        
        // Remove Appwrite metadata fields that shouldn't be sent
        delete cleanedData.$id;
        delete cleanedData.$collectionId;
        delete cleanedData.$databaseId;
        delete cleanedData.$createdAt;
        delete cleanedData.$updatedAt;
        delete cleanedData.$permissions;
        
        // Process fields for URL normalization and cleanup
        state.fields.forEach(field => {
          const value = cleanedData[field.id];
          
          if (field.type === 'url') {
            if (value && value.toString().trim() !== '') {
              // Normalize URL: add https:// if no protocol is present
              let normalizedUrl = value.toString().trim();
              if (!normalizedUrl.match(/^https?:\/\//)) {
                normalizedUrl = `https://${normalizedUrl}`;
              }
              cleanedData[field.id] = normalizedUrl;
            } else {
              // Remove empty URL fields to prevent validation errors
              delete cleanedData[field.id];
            }
          }
        });
        
        await updateCustomer(customerId, cleanedData, user.$id);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      // Revert optimistic update
      loadCustomers();
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update customer'
      }));
      throw error;
    }
  };

  const removeCustomer = async (customerId: string) => {
    if (!user) throw new Error('User not authenticated');

    // Optimistic update
    setState(prev => ({
      ...prev,
      customers: prev.customers.filter(customer => customer.$id !== customerId)
    }));

    try {
      if (isDemoMode) {
        // Demo mode - already updated optimistically
        return;
      } else {
        await deleteCustomer(customerId);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      // Revert optimistic update
      loadCustomers();
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete customer'
      }));
      throw error;
    }
  };

  const updateFields = useCallback(async (newFields: FieldConfig[]) => {
    setState(prev => ({ ...prev, fields: newFields }));
    
    if (user && !isDemoMode) {
      try {
        await saveCRMConfiguration(user.$id, {
          fields: newFields,
          columns: state.columns,
          dashboardCards: state.dashboardCards
        });
      } catch (error) {
        console.error('Error saving field configuration:', error);
      }
    }
  }, [user, isDemoMode, state.columns, state.dashboardCards]);

  const updateColumns = useCallback(async (newColumns: ColumnConfig[]) => {
    setState(prev => ({ ...prev, columns: newColumns }));
    
    if (user && !isDemoMode) {
      try {
        await saveCRMConfiguration(user.$id, {
          fields: state.fields,
          columns: newColumns,
          dashboardCards: state.dashboardCards
        });
      } catch (error) {
        console.error('Error saving column configuration:', error);
      }
    }
  }, [user, isDemoMode, state.fields, state.dashboardCards]);

  const updateDashboardCards = useCallback(async (newDashboardCards: DashboardCardConfig[]) => {
    setState(prev => ({ ...prev, dashboardCards: newDashboardCards }));
    
    if (user && !isDemoMode) {
      try {
        await saveCRMConfiguration(user.$id, {
          fields: state.fields,
          columns: state.columns,
          dashboardCards: newDashboardCards
        });
      } catch (error) {
        console.error('Error saving dashboard configuration:', error);
      }
    }
  }, [user, isDemoMode, state.fields, state.columns]);

  const clearError = () => {
    setState(prev => ({ ...prev, error: null, configError: null }));
  };

  return {
    // State
    customers: state.customers,
    fields: state.fields,
    columns: state.columns,
    dashboardCards: state.dashboardCards,
    loading: state.loading,
    error: state.error,
    configLoading: state.configLoading,
    configError: state.configError,

    // Actions
    loadCustomers,
    addCustomer,
    updateCustomer: updateCustomerData,
    removeCustomer,
    updateFields,
    updateColumns,
    updateDashboardCards,
    clearError,
    
    // Utilities
    refreshData: () => {
      loadCustomers();
      loadCRMConfiguration();
    }
  };
} 