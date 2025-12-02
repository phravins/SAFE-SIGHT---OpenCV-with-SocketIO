import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Volume2, VolumeX, AlertTriangle, ShieldCheck, Smartphone, Mail } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

const Monitor: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const { alerts, addAlert } = useData();
    const navigate = useNavigate();

    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [simulationStatus, setSimulationStatus] = useState<'idle' | 'detecting' | 'alert'>('idle');
    const [lastNotification, setLastNotification] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const [lastRecognition, setLastRecognition] = useState<{ name: string; confidence: number; type: string } | null>(null);

    const videoRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const speak = (text: string) => {
        if (voiceEnabled && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    // WebSocket connection for face recognition events
    useEffect(() => {
        // Connect to Flask backend
        const socket = io('http://localhost:5000');
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[WebSocket] Connected to face recognition server');
            setConnectionStatus('connected');
        });

        socket.on('disconnect', () => {
            console.log('[WebSocket] Disconnected from server');
            setConnectionStatus('disconnected');
        });

        socket.on('face_detected', (data: { name: string; confidence: number; timestamp: string; type: string }) => {
            console.log('[Face Detection]', data);
            setLastRecognition(data);

            if (data.type === 'unknown') {
                // Unknown person detected
                setSimulationStatus('alert');
                const msg = "Unknown person detected at the door";

                addAlert({
                    type: 'unknown_person',
                    message: msg,
                    imageUrl: ''
                });

                speak(msg);
                setLastNotification("Alert sent to Mobile and Email!");

                // Clear alert status after 5 seconds
                setTimeout(() => {
                    setSimulationStatus('idle');
                    setLastNotification(null);
                }, 5000);
            } else if (data.type === 'known') {
                // Known person recognized
                setSimulationStatus('idle');
                const msg = `${data.name} detected at the door. Welcome!`;
                speak(msg);
                setLastNotification(`Welcome, ${data.name}!`);

                setTimeout(() => {
                    setLastNotification(null);
                }, 3000);
            }
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, [voiceEnabled, addAlert]);

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">SafeSight Monitor</h1>
                        <p className="text-xs text-gray-400">System Active • {currentUser?.fullName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className={`p-2 rounded-full transition-colors ${voiceEnabled ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                        title="Toggle Voice Over"
                    >
                        {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 flex flex-col md:flex-row gap-6 overflow-hidden">

                {/* Camera Feed Section */}
                <div className="flex-1 flex flex-col gap-4">
                    <div
                        ref={videoRef}
                        className={`relative flex-1 bg-gray-900 rounded-3xl overflow-hidden border shadow-2xl flex items-center justify-center group ${simulationStatus === 'alert' ? 'border-red-500 border-4 animate-pulse' : 'border-gray-800'
                            }`}
                    >
                        {/* Live Video Stream */}
                        {connectionStatus === 'connected' ? (
                            <img
                                src="http://localhost:5000/video_feed"
                                alt="Live Camera Feed"
                                className="w-full h-full object-cover"
                                onError={() => setConnectionStatus('disconnected')}
                            />
                        ) : (
                            <div className="text-center opacity-50">
                                <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto mb-4 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                                    <div className="w-3 h-3 bg-red-500 rounded-full relative"></div>
                                </div>
                                <p className="text-gray-400">
                                    {connectionStatus === 'connecting' ? 'Connecting to camera...' : 'Camera disconnected'}
                                </p>
                                <p className="text-xs text-gray-600 mt-2">
                                    {connectionStatus === 'disconnected' && 'Please start the Python server: python face_recognition_server.py'}
                                </p>
                            </div>
                        )}

                        {/* Notification Toast */}
                        {lastNotification && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur border border-gray-700 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-bounce z-30">
                                {simulationStatus === 'alert' ? (
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                ) : (
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                )}
                                <span className="text-sm font-medium">{lastNotification}</span>
                            </div>
                        )}

                        {/* Recognition Info Overlay */}
                        {lastRecognition && connectionStatus === 'connected' && (
                            <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur px-4 py-2 rounded-lg border border-gray-600">
                                <p className="text-white font-semibold">{lastRecognition.name}</p>
                                {lastRecognition.confidence > 0 && (
                                    <p className="text-gray-300 text-sm">Confidence: {lastRecognition.confidence}%</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Status Message */}
                    <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-center">
                        <p className="text-gray-400 text-sm">
                            {connectionStatus === 'connected'
                                ? '🟢 OpenCV facial recognition is active and monitoring'
                                : '🔴 Waiting for OpenCV server connection...'
                            }
                        </p>
                    </div>
                </div>

                {/* Sidebar: Alerts & Status */}
                <div className="w-full md:w-96 flex flex-col gap-6">
                    {/* System Status */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <h3 className="text-gray-400 text-sm uppercase font-bold mb-4">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Camera</span>
                                <span className={`text-sm flex items-center gap-2 ${connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                                    <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                                    {connectionStatus === 'connected' ? 'Active' : connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Face Recognition</span>
                                <span className={`text-sm ${connectionStatus === 'connected' ? 'text-green-400' : 'text-gray-500'}`}>
                                    {connectionStatus === 'connected' ? 'Active' : 'Waiting'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Voice Over</span>
                                <span className={voiceEnabled ? "text-green-400 text-sm" : "text-gray-500 text-sm"}>
                                    {voiceEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-gray-800 flex gap-2">
                                <div className="flex-1 bg-gray-800 p-3 rounded-xl flex flex-col items-center gap-2 text-center">
                                    <Smartphone className="w-5 h-5 text-blue-400" />
                                    <span className="text-xs text-gray-400">SMS Ready</span>
                                </div>
                                <div className="flex-1 bg-gray-800 p-3 rounded-xl flex flex-col items-center gap-2 text-center">
                                    <Mail className="w-5 h-5 text-purple-400" />
                                    <span className="text-xs text-gray-400">Email Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="flex-1 bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col overflow-hidden">
                        <h3 className="text-gray-400 text-sm uppercase font-bold mb-4 flex items-center justify-between">
                            Recent Alerts
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{alerts.length}</span>
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {alerts.length === 0 ? (
                                <div className="text-center text-gray-600 py-10">
                                    No alerts yet.
                                </div>
                            ) : (
                                alerts.map(alert => (
                                    <div key={alert.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex gap-4">
                                        <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 text-red-500">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white">Unknown Person Detected</h4>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                                            <p className="text-xs text-gray-500 mt-2">{alert.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Monitor;
