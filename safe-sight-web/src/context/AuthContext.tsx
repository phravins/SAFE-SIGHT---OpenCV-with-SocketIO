import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
    currentUser: User | null;
    login: (username: string, password?: string) => Promise<boolean>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { users } = useData();

    const login = async (username: string, password?: string): Promise<boolean> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = users.find(u => u.username === username);

        if (user) {
            // Simple password check (in real app, use hashing)
            // For admin, check specific password
            if (user.role === 'admin') {
                if (password === '2005') {
                    setCurrentUser(user);
                    return true;
                }
            } else {
                // For regular users, check password if provided (or just username as per some flows, but let's enforce password)
                if (user.password === password) {
                    setCurrentUser(user);
                    return true;
                }
            }
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isAdmin: currentUser?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
