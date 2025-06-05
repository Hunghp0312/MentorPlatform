import React from 'react';
import { Calendar, Video, MessageSquare, Users, Star, Zap, User, Upload, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Session {
    id: number;
    title: string;
    time: string;
    date: string;
    mentee: string;
    type: string;
    typeIcon: React.ReactNode;
    sessionIcon: React.ReactNode;
    iconBg: string;
    borderColor: string;
    actions: string[];
}
const MentorDashBoard: React.FC = () => {
    // Fake data for upcoming sessions
    const upcomingSessions = [
        {
            id: 1,
            title: "JavaScript Fundamentals",
            time: "10:30 PM - 11:30 PM",
            date: "2025-06-03",
            mentee: "Alex Johnson",
            type: "Video Call",
            typeIcon: <Video className="w-4 h-4 mr-1" />,
            sessionIcon: <Video className="w-5 h-5 text-blue-500" />,
            iconBg: "bg-blue-500/20",
            borderColor: "border-blue-500",
            actions: ["Join Now", "Session Materials"]
        },
        {
            id: 2,
            title: "Career Guidance Session",
            time: "1:00 PM - 2:00 PM",
            date: "2025-06-05",
            mentee: "Sophia Chen",
            type: "Chat Session",
            typeIcon: <MessageSquare className="w-4 h-4 mr-1" />,
            sessionIcon: <MessageSquare className="w-5 h-5 text-purple-500" />,
            iconBg: "bg-purple-500/20",
            borderColor: "border-gray-700",
            actions: ["Prepare Materials", "Message Learner"]
        },
        {
            id: 3,
            title: "Project Review",
            time: "3:30 PM - 4:30 PM",
            date: "2025-06-07",
            mentee: "James Wilson",
            type: "In-Person",
            typeIcon: <Users className="w-4 h-4 mr-1" />,
            sessionIcon: <Users className="w-5 h-5 text-green-500" />,
            iconBg: "bg-green-500/20",
            borderColor: "border-gray-700",
            actions: ["View Details"]
        },
        {
            id: 4,
            title: "React Advanced Concepts",
            time: "9:00 AM - 10:30 AM",
            date: "2025-06-10",
            mentee: "Emma Roberts",
            type: "Video Call",
            typeIcon: <Video className="w-4 h-4 mr-1" />,
            sessionIcon: <Video className="w-5 h-5 text-indigo-500" />,
            iconBg: "bg-indigo-500/20",
            borderColor: "border-gray-700",
            actions: ["View Details", "Prepare Materials"]
        },
        {
            id: 5,
            title: "Code Review: Backend API",
            time: "2:00 PM - 3:00 PM",
            date: "2025-06-12",
            mentee: "David Kim",
            type: "Screen Share",
            typeIcon: <MessageSquare className="w-4 h-4 mr-1" />,
            sessionIcon: <MessageSquare className="w-5 h-5 text-pink-500" />,
            iconBg: "bg-pink-500/20",
            borderColor: "border-gray-700",
            actions: ["Message Learner"]
        }
    ];

    // create a function to countdown the time left to meeting if it today and the time count below 10 minutes

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
        // Check if the session is today based on date
        const todayDate = new Date().toISOString().split('T')[0];
        const isToday = session.date === todayDate;

        // Parse the display time info
        let isStartingSoon = false;
        let isVeryClose = false;
        let displayTime = '';

        // Handle today's sessions
        if (isToday) {
            // Extract start time from session.time (format: "10:30 AM - 11:30 AM")
            const startTimeStr = session.time.split(' - ')[0];

            // Create a date object for the session start time today
            const startTime = new Date();
            const [timeStr, period] = startTimeStr.split(' ');
            const timeArray = timeStr.split(':').map(Number);
            let hours = timeArray[0];
            const minutes = timeArray[1];

            // Convert to 24-hour format
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            startTime.setHours(hours, minutes, 0, 0);

            // Get current time
            const currentTime = new Date();

            // Calculate difference in minutes
            const diffMs = startTime.getTime() - currentTime.getTime();
            const diffMinutes = Math.floor(diffMs / 60000);

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
            displayTime = dateLeftToMeeting(session.date);
        }

        return { isToday, isStartingSoon, isVeryClose, displayTime };
    };
    const getSessionIcon = (type: string) => {
        switch (type) {
            case 'Video Call':
                return <Video className="w-5 h-5 text-blue-500 " />;
            case 'Chat Session':
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
            case 'Video Call':
                return 'bg-blue-500/20';
            case 'Chat Session':
                return 'bg-purple-500/20';
            case 'In-Person':
                return 'bg-green-500/20';
            case 'Screen Share':
                return 'bg-pink-500/20';
            default:
                return 'bg-gray-500/20';
        }
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
                            <Link to="#" className="text-blue-400 text-sm hover:underline flex items-center">
                                Manage Schedule →
                            </Link>
                        </div>

                        {/* Dynamic Sessions */}
                        {upcomingSessions.map(session => {
                            const { isToday, isStartingSoon, isVeryClose, displayTime } = formatSessionDisplayInfo(session);

                            const statusClass = isVeryClose ? "text-red-500 font-bold " :
                                isStartingSoon ? "text-orange-400 font-semibold animate-pulse" :
                                    isToday ? "text-orange-400" : "text-gray-400 ";

                            const statusText = isVeryClose ? `Imminent: ${displayTime}` :
                                isStartingSoon ? `Starting soon: ${displayTime}` : displayTime;

                            return (
                                <div
                                    key={session.id}
                                    className={`border ${session.borderColor} rounded-lg p-4 mb-4 relative ${isStartingSoon ? 'border-orange-500 border-2' : ''}`}
                                >
                                    <div className="flex items-start">
                                        <div className={`p-2 ${getColorOfSessionType(session.type)} rounded-lg mr-3`}>
                                            {getSessionIcon(session.type)}

                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">Meeting with {session.mentee}</h3>
                                            <p className="text-sm text-gray-400 mt-2">
                                                {session.time}
                                            </p>
                                            <div className="flex items-center mt-1 text-sm text-gray-400">
                                                {session.typeIcon}
                                                <span>{session.type}</span>
                                            </div>
                                            <div className="mt-3 flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    {session.actions.map((action) => (
                                                        <button
                                                            key={`${session.id}-${action}`}
                                                            className={`${action === "Join Now" ? "bg-blue-500" : "bg-gray-600"
                                                                } text-white text-xs py-1 px-3 rounded`}
                                                        >
                                                            {action}
                                                        </button>
                                                    ))}
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
                        {upcomingSessions.length === 0 && (
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