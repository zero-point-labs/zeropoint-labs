import { Client, Account, Databases, Storage, Functions } from 'appwrite';

const client = new Client();

// Primary endpoint (production)
const primaryEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://zeropoint-labs.com/v1';

// Fallback endpoints for development/testing
const fallbackEndpoints = [
    'http://localhost:80/v1',
    'http://localhost:8080/v1',
    'https://cloud.appwrite.io/v1'
];

client
    .setEndpoint(primaryEndpoint)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'zeropoint-labs');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export configuration for debugging
export const appwriteConfig = {
    endpoint: primaryEndpoint,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'zeropoint-labs',
    fallbackEndpoints,
    isProduction: process.env.NODE_ENV === 'production',
    hasApiKey: !!process.env.APPWRITE_API_KEY
};

export default client; 