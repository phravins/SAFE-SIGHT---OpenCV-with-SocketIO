import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ShieldCheck, Lock, User } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { users } = useData();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // First check if user exists and has admin role
            const user = users.find(u => u.username === username);

            if (!user) {
                setError('Invalid credentials');
                setLoading(false);
                return;
            }

            if (user.role !== 'admin') {
                setError('Access denied. Admin credentials required.');
                setLoading(false);
                return;
            }

            // Proceed with login
            const success = await login(username, password);
            if (success) {
                navigate('/admin/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-blue-600/20 rounded-full">
                            <ShieldCheck className="w-12 h-12 text-blue-400" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-white mb-2">SafeSight Admin</h2>
                    <p className="text-center text-gray-400 mb-8">Secure Access Portal</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
                                    placeholder="Enter admin username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </button>
                    </form>
                </div>

                <div className="px-8 py-4 bg-gray-900/50 border-t border-white/5 text-center">
                    <p className="text-xs text-gray-500">SafeSight Security Systems &copy; 2025</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
