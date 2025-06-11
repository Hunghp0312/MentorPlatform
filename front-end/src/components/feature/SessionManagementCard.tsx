import React, { useEffect, useState } from 'react';
import { Calendar, Video, MessageSquare, Users, Clock, Check, X, RotateCcw, Search } from 'lucide-react';
import RescheduleDialog from '../dialog/RescheduleDialog';
import { sessionService } from '../../services/session.service';
import { toast } from 'react-toastify';
import DefaultImage from '../../assets/Profile_avatar_placeholder_large.png'
import CustomModal from '../ui/Modal';
import { formatTime } from '../../utils/formatDate';
import LoadingOverlay from '../loading/LoadingOverlay';
import { BookingSessionResponse } from '../../types/session';
import useDebounce from '../../hooks/usedebounce';
import TableFooter from '../table/TableFooter';



const SessionManagementCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'recent' | 'inpast'>('pending');
  const [showRescheduleModal, setShowRescheduleModal] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [cancelMessage, setCancelMessage] = useState<string>('');
  const [cancelMessageError, setCancelMessageError] = useState<string>('');
  const [sessionRequests, setSessionRequests] = useState<BookingSessionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusIds, setStatusIds] = useState<number[] | null>([1]);
  const search = useDebounce(searchQuery, 500);
  const fetchSessionRequests = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getAllBookingSessions(null, null, statusIds, pageIndex, pageSize, search);
      setSessionRequests(response.items);
      setTotalItems(response.totalItems);
      setPageSize(response.pageSize);
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
  }, [pageIndex, pageSize, search, statusIds]);

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
    try {
      setLoading(true);
      await sessionService.updateStatusBookingSession(sessionId, 6);
      toast.success('Session accepted successfully!');
      fetchSessionRequests();
    }
    catch (error) {
      console.error('Error accepting session:', error);
      toast.error('Failed to accept session. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  const handleDeclineSession = async (sessionId: string) => {
    try {
      setLoading(true);
      await sessionService.updateStatusBookingSession(sessionId, 3);
      toast.success('Session declined successfully!');
      fetchSessionRequests();
    }
    catch (error) {
      console.error('Error accepting session:', error);
      toast.error('Failed to declined session. Please try again.');
    }
    finally {
      setLoading(false);
    }

  }



  const confirmCancel = async () => {
    if (cancelMessage.trim().length == 0) {
      toast.error("When cancel need to provide reason.")
      return;
    }

    try {
      setLoading(true);
      await sessionService.updateStatusBookingSession(showCancelModal as string, 5, cancelMessage);
      toast.success('Session cancel successfully!');
      fetchSessionRequests();
    }
    catch (error) {
      console.error('Error declining session:', error);
      toast.error('Failed to cancel session. Please try again.');
    }
    finally {
      setLoading(false);
      setShowCancelModal(null);
      setCancelMessage('');
    }
  }

  const handleRescheduleSession = (sessionId: string) => {
    setShowRescheduleModal(sessionId);
  };

  const confirmReschedule = async () => {
    fetchSessionRequests();
    setShowRescheduleModal(null);
  };

  const handleCancelSession = (sessionId: string) => {
    setShowCancelModal(sessionId);
  }

  const handleCompletedSession = async (sessionId: string) => {
    try {
      setLoading(true);
      await sessionService.updateStatusBookingSession(sessionId, 4);
      toast.success('Session complete successfully!');
      fetchSessionRequests();
    }
    catch (error) {
      console.error('Error accepting session:', error);
      toast.error('Failed to complete session. Please try again.');
    }
    finally {
      setLoading(false);
    }
  }

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

  const handleCancelMessageChange = (e: string) => {
    if (e.length > 1000) {
      setCancelMessageError('Message cannot exceed 1000 characters');
    } else {
      setCancelMessage(e);
      setCancelMessageError('');
    }
  }

  const recentRequests = sessionRequests
    .filter(req => req.statusName === "Scheduled" || req.statusName === "Rescheduled")
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (dateA === dateB) {
        // If same day, compare by slot start time
        const timeA = new Date(`1970-01-01T${a.slotStartTime}`).getTime();
        const timeB = new Date(`1970-01-01T${b.slotStartTime}`).getTime();
        return timeA - timeB;
      }

      return dateA - dateB;
    });

  if (loading) {
    return <LoadingOverlay />
  }

  return (
    <div className="min-h-screen p-4" data-testid="session-management-container">
      <div className="max-w-6xl mx-auto bg-[#1e2432] text-white rounded-lg shadow-xl p-6" data-testid="session-management-card">
        {/* Header */}
        <div className="flex items-center mb-6" data-testid="header-section">
          <div>
            <h1 className="text-2xl font-bold" data-testid="page-title">Session Management</h1>
            <p className="text-gray-400" data-testid="page-description">Review and manage incoming session requests</p>
          </div>
        </div>
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <input
              autoFocus
              type="text"
              placeholder="Search by learner name "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPageIndex(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-[#252d3d] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              data-testid="search-input"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-[#252d3d] rounded-lg p-1" data-testid="tabs-container">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'pending'
              ? 'bg-[#f47521] text-white'
              : 'text-gray-400 hover:text-white'
              }`}
            onClick={() => {
              setActiveTab('pending');
              setStatusIds([1])
              setPageIndex(1);
            }}
            data-testid="pending-tab"
          >
            Pending Requests
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'recent'
              ? 'bg-[#f47521] text-white'
              : 'text-gray-400 hover:text-white'
              }`}
            onClick={() => {
              setActiveTab('recent');
              setStatusIds([2, 6])
              setPageIndex(1);
            }}
            data-testid="upcoming-tab"
          >
            Upcoming Sessions
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'inpast'
              ? 'bg-[#f47521] text-white'
              : 'text-gray-400 hover:text-white'
              }`}
            onClick={() => {
              setActiveTab('inpast');
              setStatusIds([4, 5, 3])
              setPageIndex(1);
            }}
            data-testid="past-tab"
          >
            In Past
          </button>
        </div>

        {/* Session Requests */}
        <div className="space-y-4" data-testid="sessions-list">
          {activeTab === 'pending' && (
            sessionRequests.length > 0 ? (
              sessionRequests.map((request) => (
                <div key={request.bookingId} className="bg-[#252d3d] rounded-lg p-6 border border-orange-500/30" data-testid={`pending-session-${request.bookingId}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <img
                        src={request.learnerPhotoData || DefaultImage}
                        alt={request.learnerFullName}
                        className="w-12 h-12 rounded-full"
                        data-testid={`learner-avatar-${request.bookingId}`}
                      />

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold" data-testid={`learner-name-${request.bookingId}`}>{request.learnerFullName}</h3>
                          <div className={`p-2 rounded-lg ${getSessionTypeColor(request.sessionTypeName)}`} data-testid={`session-type-icon-${request.bookingId}`}>
                            {getSessionIcon(request.sessionTypeName)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center" data-testid={`session-date-${request.bookingId}`}>
                            <Calendar className="w-4 h-4 mr-1" />
                            {request.date}
                          </span>
                          <span className="flex items-center" data-testid={`session-time-${request.bookingId}`}>
                            <Clock className="w-4 h-4 mr-1" />
                            {`${formatTime(request.slotStartTime)} - ${formatTime(request.slotEndTime)}`}
                          </span>
                          <span className="capitalize" data-testid={`session-type-${request.bookingId}`}>{request.sessionTypeName}</span>
                        </div>

                        <p className="text-gray-300 mb-4" data-testid={`learner-message-${request.bookingId}`}>{request.learnerMessage}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500" data-testid={`request-date-${request.bookingId}`}>Requested {getDate(request.bookingRequestedAt)}</span>

                          <div className="flex space-x-2" data-testid={`action-buttons-${request.bookingId}`}>
                            <button
                              onClick={() => handleDeclineSession(request.bookingId)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg flex items-center"
                              data-testid={`decline-button-${request.bookingId}`}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Decline
                            </button>

                            <button
                              onClick={() => handleRescheduleSession(request.bookingId)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center"
                              data-testid={`reschedule-button-${request.bookingId}`}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reschedule
                            </button>

                            <button
                              onClick={() => handleAcceptSession(request.bookingId)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center"
                              data-testid={`accept-button-${request.bookingId}`}
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
              ))
            ) : (
              <div className="text-center py-8" data-testid="no-pending-sessions">
                <div className="text-gray-400 mb-2">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                </div>
                <p className="text-gray-400 text-lg">No pending requests</p>
                <p className="text-gray-500 text-sm">You don't have any pending session requests at the moment.</p>
              </div>
            )
          )}

          {activeTab === 'recent' && (
            recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <div key={request.bookingId} className="bg-[#252d3d] rounded-lg p-6 opacity-75" data-testid={`upcoming-session-${request.bookingId}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <img
                        src={request.learnerPhotoData || DefaultImage}
                        alt={request.learnerFullName}
                        className="w-12 h-12 rounded-full"
                        data-testid={`learner-avatar-${request.bookingId}`}
                      />

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold" data-testid={`learner-name-${request.bookingId}`}>{request.learnerFullName}</h3>
                          <div className={`p-2 rounded-lg ${getSessionTypeColor(request.sessionTypeName)}`} data-testid={`session-type-icon-${request.bookingId}`}>
                            {getSessionIcon(request.sessionTypeName)}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.statusName === 'Scheduled' ? 'bg-green-500/20 text-green-400' :
                            request.statusName === 'Rescheduled' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-red-500/20 text-red-400'
                            }`} data-testid={`session-status-${request.bookingId}`}>
                            {request.statusName.charAt(0).toUpperCase() + request.statusName.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4" data-testid={`learner-message-${request.bookingId}`}>{request.learnerMessage}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                          <span className="flex items-center" data-testid={`session-date-${request.bookingId}`}>
                            <Calendar className="w-4 h-4 mr-1" />
                            {request.date}
                          </span>
                          <span className="flex items-center" data-testid={`session-time-${request.bookingId}`}>
                            <Clock className="w-4 h-4 mr-1" />
                            {`${formatTime(request.slotStartTime)} - ${formatTime(request.slotEndTime)}`}
                          </span>
                        </div>
                        <div className='flex justify-between items-center mb-4'>
                          <span className="text-xs text-gray-500" data-testid={`request-date-${request.bookingId}`}>Requested {getDate(request.bookingRequestedAt)}</span>
                          <div className="flex space-x-2" data-testid={`action-buttons-${request.bookingId}`}>
                            <button
                              onClick={() => handleCancelSession(request.bookingId)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg flex items-center"
                              data-testid={`cancel-button-${request.bookingId}`}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                            <button
                              onClick={() => handleCompletedSession(request.bookingId)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center"
                              data-testid={`complete-button-${request.bookingId}`}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Completed
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8" data-testid="no-upcoming-sessions">
                <div className="text-gray-400 mb-2">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                </div>
                <p className="text-gray-400 text-lg">No upcoming sessions</p>
                <p className="text-gray-500 text-sm">You don't have any upcoming sessions at the moment.</p>
              </div>
            )
          )}

          {activeTab === 'inpast' && (
            sessionRequests.length > 0 ? (
              sessionRequests.map((request) => (
                <div key={request.bookingId} className="bg-[#252d3d] rounded-lg p-6 opacity-75" data-testid={`past-session-${request.bookingId}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <img
                        src={request.learnerPhotoData || DefaultImage}
                        alt={request.learnerFullName}
                        className="w-12 h-12 rounded-full"
                        data-testid={`learner-avatar-${request.bookingId}`}
                      />

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold" data-testid={`learner-name-${request.bookingId}`}>{request.learnerFullName}</h3>
                          <div className={`p-2 rounded-lg ${getSessionTypeColor(request.sessionTypeName)}`} data-testid={`session-type-icon-${request.bookingId}`}>
                            {getSessionIcon(request.sessionTypeName)}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.statusName === 'Completed' ? 'bg-green-500/20 text-green-400' :
                            request.statusName === 'Rescheduled' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-red-500/20 text-red-400'
                            }`} data-testid={`session-status-${request.bookingId}`}>
                            {request.statusName.charAt(0).toUpperCase() + request.statusName.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4" data-testid={`session-message-${request.bookingId}`}>{request.cancelReason === null ? request.learnerMessage : request.cancelReason}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                          <span className="flex items-center" data-testid={`session-date-${request.bookingId}`}>
                            <Calendar className="w-4 h-4 mr-1" />
                            {request.date}
                          </span>
                          <span className="flex items-center" data-testid={`session-time-${request.bookingId}`}>
                            <Clock className="w-4 h-4 mr-1" />
                            {`${formatTime(request.slotStartTime)} - ${formatTime(request.slotEndTime)}`}
                          </span>
                        </div>

                        <span className="text-xs text-gray-500" data-testid={`request-date-${request.bookingId}`}>Requested {getDate(request.bookingRequestedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8" data-testid="no-past-sessions">
                <div className="text-gray-400 mb-2">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                </div>
                <p className="text-gray-400 text-lg">No past sessions</p>
                <p className="text-gray-500 text-sm">You don't have any completed, cancelled, or declined sessions yet.</p>
              </div>
            )
          )}
          <TableFooter
            totalItems={totalItems}
            pageSize={pageSize}
            pageIndex={pageIndex}
            changePage={(page) => setPageIndex(page)}
            setPageSize={(setSize) => {
              setPageSize(setSize);
              setPageIndex(1);
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>

        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <RescheduleDialog
            onClose={() => setShowRescheduleModal(null)}
            onConfirm={confirmReschedule}
            sessionId={showRescheduleModal}
          />
        )}

        {/* Cancel Modal */}
        <CustomModal
          isOpen={!!showCancelModal}
          onClose={() => setShowCancelModal(null)}
          title="Cancel Session"
          size="md"
        >
          <div data-testid="cancel-modal-content">
            <p className="text-gray-300 mb-4">Please provide a reason for cancelling this session.</p>

            <textarea
              className="w-full p-3 bg-[#1e2432] border border-gray-600 rounded-lg text-white mb-4 min-h-[120px]"
              placeholder="Enter your message here..."
              value={cancelMessage}
              onChange={(e) => handleCancelMessageChange(e.target.value)}
              data-testid="cancel-message-textarea"
            />
            {cancelMessageError && (
              <p className="text-red-500 text-sm mb-2" data-testid="cancel-message-error">{cancelMessageError}</p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                data-testid="cancel-cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center"
                data-testid="cancel-confirm-button"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel Session
              </button>
            </div>
          </div>
        </CustomModal>
      </div>
    </div>
  );
};

export default SessionManagementCard;