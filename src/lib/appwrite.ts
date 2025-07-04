import { Client, Account, Databases, OAuthProvider, Query } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite Cloud endpoint
  .setProject('6861736a0007a58bac63'); // Your project ID

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
  FIELD_CONFIGS: 'field_configs'
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