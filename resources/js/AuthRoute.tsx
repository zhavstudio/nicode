import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const fetchAuthStatus = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching authentication status:', error);
        return null;
    }
};

export default function useAuth()  {
    const [authData, setAuthData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchAuthStatus();
            setAuthData(data);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const isAuthenticated = !!authData;
    const userRole = authData?.role || null;
    const refetch = async () => {
        setIsLoading(true);
        const data = await fetchAuthStatus();
        setAuthData(data);
        setIsLoading(false);
    };

    return { isAuthenticated, userRole, isLoading, refetch };
};


