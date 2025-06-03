import React from 'react';
import { Calendar, Video, MessageSquare, Users, Star, Zap, User, Upload, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MentorDashBoard: React.FC = () => {
    // Fake data for upcoming sessions
    const upcomingSessions = [
        {
            id: 1,
            title: "JavaScript Fundamentals",
            time: "10:30 AM - 11:30 AM",
            date: "Today",
            startsIn: "0h 29m",
            mentee: "Alex Johnson",
            type: "Video Call",
            typeIcon: <Video className="w-4 h-4 mr-1" />,
            sessionIcon: <Video className="w-5 h-5 text-blue-500" />,
            iconBg: "bg-blue-500/20",
            borderColor: "border-blue-500",
            isToday: true,
            actions: ["Join Now", "Session Materials"]
        },
        {
            id: 2,
            title: "Career Guidance Session",
            time: "1:00 PM - 2:00 PM",
            date: "May 7",
            startsIn: "In 2 days",
            mentee: "Sophia Chen",
            type: "Chat Session",
            typeIcon: <MessageSquare className="w-4 h-4 mr-1" />,
            sessionIcon: <MessageSquare className="w-5 h-5 text-purple-500" />,
            iconBg: "bg-purple-500/20",
            borderColor: "border-gray-700",
            isToday: false,
            actions: ["Prepare Materials", "Message Learner"]
        },
        {
            id: 3,
            title: "Project Review",
            time: "3:30 PM - 4:30 PM",
            date: "May 9",
            startsIn: "In 4 days",
            mentee: "James Wilson",
            type: "In-Person",
            typeIcon: <Users className="w-4 h-4 mr-1" />,
            sessionIcon: <Users className="w-5 h-5 text-green-500" />,
            iconBg: "bg-green-500/20",
            borderColor: "border-gray-700",
            isToday: false,
            actions: ["View Details"]
        },
        {
            id: 4,
            title: "React Advanced Concepts",
            time: "9:00 AM - 10:30 AM",
            date: "May 10",
            startsIn: "In 5 days",
            mentee: "Emma Roberts",
            type: "Video Call",
            typeIcon: <Video className="w-4 h-4 mr-1" />,
            sessionIcon: <Video className="w-5 h-5 text-indigo-500" />,
            iconBg: "bg-indigo-500/20",
            borderColor: "border-gray-700",
            isToday: false,
            actions: ["View Details", "Prepare Materials"]
        },
        {
            id: 5,
            title: "Code Review: Backend API",
            time: "2:00 PM - 3:00 PM",
            date: "May 12",
            startsIn: "In 7 days",
            mentee: "David Kim",
            type: "Screen Share",
            typeIcon: <MessageSquare className="w-4 h-4 mr-1" />,
            sessionIcon: <MessageSquare className="w-5 h-5 text-pink-500" />,
            iconBg: "bg-pink-500/20",
            borderColor: "border-gray-700",
            isToday: false,
            actions: ["Message Learner"]
        }
    ];

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
                            // Parse time more precisely
                            const isToday = session.isToday;
                            let timeValue = 0;
                            let timeUnit = "";
                            
                            // Extract numeric value and unit
                            if (session.startsIn.includes('h')) {
                                timeValue = parseInt(session.startsIn.split('h')[0], 10);
                                timeUnit = "hours";
                            } else if (session.startsIn.includes('m')) {
                                timeValue = parseInt(session.startsIn.split('m')[0].replace(/\D/g, ''), 10);
                                timeUnit = "minutes";
                            }
                            
                            // Define time thresholds
                            const isStartingSoon = isToday && timeUnit === "minutes" && timeValue < 30;
                            const isVeryClose = isToday && timeUnit === "minutes" && timeValue < 5;
                            
                            // Format display time
                            let displayTime = session.startsIn;
                            if (isVeryClose) {
                                // Convert to seconds for very close sessions
                                const secondsRemaining = timeValue * 60;
                                displayTime = `${secondsRemaining} seconds`;
                            }
                            
                            return (
                            <div 
                                key={session.id}
                                className={`border ${session.borderColor} rounded-lg p-4 mb-4 relative ${isStartingSoon ? 'border-orange-500 border-2' : ''}`}
                            >
                                <div className="flex items-start">
                                    <div className={`p-2 ${session.iconBg} rounded-lg mr-3`}>
                                        {session.sessionIcon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{session.title}</h3>
                                        <p className="text-sm text-gray-400">
                                            {session.date !== "Today" ? `${session.date} • ` : ''}{session.time}
                                        </p>
                                        <div className="flex items-center mt-1 text-sm text-gray-400">
                                            <User className="w-4 h-4 mr-1" />
                                            <span>{session.mentee}</span>
                                            <span className="mx-2">•</span>
                                            {session.typeIcon}
                                            <span>{session.type}</span>
                                        </div>
                                        <div className="mt-3 flex space-x-2">
                                            {session.actions.map((action, index) => (
                                                <button 
                                                    key={index}
                                                    className={`${
                                                        action === "Join Now" ? "bg-blue-500" : "bg-gray-600"
                                                    } text-white text-xs py-1 px-3 rounded`}
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {session.isToday && (
                                        <div className="absolute top-4 right-4 bg-blue-500 text-xs py-1 px-2 rounded">
                                            Today
                                        </div>
                                    )}
                                </div>
                                <div className={`text-right mt-2 ${
                                    isVeryClose ? "text-red-500 font-bold animate-pulse" : 
                                    isStartingSoon ? "text-orange-400 font-semibold" : 
                                    session.isToday ? "text-orange-400" : "text-gray-400"
                                } text-sm`}>
                                    {isVeryClose ? `Imminent: ${displayTime}` : 
                                     isStartingSoon ? `Starting soon: ${displayTime}` : displayTime}
                                </div>
                            </div>
                        )})}
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