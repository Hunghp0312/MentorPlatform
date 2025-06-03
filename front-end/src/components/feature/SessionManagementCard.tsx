import React, { useState } from 'react';
import { Calendar, Video, MessageSquare, Users, Clock, User, Check, X, RotateCcw, ChevronLeft, AlertCircle } from 'lucide-react';
import RescheduleDialog from '../dialog/RescheduleDialog';

interface SessionRequest {
    id: string;
    title: string;
    learnerName: string;
    learnerAvatar: string;
    requestedDate: string;
    requestedTime: string;
    sessionType: 'video' | 'chat' | 'in-person';
    duration: string;
    description: string;
    status: 'pending' | 'accepted' | 'rescheduled' | 'declined';
    requestedAt: string;
}

const SessionManagementCard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'recent'| 'inpast'>('pending');
    const [showRescheduleModal, setShowRescheduleModal] = useState<string | null>(null);
    const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([
        {
            id: '1',
            title: 'React Hooks Deep Dive',
            learnerName: 'Sarah Martinez',
            learnerAvatar: '/placeholder.svg?height=40&width=40',
            requestedDate: 'May 15, 2024',
            requestedTime: '2:00 PM - 3:00 PM',
            sessionType: 'video',
            duration: '60 minutes',
            description: 'I would like to learn more about advanced React hooks patterns and custom hooks implementation.',
            status: 'pending',
            requestedAt: '2 hours ago'
        },
        {
            id: '2',
            title: 'Career Transition Guidance',
            learnerName: 'Michael Chen',
            learnerAvatar: '/placeholder.svg?height=40&width=40',
            requestedDate: 'May 16, 2024',
            requestedTime: '10:00 AM - 11:00 AM',
            sessionType: 'chat',
            duration: '60 minutes',
            description: 'Looking for advice on transitioning from backend to full-stack development.',
            status: 'pending',
            requestedAt: '4 hours ago'
        },
        {
            id: '3',
            title: 'Code Review Session',
            learnerName: 'Emily Rodriguez',
            learnerAvatar: '/placeholder.svg?height=40&width=40',
            requestedDate: 'May 17, 2024',
            requestedTime: '4:00 PM - 5:00 PM',
            sessionType: 'in-person',
            duration: '60 minutes',
            description: 'Need help reviewing my portfolio project and getting feedback on code quality.',
            status: 'pending',
            requestedAt: '1 day ago'
        },
        {
            id: '4',
            title: 'JavaScript Fundamentals',
            learnerName: 'David Kim',
            learnerAvatar: '/placeholder.svg?height=40&width=40',
            requestedDate: 'May 14, 2024',
            requestedTime: '11:00 AM - 12:00 PM',
            sessionType: 'video',
            duration: '60 minutes',
            description: 'Basic JavaScript concepts and ES6 features.',
            status: 'accepted',
            requestedAt: '2 days ago'
        }
    ]);

    const getSessionIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Video className="w-5 h-5 text-blue-500" />;
            case 'chat':
                return <MessageSquare className="w-5 h-5 text-purple-500" />;
            case 'in-person':
                return <Users className="w-5 h-5 text-green-500" />;
            default:
                return <Video className="w-5 h-5 text-blue-500" />;
        }
    };

    const getSessionTypeColor = (type: string) => {
        switch (type) {
            case 'video':
                return 'bg-blue-500/20';
            case 'chat':
                return 'bg-purple-500/20';
            case 'in-person':
                return 'bg-green-500/20';
            default:
                return 'bg-blue-500/20';
        }
    };

    const handleAcceptSession = (sessionId: string) => {
        setSessionRequests(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? { ...session, status: 'accepted' }
                    : session
            )
        );
    };

    const handleDeclineSession = (sessionId: string) => {
        setSessionRequests(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? { ...session, status: 'declined' }
                    : session
            )
        );
    };

    const handleRescheduleSession = (sessionId: string) => {
        setShowRescheduleModal(sessionId);
    };

    const confirmReschedule = (sessionId: string) => {
        setSessionRequests(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? { ...session, status: 'rescheduled' }
                    : session
            )
        );
        setShowRescheduleModal(null);
    };

    const pendingRequests = sessionRequests.filter(req => req.status === 'pending');
    const recentRequests = sessionRequests.filter(req => req.status !== 'pending');

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto bg-[#1e2432] text-white rounded-lg shadow-xl p-6">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button className="mr-4 p-2 hover:bg-gray-700 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Session Management</h1>
                        <p className="text-gray-400">Review and manage incoming session requests</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#252d3d] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Pending Requests</p>
                                <p className="text-2xl font-bold text-orange-400">{pendingRequests.length}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-orange-400" />
                        </div>
                    </div>

                    <div className="bg-[#252d3d] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Accepted Today</p>
                                <p className="text-2xl font-bold text-green-400">2</p>
                            </div>
                            <Check className="w-8 h-8 text-green-400" />
                        </div>
                    </div>

                    <div className="bg-[#252d3d] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Rescheduled</p>
                                <p className="text-2xl font-bold text-blue-400">1</p>
                            </div>
                            <RotateCcw className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>

                    
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-[#252d3d] rounded-lg p-1">
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'pending'
                                ? 'bg-[#f47521] text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Requests ({pendingRequests.length})
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'recent'
                                ? 'bg-[#f47521] text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('recent')}
                    >
                        Recent Activity ({recentRequests.length})
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'inpast'
                                ? 'bg-[#f47521] text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('inpast')}
                    >
                        In Past ({recentRequests.length})
                    </button>
                </div>

                {/* Session Requests */}
                <div className="space-y-4">
                    {activeTab === 'pending' && pendingRequests.map((request) => (
                        <div key={request.id} className="bg-[#252d3d] rounded-lg p-6 border border-orange-500/30">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <img
                                        src={request.learnerAvatar || "/placeholder.svg"}
                                        alt={request.learnerName}
                                        className="w-12 h-12 rounded-full"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold">{request.title}</h3>
                                            <div className={`p-2 rounded-lg ${getSessionTypeColor(request.sessionType)}`}>
                                                {getSessionIcon(request.sessionType)}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                                            <span className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                {request.learnerName}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {request.requestedDate}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {request.requestedTime}
                                            </span>
                                            <span className="capitalize">{request.sessionType} session</span>
                                        </div>

                                        <p className="text-gray-300 mb-4">{request.description}</p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Requested {request.requestedAt}</span>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleDeclineSession(request.id)}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg flex items-center"
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    Decline
                                                </button>

                                                <button
                                                    onClick={() => handleRescheduleSession(request.id)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center"
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-1" />
                                                    Reschedule
                                                </button>

                                                <button
                                                    onClick={() => handleAcceptSession(request.id)}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center"
                                                >
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Accept
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'recent' && recentRequests.map((request) => (
                        <div key={request.id} className="bg-[#252d3d] rounded-lg p-6 opacity-75">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <img
                                        src={request.learnerAvatar || "/placeholder.svg"}
                                        alt={request.learnerName}
                                        className="w-12 h-12 rounded-full"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold">{request.title}</h3>
                                            <div className={`p-2 rounded-lg ${getSessionTypeColor(request.sessionType)}`}>
                                                {getSessionIcon(request.sessionType)}
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                    request.status === 'rescheduled' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                                            <span className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                {request.learnerName}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {request.requestedDate}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {request.requestedTime}
                                            </span>
                                        </div>

                                        <span className="text-xs text-gray-500">Requested {request.requestedAt}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'inpast' && recentRequests.map((request) => (
                        <div key={request.id} className="bg-[#252d3d] rounded-lg p-6 opacity-75">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <img
                                        src={request.learnerAvatar || "/placeholder.svg"}
                                        alt={request.learnerName}
                                        className="w-12 h-12 rounded-full"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold">{request.title}</h3>
                                            <div className={`p-2 rounded-lg ${getSessionTypeColor(request.sessionType)}`}>
                                                {getSessionIcon(request.sessionType)}
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                    request.status === 'rescheduled' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                                            <span className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                {request.learnerName}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {request.requestedDate}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {request.requestedTime}
                                            </span>
                                        </div>

                                        <span className="text-xs text-gray-500">Requested {request.requestedAt}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reschedule Modal */}
                {showRescheduleModal && (
                    <RescheduleDialog 
                        onClose={() => setShowRescheduleModal(null)}
                        onConfirm={() => confirmReschedule(showRescheduleModal)}
                        sessionId={showRescheduleModal}
                    />
                )}
            </div>
        </div>
    );
};

export default SessionManagementCard;