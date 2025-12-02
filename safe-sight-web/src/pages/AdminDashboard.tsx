import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, CheckCircle, XCircle, LogOut, Shield, Bell, Trash2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { users, requests, updateRequestStatus, addUser, deleteUser } = useData();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'users' | 'requests'>('requests');
    const [showAddUser, setShowAddUser] = useState(false);

    // Manual Add User State
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        mobile: '',
        role: 'user' as const
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({
            ...newUser,
            photoUrl: '' // Placeholder for manual add
        });
        setShowAddUser(false);
        setNewUser({ username: '', password: '', fullName: '', email: '', mobile: '', role: 'user' });
    };

    const pendingRequests = requests.filter(r => r.status === 'pending');

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Sidebar / Navigation */}
            <nav className="fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                        <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <span className="text-xl font-bold">SafeSight</span>
                </div>

                <div className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'requests'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5" />
                            <span>Requests</span>
                        </div>
                        {pendingRequests.length > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {pendingRequests.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        <span>All Users</span>
                    </button>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </nav>

            {/* Main Content */}
            <main className="md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {activeTab === 'requests' ? 'Registration Requests' : 'User Management'}
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {activeTab === 'requests'
                                ? 'Review and approve new user accounts'
                                : 'Manage registered users and security access'}
                        </p>
                    </div>

                    {activeTab === 'users' && (
                        <button
                            onClick={() => setShowAddUser(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add User
                        </button>
                    )}
                </header>

                {activeTab === 'requests' && (
                    <div className="grid gap-4">
                        {pendingRequests.length === 0 ? (
                            <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed">
                                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">No pending registration requests</p>
                            </div>
                        ) : (
                            pendingRequests.map(request => (
                                <div key={request.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-600">
                                        {request.photoUrl ? (
                                            <img src={request.photoUrl} alt={request.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="w-full h-full p-4 text-gray-500" />
                                        )}
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-lg font-bold text-white">{request.fullName}</h3>
                                        <p className="text-blue-400 text-sm">@{request.username}</p>
                                        <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start text-sm text-gray-400">
                                            <span>{request.email}</span>
                                            <span>•</span>
                                            <span>{request.mobile}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateRequestStatus(request.id, 'approved')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-lg transition-all border border-green-600/30"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => updateRequestStatus(request.id, 'denied')}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-600/30"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Deny
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">User</th>
                                        <th className="px-6 py-4 font-medium">Contact</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {users.map((user, idx) => (
                                        <tr key={idx} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                                        {user.photoUrl ? (
                                                            <img src={user.photoUrl} alt={user.username} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                                                {user.fullName[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{user.fullName}</div>
                                                        <div className="text-sm text-gray-500">@{user.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                <div>{user.email}</div>
                                                <div>{user.mobile}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 text-green-400 text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
                                                                deleteUser(user.username);
                                                            }
                                                        }}
                                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Add User Modal */}
            {showAddUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 outline-none"
                                value={newUser.fullName}
                                onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 outline-none"
                                value={newUser.username}
                                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 outline-none"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddUser(false)}
                                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
