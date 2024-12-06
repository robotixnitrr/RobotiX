import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    age: number;
    phone: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Try to get user from localStorage first
                const storedUser = authService.getCurrentUser();
                if (storedUser) {
                    setUser(storedUser);
                } else {
                    // If no stored user, check with the server
                    const response = await authService.checkAuth();
                    if (response.user) {
                        setUser(response.user);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const value = {
        user,
        setUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};