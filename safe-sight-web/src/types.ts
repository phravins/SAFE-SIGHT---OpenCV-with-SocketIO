export interface User {
    username: string;
    password?: string; // In a real app, this would be hashed.
    fullName: string;
    photoUrl?: string; // Base64 or URL
    mobile: string;
    email: string;
    role: 'admin' | 'user';
}

export interface RegistrationRequest {
    id: string;
    username: string;
    password?: string;
    fullName: string;
    photoUrl?: string;
    mobile: string;
    email: string;
    status: 'pending' | 'approved' | 'denied';
    timestamp: number;
}

export interface Alert {
    id: string;
    type: 'unknown_person' | 'system';
    message: string;
    timestamp: number;
    imageUrl?: string; // Snapshot of the unknown person
}
