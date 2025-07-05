import { Client, Account, Databases, OAuthProvider, Query } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1') // Use environment variable
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6861736a0007a58bac63'); // Use environment variable

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);

// OAuth providers
export const GoogleOAuth = OAuthProvider.Google;

export { client };

// Database and Collection IDs
export const DATABASE_ID = 'crm_database';
export const COLLECTIONS = {
  CUSTOMERS: 'customers',
  CRM_CONFIGURATIONS: 'crm_configurations',
  FIELD_CONFIGS: 'field_configs',
  // Analytics collections
  WEBSITES: 'websites',
  EVENTS: 'events'
};

// Helper function to check if user is logged in
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

// Helper function for Google OAuth login
export const loginWithGoogle = async () => {
  try {
    // Redirect to Google OAuth
    account.createOAuth2Session(
      GoogleOAuth,
      `${window.location.origin}/dashboard`, // Success redirect
      `${window.location.origin}/login`      // Failure redirect
    );
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
};

// Helper function for email/password login
export const loginWithEmail = async (email: string, password: string) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
};

// Helper function for email/password signup
export const signupWithEmail = async (email: string, password: string, name: string) => {
  try {
    const user = await account.create('unique()', email, password, name);
    // Automatically log in after signup
    await loginWithEmail(email, password);
    return user;
  } catch (error) {
    console.error('Email signup error:', error);
    throw error;
  }
};

// Helper function to logout
export const logout = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Test session function (keeping existing implementation)
export const testSession = async () => {
  try {
    const user = await getCurrentUser();
    return {
      isAuthenticated: !!user,
      user: user ? {
        id: user.$id,
        name: user.name,
        email: user.email,
        emailVerification: user.emailVerification
      } : null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
};

// Refresh session function (keeping existing implementation)
export const refreshSession = async () => {
  try {
    return await getCurrentUser();
  } catch (error) {
    console.error('Session refresh error:', error);
    return null;
  }
};

// Check Appwrite cookies function (missing implementation)
export const checkAppwriteCookies = () => {
  if (typeof window === 'undefined') {
    return { hasSessionCookie: false, allCookies: [] };
  }
  
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const sessionCookie = cookies.find(cookie => 
    cookie.startsWith('a_session_') || 
    cookie.startsWith('a_session=') ||
    cookie.includes('session')
  );
  
  return {
    hasSessionCookie: !!sessionCookie,
    allCookies: cookies.map(cookie => {
      const [name, value] = cookie.split('=');
      return { name: name?.trim(), value: value?.trim() };
    })
  };
};

// Ensure session function (missing implementation)
export const ensureSession = async () => {
  try {
    // Check if we have URL parameters from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    
    // Check for OAuth callback parameters
    const userId = urlParams.get('userId') || hashParams.get('userId');
    const secret = urlParams.get('secret') || hashParams.get('secret');
    
    if (userId && secret) {
      console.log('OAuth callback detected, creating session...');
      
      // Create session using OAuth callback parameters
      const session = await account.createSession(userId, secret);
      console.log('Session created:', session);
      
      // Get user data
      const user = await getCurrentUser();
      console.log('User authenticated:', user);
      
      // Clean up URL parameters
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      return user;
    }
    
    // If no OAuth params, try to get existing session
    return await getCurrentUser();
  } catch (error) {
    console.error('Session establishment error:', error);
    return null;
  }
};

// ===== CRM DATABASE OPERATIONS =====

// Customer operations
export const createCustomer = async (customerData: any, userId: string) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CUSTOMERS,
      'unique()',
      {
        ...customerData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const getCustomers = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CUSTOMERS,
      [
        Query.equal('user_id', userId),
        Query.orderDesc('created_at'),
        Query.limit(1000) // Adjust as needed
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId: string, customerData: any, userId: string) => {
  try {
    // Remove user_id from update data to prevent overwriting
    const { user_id, ...updateData } = customerData;
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.CUSTOMERS,
      customerId,
      {
        ...updateData,
        updated_at: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (customerId: string) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.CUSTOMERS,
      customerId
    );
    return true;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// CRM Configuration operations
export const saveCRMConfiguration = async (userId: string, configData: any) => {
  try {
    // Check if configuration exists
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CRM_CONFIGURATIONS,
      [Query.equal('user_id', userId)]
    );

    const configToSave = {
      user_id: userId,
      fields: JSON.stringify(configData.fields || []),
      columns: JSON.stringify(configData.columns || []),
      dashboard_cards: JSON.stringify(configData.dashboardCards || []),
      updated_at: new Date().toISOString()
    };

    if (existing.documents.length > 0) {
      // Update existing configuration
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CRM_CONFIGURATIONS,
        existing.documents[0].$id,
        configToSave
      );
    } else {
      // Create new configuration
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CRM_CONFIGURATIONS,
        'unique()',
        {
          ...configToSave,
          created_at: new Date().toISOString()
        }
      );
    }
  } catch (error) {
    console.error('Error saving CRM configuration:', error);
    throw error;
  }
};

export const getCRMConfiguration = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CRM_CONFIGURATIONS,
      [Query.equal('user_id', userId)]
    );

    if (response.documents.length > 0) {
      const config = response.documents[0];
      return {
        fields: JSON.parse(config.fields || '[]'),
        columns: JSON.parse(config.columns || '[]'),
        dashboardCards: JSON.parse(config.dashboard_cards || '[]')
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching CRM configuration:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToCustomers = (userId: string, callback: (payload: any) => void) => {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.${COLLECTIONS.CUSTOMERS}.documents`,
    callback
  );
};

export const subscribeToCRMConfig = (userId: string, callback: (payload: any) => void) => {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.${COLLECTIONS.CRM_CONFIGURATIONS}.documents`,
    callback
  );
};

// ===== ANALYTICS DATABASE OPERATIONS =====

// Website operations
export const createWebsite = async (websiteData: {
  domain: string;
  userId: string;
  verified?: boolean;
}) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.WEBSITES,
      'unique()',
      {
        domain: websiteData.domain,
        userId: websiteData.userId,
        verified: websiteData.verified || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating website:', error);
    throw error;
  }
};

export const getWebsites = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WEBSITES,
      [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt')
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
};

export const updateWebsite = async (websiteId: string, websiteData: any, userId: string) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.WEBSITES,
      websiteId,
      {
        ...websiteData,
        userId: userId,
        updatedAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating website:', error);
    throw error;
  }
};

export const deleteWebsite = async (websiteId: string) => {
  try {
    const response = await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.WEBSITES,
      websiteId
    );
    return response;
  } catch (error) {
    console.error('Error deleting website:', error);
    throw error;
  }
};

// Event operations
export const getEvents = async (userId: string, filters: {
  website?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
} = {}) => {
  try {
    const queries = [Query.equal('userId', userId)];
    
    if (filters.website) {
      queries.push(Query.equal('website', filters.website));
    }
    
    if (filters.eventType) {
      queries.push(Query.equal('eventType', filters.eventType));
    }
    
    if (filters.startDate) {
      queries.push(Query.greaterThanEqual('timestamp', filters.startDate));
    }
    
    if (filters.endDate) {
      queries.push(Query.lessThanEqual('timestamp', filters.endDate));
    }
    
    queries.push(Query.orderDesc('timestamp'));
    
    if (filters.limit) {
      queries.push(Query.limit(filters.limit));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.EVENTS,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Analytics aggregation functions
export const getAnalyticsSummary = async (userId: string, website: string, dateRange: {
  startDate: string;
  endDate: string;
}) => {
  try {
    const events = await getEvents(userId, {
      website,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
    
    // Calculate analytics metrics
    const pageViews = events.filter(e => e.eventType === 'page_view');
    const uniqueVisitors = new Set(events.map(e => e.sessionId)).size;
    const totalEvents = events.length;
    
    // Calculate bounce rate (sessions with only one page view)
    const sessionPageViews = events
      .filter(e => e.eventType === 'page_view')
      .reduce((acc, event) => {
        acc[event.sessionId] = (acc[event.sessionId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const bouncedSessions = Object.values(sessionPageViews).filter(count => count === 1).length;
    const bounceRate = uniqueVisitors > 0 ? (bouncedSessions / uniqueVisitors) * 100 : 0;
    
    // Calculate average session duration
    const sessionDurations = events
      .filter(e => e.eventType === 'page_blur' && e.metadata)
      .map(e => {
        try {
          const metadata = typeof e.metadata === 'string' ? JSON.parse(e.metadata) : e.metadata;
          return metadata.sessionDuration || 0;
        } catch {
          return 0;
        }
      });
    
    const avgDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
      : 0;
    
    // Top pages
    const pageViewCounts = pageViews.reduce((acc, event) => {
      acc[event.path] = (acc[event.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topPages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));
    
    // Conversion rate (form submissions / unique visitors)
    const formSubmissions = events.filter(e => e.eventType === 'form_submit').length;
    const conversionRate = uniqueVisitors > 0 ? (formSubmissions / uniqueVisitors) * 100 : 0;
    
    // Real-time active users (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const recentEvents = events.filter(e => e.timestamp > fiveMinutesAgo);
    const activeUsers = new Set(recentEvents.map(e => e.sessionId)).size;
    
    return {
      totalVisitors: uniqueVisitors,
      pageViews: pageViews.length,
      bounceRate: Math.round(bounceRate * 100) / 100,
      avgDuration: Math.round(avgDuration / 1000), // Convert to seconds
      conversionRate: Math.round(conversionRate * 100) / 100,
      topPages,
      activeUsers,
      totalEvents
    };
  } catch (error) {
    console.error('Error calculating analytics summary:', error);
    throw error;
  }
};

// Check if website tracking is working
export const checkWebsiteConnection = async (userId: string, website: string) => {
  try {
    // Check for recent events (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentEvents = await getEvents(userId, {
      website,
      startDate: yesterday,
      limit: 1
    });
    
    return {
      isConnected: recentEvents.length > 0,
      lastEventTime: recentEvents.length > 0 ? recentEvents[0].timestamp : null,
      eventCount: recentEvents.length
    };
  } catch (error) {
    console.error('Error checking website connection:', error);
    return {
      isConnected: false,
      lastEventTime: null,
      eventCount: 0
    };
  }
}; 