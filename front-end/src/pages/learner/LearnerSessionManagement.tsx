import { useEffect, useState } from "react";
import CustomModal from "../../components/ui/Modal";
import { sessionService } from "../../services/session.service";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, Check, ChevronLeft, Clock, MessageSquare, Users, Video, X } from "lucide-react";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import DefaultImage from '../../assets/Profile_avatar_placeholder_large.png'
import { formatTime } from "../../utils/formatDate";

interface BookingSessionResponse {
    bookingId: string;
    learnerId: string;
    learnerPhotoData: string;
    mentorPhotoData: string;
    learnerFullName: string;
    mentorId: string;
    mentorFullName: string;
    availabilityTimeSlotId: string;
    date: string;
    slotStartTime: string;
    slotEndTime: string;
    learnerMessage: string;
    statusName: string;
    sessionTypeName: string;
    bookingRequestedAt: string;
}

const LearnerSessionManagement = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'pending' | 'recent' | 'inpast'>('pending');
    const [showDeclineModal, setShowDeclineModal] = useState<string | null>(null);
    const [declineMessage, setDeclineMessage] = useState<string>('');
    const [sessionRequests, setSessionRequests] = useState<BookingSessionResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchSessionRequests = async () => {
        try {
            setLoading(true);
            const response = await sessionService.getAllBookingSessions(null, null, null, 1, 100, null);
            setSessionRequests(response.items);
        } catch (error) {
            console.error('Error fetching session requests:', error);
            toast.error('Failed to load session requests. Please try again later.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {


        fetchSessionRequests();
    }, [id])
    const getSessionIcon = (type: string) => {
        switch (type) {
            case 'Virtual Session':
                return <Video className="w-5 h-5 text-blue-500" />;
            case 'On-Site Session':
                return <MessageSquare className="w-5 h-5 text-purple-500" />;
            case 'In-Person Session':
                return <Users className="w-5 h-5 text-green-500" />;
            default:
                return <Video className="w-5 h-5 text-blue-500" />;
        }
    };

    const getSessionTypeColor = (type: string) => {
        switch (type) {
            case 'Virtual Session':
                return 'bg-blue-500/20';
            case 'On-Site Session':
                return 'bg-purple-500/20';
            case 'In-Person Session':
                return 'bg-green-500/20';
            default:
                return 'bg-blue-500/20';
        }
    };

    const handleAcceptSession = async (sessionId: string) => {
        console.log('Accepting session:', sessionId);
        //call api to accept session
        try {
            await sessionService.updateStatusBookingSession(sessionId, 6);
            toast.success('Session accepted successfully!');
            fetchSessionRequests();
        }
        catch (error) {
            console.error('Error accepting session:', error);
            toast.error('Failed to accept session. Please try again.');
        }

    };

    const handleDeclineSession = (sessionId: string) => {
        setShowDeclineModal(sessionId);
    }

    const confirmDecline = async () => {
        if (!showDeclineModal) return;

        try {
            await sessionService.updateStatusBookingSession(showDeclineModal, 5);
            toast.success('Session declined successfully!');
            fetchSessionRequests();
        }
        catch (error) {
            console.error('Error declining session:', error);
            toast.error('Failed to decline session. Please try again.');
        }
        finally {
            setShowDeclineModal(null);
            setDeclineMessage('');
        }
    };




    const getDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error parsing date:', error);
            return dateString;
        }
    }


    const pendingRequests = sessionRequests.filter(req => req.statusName === 'Pending');
    const recentRequests = sessionRequests.filter(req => req.statusName === "Scheduled" || req.statusName === "Rescheduled");
    const inPastRequests = sessionRequests.filter(req => req.statusName === 'Completed' || req.statusName === 'Cancelled' || req.statusName === 'Declined');
    if (loading) {
        return <LoadingOverlay />
    }
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
                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-[#252d3d] rounded-lg p-1">
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'pending'
                            ? 'bg-[#f47521] text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Requests
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'recent'
                            ? 'bg-[#f47521] text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('recent')}
                    >
                        Upcoming Sessions
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'inpast'
                            ? 'bg-[#f47521] text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('inpast')}
                    >
                        In Past
                    </button>
                </div>

                {/* Session Requests */}
                <div className="space-y-4">
                    {activeTab === 'pending' && pendingRequests.map((request) => (
                        <div key={request.bookingId} className="bg-[#252d3d] rounded-lg p-6 border border-orange-500/30">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <img
                                        src={request.mentorPhotoData || DefaultImage}
                                        alt={request.learnerFullName}
                                        className="w-12 h-12 rounded-full"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold">{request.mentorFullName}</h3>
                                            <div className={`p-2 rounded-lg ${getSessionTypeColor(request.sessionTypeName)}`}>
                                                {getSessionIcon(request.sessionTypeName)}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {request.date}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {`${formatTime(request.slotStartTime)} - ${formatTime(request.slotEndTime)}`}
                                            </span>
                                            <span className="capitalize">{request.sessionTypeName}</span>
                                        </div>

                                        <p className="text-gray-300 mb-4">{request.learnerMessage}</p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Requested {getDate(request.bookingRequestedAt)}</span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'recent' && recentRequests.map((request) => (
                        <div key={request.bookingId} className="bg-[#252d3d] rounded-lg p-6 opacity-75">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <img
                                        src={request.mentorPhotoData || DefaultImage}
                                        alt={request.learnerFullName}
                                        className="w-12 h-12 rounded-full"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold">{request.mentorFullName}</h3>
                                            <div className={`p-2 rounded-lg ${getSessionTypeColor(request.sessionTypeName)}`}>
                                                {getSessionIcon(request.sessionTypeName)}
                                            </div>
                                            {(() => {
                                                const statusStyle = request.statusName === 'Scheduled' ? 'bg-green-500/20 text-green-400' :
                                                    request.statusName === 'Rescheduled' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-red-500/20 text-red-400';
                                                return (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
                                                        {request.statusName.charAt(0).toUpperCase() + request.statusName.slice(1)}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        <p className="text-gray-300 mb-4">{request.learnerMessage}</p>

                                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {request.date}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {`${formatTime(request.slotStartTime)} - ${formatTime(request.slotEndTime)}`}
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center mb-4'>

                                            <span className="text-xs text-gray-500">Requested {getDate(request.bookingRequestedAt)}</span>
                                            {request.statusName === 'Rescheduled' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleAcceptSession(request.bookingId)}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center"
                                                    >
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeclineSession(request.bookingId)}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg flex items-center"
                                                    >
                                                        <X className="w-4 h-4 mr-1" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'inpast' && inPastRequests.map((request) => (
                        <div key={request.bookingId} className="bg-[#252d3d] rounded-lg p-6 opacity-75">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <img
                                        src={request.mentorPhotoData || DefaultImage}
                                        alt={request.learnerFullName}
                                        className="w-12 h-12 rounded-full"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold">{request.mentorFullName}</h3>
                                            <div className={`p-2 rounded-lg ${getSessionTypeColor(request.sessionTypeName)}`}>
                                                {getSessionIcon(request.sessionTypeName)}
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.statusName === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                                request.statusName === 'rescheduled' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {request.statusName.charAt(0).toUpperCase() + request.statusName.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-4">{request.learnerMessage}</p>

                                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">

                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {request.date}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {`${formatTime(request.slotStartTime)} - ${formatTime(request.slotEndTime)}`}
                                            </span>
                                        </div>

                                        <span className="text-xs text-gray-500">Requested {getDate(request.bookingRequestedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                <CustomModal
                    isOpen={!!showDeclineModal}
                    onClose={() => setShowDeclineModal(null)}
                    title="Decline Session"
                    size="md"
                >
                    <div >
                        <p className="text-gray-300 mb-4">Please provide a reason for declining this session request.</p>

                        <textarea
                            className="w-full p-3 bg-[#1e2432] border border-gray-600 rounded-lg text-white mb-4 min-h-[120px]"
                            placeholder="Enter your message here..."
                            value={declineMessage}
                            onChange={(e) => setDeclineMessage(e.target.value)}
                        />

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeclineModal(null)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDecline}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Decline
                            </button>
                        </div>
                    </div>
                </CustomModal>

            </div>
        </div>
    );
}

export default LearnerSessionManagement