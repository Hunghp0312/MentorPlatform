import React, { useEffect, useState } from 'react';
import { Calendar, Video, MessageSquare, Users, Zap, User, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SessionsResponse, UpcomingSession } from '../../types/session';
import { mentorDashboardService } from '../../services/mentorDashboard.service';
import LoadingOverlay from '../../components/loading/LoadingOverlay';
import { formatTime } from '../../utils/formatDate';
import { getUserFromToken } from '../../utils/auth';
import CourseTrackingPage from '../../components/feature/CourseTrackingDashboard';
import { pathName } from '../../constants/pathName';
import { CourseDashboardResponseType } from '../../types/course';


const MentorDashBoard: React.FC = () => {
    const decodedToken = getUserFromToken()
    const mentorId = decodedToken?.id;
    const [sessions, setSessions] = useState<SessionsResponse>({
        sessionKPIs: {
            sharedResources: 0,
            sessionsThisMonth: 0,
            lifetimeLearners : 0
        },
        upcomingSessions: []
    });
    const [course,setCourse] = useState<CourseDashboardResponseType>({
        courseKPIs : {
            averageCompletion: 0,
            totalCourses: 0,
            studentEnrollments: 0,
            publishedCourses: 0
        },
        courses: []
    })
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
            setLoading(true);
            const [sessionsRes, coursesRes] = await Promise.all([
                mentorDashboardService.getUpcommingSessions(),
                mentorDashboardService.getCourseOfMentor()
            ]);
            
            setSessions(sessionsRes);
            setCourse(coursesRes);
            } catch (error) {
            console.error("Error fetching dashboard data:", error);
            } finally {
            setLoading(false);
            }
        };
        
        fetchData();
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


    const formatSessionDisplayInfo = (session: UpcomingSession) => {
        // Combine date and time for accurate timestamp
        const combinedDateTime = `${session.date}T${session.slotStartTime}`;
        const sessionDate = new Date(combinedDateTime);
        const currentDate = new Date();

        // Check if the session is today
        const isToday = 
            sessionDate.getDate() === currentDate.getDate() &&
            sessionDate.getMonth() === currentDate.getMonth() &&
            sessionDate.getFullYear() === currentDate.getFullYear();

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
            displayTime = dateLeftToMeeting(session.date);
        }

        return { isToday, isStartingSoon, isVeryClose, displayTime };
    };
    const getSessionIcon = (type: string) => {
        switch (type) {
            case 'Virtual Session':
                return <Video className="w-5 h-5 text-blue-500 " />;
            case 'On-Site Session':
                return <MessageSquare className="w-5 h-5 text-purple-500 " />;
            case 'In-Person Session':
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
            case 'In-Person Session':
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
        <div className="min-h-screen p-4 bg-[#1e2432]">
            <div className="max-w-full mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Mentor Dashboard</h1>
                    <p className="text-gray-400">Welcome to your mentor dashboard</p>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#252d3d] rounded-lg shadow p-4 border border-[#2d3748]">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-400">Sessions This Month</p>
                                <p className="text-2xl font-bold text-white">{sessions.sessionKPIs.sessionsThisMonth}</p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-full">
                                <Calendar className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#252d3d] rounded-lg shadow p-4 border border-[#2d3748]">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-400">Resources Shared</p>
                                <p className="text-2xl font-bold text-white">{sessions.sessionKPIs.sharedResources}</p>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-full">
                                <Upload className="w-5 h-5 text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#252d3d] rounded-lg shadow p-4 border border-[#2d3748]">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-400">Lifetime Learners</p>
                                <p className="text-2xl font-bold text-white">{sessions.sessionKPIs.lifetimeLearners}</p>
                            </div>
                            <div className="p-3 bg-purple-500/20 rounded-full">
                                <Users className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 ">
                    {/* Upcoming Sessions */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#252d3d] rounded-lg shadow p-6 border border-[#2d3748] max-h-3/4 overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-white">Upcoming Sessions</h2>
                                <Link
                                    to={`${pathName.sessionManagement}`}
                                    className="text-blue-400 text-sm hover:underline flex items-center"
                                >
                                    Manage Schedule <span className="ml-1">→</span>
                                </Link>
                            </div>

                            {sessions.upcomingSessions.length > 0 ? (
                                <div className="space-y-4">
                                    {sessions.upcomingSessions.map(session => {
                                        const { isToday, isStartingSoon, isVeryClose, displayTime } = formatSessionDisplayInfo(session);

                                        const statusClass = isVeryClose ? "text-red-400 font-bold" :
                                            isStartingSoon ? "text-orange-400 font-semibold" :
                                                isToday ? "text-orange-400" : "text-gray-400";

                                        return (
                                            <div
                                                key={session.bookingId}
                                                className={`border rounded-lg p-4 relative ${isToday ? 'border-orange-500 border-2' : 'border-[#2d3748]'}`}
                                            >
                                                <div className="flex items-start">
                                                    <div className={`p-2 ${getColorOfSessionType(session.sessionTypeName)} rounded-lg mr-3`}>
                                                        {getSessionIcon(session.sessionTypeName)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-white">Meeting with {session.learnerFullName}</h3>
                                                        <div className="text-sm text-gray-400 mt-1">
                                                            <span>{formatTime(session.slotStartTime)}</span> -{' '}
                                                            <span>{formatTime(session.slotEndTime)}</span>
                                                        </div>
                                                        <div className="flex items-center mt-2 text-sm text-gray-400">
                                                            {getSessionIcon(session.sessionTypeName)}
                                                            <span className="ml-2">{session.sessionTypeName}</span>
                                                        </div>
                                                        <div className="mt-3 flex justify-between items-center">
                                                            {isToday && (
                                                                <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded">
                                                                    Join Now
                                                                </button>
                                                            )}
                                                            <div className={`text-right ${statusClass} text-sm`}>
                                                                {displayTime}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {isToday && (
                                                        <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs py-1 px-2 rounded">
                                                            Today
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No upcoming sessions scheduled.</p>

                                </div>
                            )}
                        </div>

                        {/* Course Tracking */}
                        <div className="bg-[#252d3d] rounded-lg shadow p-6 border border-[#2d3748]">
                            <h2 className="text-lg font-semibold text-white mb-4">Your Courses</h2>
                            <CourseTrackingPage courses={course} />
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-[#252d3d] rounded-lg shadow p-6 border border-[#2d3748]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-[#f47521] hover:bg-[#e06a1e] text-white py-2 px-4 rounded flex items-center" onClick={() => navigate(pathName.mentorAvailability)}>
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Set/Update Availability
                                </button>

                                <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2 px-4 rounded flex items-center" onClick={() => navigate(`${pathName.profile}/${mentorId}`)}>
                                    <User className="w-5 h-5 mr-2" />
                                    Edit Profile Information
                                </button>

                                <button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-2 px-4 rounded flex items-center" onClick={() => navigate(pathName.mentorResource)}>
                                    <Upload className="w-5 h-5 mr-2" />
                                    Upload New Resources
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorDashBoard;