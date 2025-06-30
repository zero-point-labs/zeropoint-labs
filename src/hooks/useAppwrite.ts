import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import { Models } from 'appwrite';

export const useAppwriteData = (databaseId: string, collectionId: string) => {
    const [data, setData] = useState<Models.Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await databases.listDocuments(databaseId, collectionId);
                setData(response.documents);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('AppWrite fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (databaseId && collectionId) {
            fetchData();
        }
    }, [databaseId, collectionId]);

    return { data, loading, error };
};

export const useAppwriteAuth = () => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { account } = await import('@/lib/appwrite');
                const currentUser = await account.get();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    return { user, loading };
}; 