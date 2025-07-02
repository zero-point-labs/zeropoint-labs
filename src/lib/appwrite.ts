import { Client, Account, Databases, OAuthProvider } from 'appwrite';

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