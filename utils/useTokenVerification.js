import { useEffect, useRef } from 'react';
import { verifyToken, refreshToken, clearAuthData } from './auth';

/**
 * Custom hook to automatically verify and refresh tokens
 * Checks token validity every 5 seconds and refreshes if expired
 */
export const useTokenVerification = () => {
    const intervalRef = useRef(null);

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            try {
                // Verify current token
                const verifyResult = await verifyToken();

                if (!verifyResult.success) {
                    console.log('Token verification failed, attempting refresh...');

                    // Token is invalid, try to refresh
                    const refreshResult = await refreshToken();

                    if (!refreshResult.success) {
                        console.error('Token refresh failed, redirecting to login...');
                        clearAuthData();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    } else {
                        console.log('Token refreshed successfully');
                    }
                }
            } catch (error) {
                console.error('Error in token verification:', error);
            }
        };

        // Start the interval to check token every 20 seconds
        intervalRef.current = setInterval(checkAndRefreshToken, 20000);

        // Run immediately on mount
        checkAndRefreshToken();

        // Cleanup interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
};
