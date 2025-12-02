import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User as UserIcon, Lock, Mail, Phone, Camera, ArrowRight, ArrowLeft } from 'lucide-react';

const UserLogin: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [photoUrl, setPhotoUrl] = useState<string>('');

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { addRequest, users } = useData();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Check if user exists and their role
            const user = users.find(u => u.username === username);

            if (!user) {
                setError('Invalid credentials or account not approved yet.');
                setLoading(false);
                return;
            }

            if (user.role === 'admin') {
                setError('Admin users must login through Admin Portal.');
                setLoading(false);
                return;
            }

            // Proceed with login
            const success = await login(username, password);
            if (success) {
                navigate('/monitor');
            } else {
                setError('Invalid credentials or account not approved yet.');
            }
        } catch (err) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        if (!photoUrl) {
            setError('Please upload a profile photo for security verification.');
            setLoading(false);
            return;
        }

        try {
            addRequest({
                username,
                password,
                fullName,
                email,
                mobile,
                photoUrl
            });
            setSuccessMsg('Registration request sent to Admin. Please wait for approval.');
            setIsLogin(true);
            // Reset form
            setUsername('');
            setPassword('');
            setFullName('');
            setEmail('');
            setMobile('');
            setPhotoUrl('');
        } catch (err) {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md z-10 relative">
                <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-0 text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            SafeSight
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {isLogin ? 'Welcome Back' : 'Create Your Account'}
                        </p>
                    </div>

                    <div className="p-8">
                        {successMsg && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center animate-pulse">
                                {successMsg}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {isLogin ? (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all outline-none"
                                            placeholder="Username"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all outline-none"
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-blue-500 text-white outline-none text-sm"
                                            placeholder="Username"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-blue-500 text-white outline-none text-sm"
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-blue-500 text-white outline-none text-sm"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-blue-500 text-white outline-none text-sm"
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-blue-500 text-white outline-none text-sm"
                                        placeholder="Mobile Number"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs text-gray-400 ml-1">Profile Photo (Required for Recognition)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 bg-gray-800 rounded-full overflow-hidden border border-gray-700 flex-shrink-0">
                                            {photoUrl ? (
                                                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-gray-600" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? 'Submitting...' : 'Create Account'}
                                </button>
                            </form>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                    setSuccessMsg('');
                                }}
                                className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                            >
                                {isLogin ? (
                                    <>Don't have an account? <span className="text-blue-400">Register now</span></>
                                ) : (
                                    <><ArrowLeft className="w-4 h-4" /> Back to Login</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
