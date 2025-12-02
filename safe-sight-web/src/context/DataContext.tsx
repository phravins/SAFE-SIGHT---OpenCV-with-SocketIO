import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, RegistrationRequest, Alert } from '../types';

interface DataContextType {
    users: User[];
    requests: RegistrationRequest[];
    alerts: Alert[];
    addUser: (user: User) => void;
    deleteUser: (username: string) => void;
    addRequest: (request: Omit<RegistrationRequest, 'id' | 'status' | 'timestamp'>) => void;
    updateRequestStatus: (id: string, status: 'approved' | 'denied') => void;
    addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initial Mock Data
    const [users, setUsers] = useState<User[]>([
        {
            username: 'phravin',
            password: '2005',
            fullName: 'Phravin (Admin)',
            role: 'admin',
            mobile: '1234567890',
            email: 'admin@safesight.com'
        }
    ]);

    const [requests, setRequests] = useState<RegistrationRequest[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);

    // Load from localStorage on mount (optional for persistence)
    useEffect(() => {
        const storedUsers = localStorage.getItem('safesight_users');
        if (storedUsers) setUsers(JSON.parse(storedUsers));

        const storedRequests = localStorage.getItem('safesight_requests');
        if (storedRequests) setRequests(JSON.parse(storedRequests));
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('safesight_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('safesight_requests', JSON.stringify(requests));
    }, [requests]);

    const addUser = (user: User) => {
        setUsers(prev => [...prev, user]);
    };

    const deleteUser = (username: string) => {
        setUsers(prev => prev.filter(u => u.username !== username));
    };

    const addRequest = (requestData: Omit<RegistrationRequest, 'id' | 'status' | 'timestamp'>) => {
        const newRequest: RegistrationRequest = {
            ...requestData,
            id: Date.now().toString(),
            status: 'pending',
            timestamp: Date.now(),
        };
        setRequests(prev => [...prev, newRequest]);
    };

    const updateRequestStatus = (id: string, status: 'approved' | 'denied') => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));

        if (status === 'approved') {
            const request = requests.find(req => req.id === id);
            if (request) {
                addUser({
                    username: request.username,
                    password: request.password,
                    fullName: request.fullName,
                    photoUrl: request.photoUrl,
                    mobile: request.mobile,
                    email: request.email,
                    role: 'user'
                });
            }
        }
    };

    const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
        const newAlert: Alert = {
            ...alertData,
            id: Date.now().toString(),
            timestamp: Date.now(),
        };
        setAlerts(prev => [newAlert, ...prev]);
    };

    return (
        <DataContext.Provider value={{ users, requests, alerts, addUser, deleteUser, addRequest, updateRequestStatus, addAlert }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
