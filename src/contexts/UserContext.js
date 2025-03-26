// UserContext.js
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLogto } from '@logto/react';

// 1. Create the User Context
const UserContext = createContext(null); // Provide a default value

// 2. Create a custom hook for using the User Context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

// 3. Create the User Provider component
export const UserProvider = ({ children }) => {
    const { isAuthenticated, getIdTokenClaims } = useLogto();
    const [userID, setUserID] = useState('');
    const [claims, setClaims] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        const fetchClaims = async () => {
            setIsLoading(true);
            setError(null); // Clear any previous errors

            try {
                const tokenClaims = await getIdTokenClaims();
                setClaims(tokenClaims);
                setUserID(tokenClaims?.email || '');
            } catch (err) {
                console.error('Failed to get ID token claims:', err);
                setError(err); // Set the error state
                setUserID('');
                setClaims(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) { // Only fetch claims if authenticated
            fetchClaims();
        } else {
            // Reset state when not authenticated
            setUserID('');
            setClaims(null);
            setIsLoading(false);
        }
    }, [getIdTokenClaims, isAuthenticated]);

    // Memoize the context value for performance
    const contextValue = useMemo(() => ({
        userID,
        claims,
        isLoading,
        error // Include the error state in the context
    }), [userID, claims, isLoading, error]);

    return (
        <UserContext.Provider value={contextValue}>
          {children}
        </UserContext.Provider>
      );
};
export default UserContext;