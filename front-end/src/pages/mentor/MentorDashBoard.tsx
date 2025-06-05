import React, { useEffect, useState } from 'react';
import { Calendar, Video, MessageSquare, Users, Star, Zap, User, Upload, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Session } from '../../types/session';
import { mentorDashboardService } from '../../services/mentorDashboard.service';
import LoadingOverlay from '../../components/loading/LoadingOverlay';
import { formatTime } from '../../utils/formatDate';
import { getUserFromToken } from '../../utils/auth';


const MentorDashBoard: React.FC = () => {
    const decodedToken = getUserFromToken()
    const mentorId = decodedToken?.id;
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                const res = await mentorDashboardService.getUpcommingSessions();
                setSessions(res.items);
            }
            catch (error) {
                console.error("Error fetching sessions:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSessions();
    }, [])

    const dateLeftToMeeting = (date: string) => {
        // Check if the date is today
        const currentDate = new Date();
        const meetingDate = new Date(date);

        // Compare if it's the same day
        const isSameDay =
            meetingDate.getDate() === currentDate.getDate() &&
            meetingDate.getMonth() === currentDate.getMonth() &&
            meetingDate.getFullYear() === currentDate.getFullYear();

        if (isSameDay) {
            return "Today";
        }

        // Calculate difference in days
        const msPerDay = 24 * 60 * 60 * 1000;
        const daysLeft = Math.ceil((meetingDate.getTime() - currentDate.getTime()) / msPerDay);

        return `In ${daysLeft} Day${daysLeft === 1 ? '' : 's'}`;
    }


    const formatSessionDisplayInfo = (session: Session) => {
        // Parse dates
        const sessionDate = new Date(session.slotStartTime);
        const sessionDay = new Date(session.bookingDay);
        const currentDate = new Date();

        // Check if the session is today using bookingDay
        const isToday = sessionDay.toDateString() === currentDate.toDateString();

        // Initialize status flags
        let isStartingSoon = false;
        let isVeryClose = false;
        let displayTime = '';

        // Calculate time difference in minutes
        const diffMs = sessionDate.getTime() - currentDate.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);

        if (isToday) {
            if (diffMinutes < 0) {
                // Session has already started
                displayTime = `Started ${Math.abs(diffMinutes)} min ago`;
            } else if (diffMinutes < 60) {
                // Less than an hour left
                isStartingSoon = diffMinutes < 30;
                isVeryClose = diffMinutes < 5;
                displayTime = `In ${diffMinutes} min`;
            } else {
                // More than an hour left
                const hours = Math.floor(diffMinutes / 60);
                const mins = diffMinutes % 60;
                displayTime = `In ${hours}h ${mins}m`;
            }
        } else {
            // Use dateLeftToMeeting for non-today sessions
            displayTime = dateLeftToMeeting(session.bookingDay);
        }

        return { isToday, isStartingSoon, isVeryClose, displayTime };
    };
    const getSessionIcon = (type: string) => {
        switch (type) {
            case 'Virtual Session':
                return <Video className="w-5 h-5 text-blue-500 " />;
            case 'On-Site Session':
                return <MessageSquare className="w-5 h-5 text-purple-500 " />;
            case 'In-Person':
                return <Users className="w-5 h-5 text-green-500 " />;
            case 'Screen Share':
                return <MessageSquare className="w-5 h-5 text-pink-500 " />;
            default:
                return <Users className="w-5 h-5 text-gray-500 " />;
        }
    }
    const getColorOfSessionType = (type: string) => {
        switch (type) {
            case 'Virtual Session':
                return 'bg-blue-500/20';
            case 'On-Site Session':
                return 'bg-purple-500/20';
            case 'In-Person':
                return 'bg-green-500/20';
            case 'Screen Share':
                return 'bg-pink-500/20';
            default:
                return 'bg-gray-500/20';
        }
    }

    if (loading) {
        return <LoadingOverlay />
    }

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto bg-[#1e2432] text-white rounded-lg shadow-xl p-6">
                <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
                <p className="text-gray-400 mb-6">Welcome to your mentor dashboard. Navigate using the sidebar.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming Sessions Section */}
                    <div className="lg:col-span-2 bg-[#252d3d] rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
                            <Link to={`/session-management/${mentorId}`}  className="text-blue-400 text-sm hover:underline flex items-center">
                                Manage Schedule →
                            </Link>
                        </div>

                        {/* Dynamic Sessions */}
                        {sessions.map(session => {
                            const { isToday, isStartingSoon, isVeryClose, displayTime } = formatSessionDisplayInfo(session);

                            const statusClass = isVeryClose ? "text-red-500 font-bold " :
                                isStartingSoon ? "text-orange-400 font-semibold animate-pulse" :
                                    isToday ? "text-orange-400" : "text-gray-400 ";

                            const statusText = isVeryClose ? `Imminent: ${displayTime}` :
                                isStartingSoon ? `Starting soon: ${displayTime}` : displayTime;

                            return (
                                <div
                                    key={session.learnerId}
                                    className={`border border-blue-500 rounded-lg p-4 mb-4 relative ${isToday ? 'border-orange-500 border-2' : ''}`}
                                >
                                    <div className="flex items-start">
                                        <div className={`p-2 ${getColorOfSessionType(session.sessionType.name)} rounded-lg mr-3`}>
                                            {getSessionIcon(session.sessionType.name)}

                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">Meeting with {session.fullName}</h3>
                                            <div className="text-sm text-gray-400">
                                                <span className="font-semibold">{formatTime(new Date(session.slotStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</span> -
                                                <span className="ml-1">{formatTime(new Date(session.slotEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</span>
                                            </div>
                                            <div className="flex items-center mt-1 text-sm text-gray-400">
                                                {getSessionIcon(session.sessionType.name)}
                                                <span className='ml-2'>{session.sessionType.name}</span>
                                            </div>
                                            <div className="mt-3 flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    {isStartingSoon && (
                                                        <button
                                                            className={`bg-blue-500 text-white text-xs py-1 px-3 rounded`}
                                                        >
                                                            Join Now
                                                        </button>
                                                    )}
                                                </div>
                                                <div className={`text-right ${statusClass} text-sm animate-pulse`}>
                                                    {statusText}
                                                </div>
                                            </div>
                                        </div>
                                        {isToday && (
                                            <div className="absolute top-4 right-4 bg-blue-500 text-xs py-1 px-2 rounded">
                                                Today
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )
                        })}
                        {sessions.length === 0 && (
                            <p className="text-gray-400 text-center">No upcoming sessions scheduled.</p>
                        )}
                    </div>

                    {/* Quick Actions and Stats */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-[#252d3d] rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Quick Actions</h2>
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-[#f47521] hover:bg-[#e06a1e] text-white py-3 px-4 rounded flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Set/Update Availability
                                </button>

                                <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3 px-4 rounded flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Edit Profile Information
                                </button>

                                <button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-3 px-4 rounded flex items-center">
                                    <Upload className="w-5 h-5 mr-2" />
                                    Upload New Resources
                                </button>

                                <button className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 px-4 rounded flex items-center">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Message Learners
                                </button>
                            </div>
                        </div>

                        {/* Rest of the component remains the same */}
                        <div className="bg-[#252d3d] rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-4">Your Mentor Stats</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Sessions This Month:</span>
                                    <span className="font-semibold">8</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Average Rating:</span>
                                    <div className="flex items-center">
                                        <span className="font-semibold mr-1">5.0</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Resources Shared:</span>
                                    <span className="font-semibold">23</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Active Learners:</span>
                                    <span className="font-semibold">9</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorDashBoard;