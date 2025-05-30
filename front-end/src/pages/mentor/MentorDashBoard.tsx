import React from 'react';
import { Calendar, Video, MessageSquare, Users, Star, Zap, User, Upload, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MentorDashBoard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto bg-[#1e2432] text-white rounded-lg shadow-xl p-6">
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

                        {/* Session 1 */}
                        <div className="border border-blue-500 rounded-lg p-4 mb-4 relative">
                            <div className="flex items-start">
                                <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                                    <Video className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">JavaScript Fundamentals</h3>
                                    <p className="text-sm text-gray-400">10:30 AM - 11:30 AM</p>
                                    <div className="flex items-center mt-1 text-sm text-gray-400">
                                        <User className="w-4 h-4 mr-1" />
                                        <span>Alex Johnson</span>
                                        <span className="mx-2">•</span>
                                        <Video className="w-4 h-4 mr-1" />
                                        <span>Video Call</span>
                                    </div>
                                    <div className="mt-3 flex space-x-2">
                                        <button className="bg-blue-500 text-white text-xs py-1 px-3 rounded">
                                            Join Now
                                        </button>
                                        <button className="bg-gray-600 text-white text-xs py-1 px-3 rounded">
                                            Session Materials
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-blue-500 text-xs py-1 px-2 rounded">
                                    Today
                                </div>
                            </div>
                            <div className="text-right mt-2 text-orange-400 text-sm">
                                Starts in: 1h 42m
                            </div>
                        </div>

                        {/* Session 2 */}
                        <div className="border border-gray-700 rounded-lg p-4 mb-4 relative">
                            <div className="flex items-start">
                                <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                                    <MessageSquare className="w-5 h-5 text-purple-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">Career Guidance Session</h3>
                                    <p className="text-sm text-gray-400">May 7 • 1:00 PM - 2:00 PM</p>
                                    <div className="flex items-center mt-1 text-sm text-gray-400">
                                        <User className="w-4 h-4 mr-1" />
                                        <span>Sophia Chen</span>
                                        <span className="mx-2">•</span>
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        <span>Chat Session</span>
                                    </div>
                                    <div className="mt-3 flex space-x-2">
                                        <button className="bg-gray-600 text-white text-xs py-1 px-3 rounded">
                                            Prepare Materials
                                        </button>
                                        <button className="bg-gray-600 text-white text-xs py-1 px-3 rounded">
                                            Message Learner
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right mt-2 text-gray-400 text-sm">
                                In 2 days
                            </div>
                        </div>

                        {/* Session 3 */}
                        <div className="border border-gray-700 rounded-lg p-4 relative">
                            <div className="flex items-start">
                                <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                                    <Users className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">Project Review</h3>
                                    <p className="text-sm text-gray-400">May 9 • 3:30 PM - 4:30 PM</p>
                                    <div className="flex items-center mt-1 text-sm text-gray-400">
                                        <User className="w-4 h-4 mr-1" />
                                        <span>James Wilson</span>
                                        <span className="mx-2">•</span>
                                        <Users className="w-4 h-4 mr-1" />
                                        <span>In-Person</span>
                                    </div>
                                    <div className="mt-3 flex space-x-2">
                                        <button className="bg-gray-600 text-white text-xs py-1 px-3 rounded">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right mt-2 text-gray-400 text-sm">
                                In 4 days
                            </div>
                        </div>
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

                        {/* Mentor Stats */}
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