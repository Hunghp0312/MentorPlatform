import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Video, Users, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { TimeSlot } from '../../types/session';
import { sessionService } from '../../services/session.service';
import { useParams } from 'react-router-dom';
import LoadingOverlay from '../../components/loading/LoadingOverlay';
import { formatTime } from '../../utils/formatDate';
import DefaultImage from '../../assets/Profile_avatar_placeholder_large.png'
import { SlotStatus } from '../../types/commonType';
import { userService } from '../../services/user.service';

interface SessionType {
    id: string;
    name: string;
    icon: React.ReactNode;
}

interface MentorInfo {
    id: string;
    startWorkTime: string;
    endWorkTime: string;
    expertiseTags: string[];
    mentorFullName: string;
    photoData: string;
}

const sessionTypes: SessionType[] = [
    { id: '1', name: 'Virtual Session', icon: <Video className="w-5 h-5 mx-auto mb-2" /> },
    { id: '2', name: 'In-Person Session', icon: <Users className="w-5 h-5 mx-auto mb-2" /> },
    { id: '3', name: 'On-Site Session', icon: <Building className="w-5 h-5 mx-auto mb-2" /> },
];

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const BookingSession: React.FC = () => {
    const { id } = useParams() as { id: string };
    const [selectedDate, setSelectedDate] = useState<number>();
    const [selectedSessionType, setSelectedSessionType] = useState<string | null>(null);
    const [slots, setSlots] = useState<TimeSlot[] | undefined>(undefined);
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingBooking, setLoadingBooking] = useState<boolean>(false);
    const [mentorInfo, setMentorInfo] = useState<MentorInfo>({
        id: '',
        startWorkTime: '',
        endWorkTime: '',
        expertiseTags: [],
        mentorFullName: '',
        photoData: '',
    });
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState<{ month: number; year: number }>({
        month: today.getMonth(),
        year: today.getFullYear(),
    });



    const handleDateChange = async (day: number) => {
        setSelectedDate(day);
        const date = new Date(currentMonth.year, currentMonth.month, day);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        try {
            const res = await sessionService.getSessionSlots(id, formattedDate);
            if (res.mentorTimeSlots.length === 0) {
                const result = await userService.getMentorById(id);
                setMentorInfo({
                    mentorFullName: result.mentorFullName,
                    expertiseTags: result.expertiseTags,
                    id: id,
                    startWorkTime: "",
                    endWorkTime: "",
                    photoData: result.photoData,
                })
            } else {
                const mentor = {
                    id: res.mentorId,
                    startWorkTime: res.startWorkTime,
                    endWorkTime: res.endWorkTime,
                    expertiseTags: res.expertiseTags,
                    mentorFullName: res.mentorFullName,
                    photoData: res.photoData,
                }
                setMentorInfo(mentor);
            }

            setSlots(res.mentorTimeSlots);

        }
        catch (error) {
            console.error("Error fetching available slots:", error);
            setSlots([]);
            return;
        }

    };

    const handleSlotSelected = (slotId: string) => {
        setSelectedSlot(prevSlot => prevSlot === slotId ? '' : slotId);
    }
    const handleBooking = async () => {
        if (slots === undefined) {
            toast.error('Please select a date and time slot before booking.');
            return;
        }
        if (selectedSessionType === null) {
            toast.error('Please select a session type before booking.');
            return;
        }

        const data = {
            mentorId: id,
            mentorTimeAvailableId: selectedSlot,
            learnerMessage: '',
            sessionTypeId: selectedSessionType ?? '1',
        }
        try {
            setLoadingBooking(true);
            await sessionService.bookSession(data);
            toast.success('Session booked successfully!');
        } catch (error) {
            console.error("Error booking session:", error);
            toast.error('Failed to book session. Please try again later.');
            return;
        }
        finally {
            setLoadingBooking(false);
            setSelectedSlot('');
            setSelectedSessionType(null);
        }
    }

    useEffect(() => {
        const fetchSlots = async () => {
            const today = new Date().toISOString().split('T')[0];
            try {
                setLoading(true);
                setSelectedDate(Number(today.split('-')[2]));
                const res = await sessionService.getSessionSlots(id, today)
                if (res.mentorTimeSlots.length === 0) {
                    const result = await userService.getMentorById(id);
                    setMentorInfo({
                        mentorFullName: result.mentorFullName,
                        expertiseTags: result.expertiseTags,
                        id: id,
                        startWorkTime: "",
                        endWorkTime: "",
                        photoData: result.photoData,
                    })
                } else {
                    const mentor = {
                        id: res.mentorId,
                        startWorkTime: res.startWorkTime,
                        endWorkTime: res.endWorkTime,
                        expertiseTags: res.expertiseTags,
                        mentorFullName: res.mentorFullName,
                        photoData: res.photoData,
                    }
                    setMentorInfo(mentor);
                }
                setSlots(res.mentorTimeSlots);
            } catch (error) {
                console.error("Error fetching initial slots:", error);
                setSlots([]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [])
    if (loading) {
        return <LoadingOverlay />
    }
    return (
        <div className="min-h-screen flex items-center justify-center  p-4">
            <div className="w-full max-w-6xl bg-[#1e2432] text-white rounded-lg shadow-xl p-6">
                <h1 className="text-2xl font-bold mb-1">Book a mentorship session</h1>
                <p className="text-gray-400 mb-6">Select date, time, and session type</p>

                {/* Mentor info */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                            <img
                                src={mentorInfo?.photoData || DefaultImage}
                                alt={mentorInfo?.mentorFullName || 'Mentor'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="font-bold">{mentorInfo?.mentorFullName}</h2>
                            <p className="text-gray-400 text-sm">{mentorInfo?.expertiseTags?.join(', ')}</p>
                            {mentorInfo?.startWorkTime && mentorInfo?.endWorkTime ? (
                                <p className="text-green-400 text-xs">Available from {`${formatTime(mentorInfo?.startWorkTime)} - ${formatTime(mentorInfo?.endWorkTime)}`}</p>
                            ) : (
                                <p className="text-red-400 text-xs">No available time slots</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Calendar navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        className="p-2"
                        onClick={() => {
                            setCurrentMonth((prev) => {
                                const prevDate = new Date(prev.year, prev.month - 1, 1);
                                return { month: prevDate.getMonth(), year: prevDate.getFullYear() };
                            });
                            setSelectedDate(1);
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-lg font-semibold">
                        {new Date(currentMonth.year, currentMonth.month).toLocaleString('en-En', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </h2>
                    <button
                        className="p-2"
                        onClick={() => {
                            setCurrentMonth((prev) => {
                                const nextDate = new Date(prev.year, prev.month + 1, 1);
                                return { month: nextDate.getMonth(), year: nextDate.getFullYear() };
                            });
                            setSelectedDate(1);
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center text-xs text-gray-400 font-semibold">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar */}
                <div className="grid grid-cols-7 gap-2 mb-8">
                    {Array.from({
                        length: new Date(currentMonth.year, currentMonth.month, 1).getDay() === 0
                            ? 6
                            : new Date(currentMonth.year, currentMonth.month, 1).getDay() - 1,
                    }).map((_, index) => {
                        const key = `empty-${currentMonth.year}-${currentMonth.month}-${index}`;
                        return <div key={key} className="h-10"></div>;
                    })}

                    {Array.from({
                        length: new Date(currentMonth.year, currentMonth.month + 1, 0).getDate(),
                    }).map((_, dayIdx) => {
                        const day = dayIdx + 1;
                        const isSelected = day === selectedDate;
                        const isToday =
                            day === new Date().getDate() &&
                            currentMonth.month === new Date().getMonth() &&
                            currentMonth.year === new Date().getFullYear();

                        // Check if date is in the past
                        const isPast =
                            currentMonth.year < today.getFullYear() ||
                            (currentMonth.year === today.getFullYear() && currentMonth.month < today.getMonth()) ||
                            (currentMonth.year === today.getFullYear() && currentMonth.month === today.getMonth() && day < today.getDate());

                        return (
                            <button
                                key={day}
                                disabled={isPast}
                                className={`h-10 rounded-full flex items-center justify-center text-sm
                                    ${isSelected ? 'bg-[#f47521]' : ''}
                                    ${isToday && !isSelected ? 'text-[#f47521]' : ''}
                                    ${isPast ? 'opacity-40 cursor-not-allowed' : ''}
                                    ${!isSelected && !isToday && !isPast ? 'hover:bg-gray-700' : ''}
                                `}
                                onClick={() => !isPast && handleDateChange(day)}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>

                {/* Time slots */}
                <h3 className="text-center mb-4">Select a time slot</h3>
                {slots && slots.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
                        {slots?.map((slot) => (
                            <button
                                disabled={!!(
                                    (slot.statusId !== SlotStatus.Available ) ||
                                    loadingBooking ||
                                    (
                                        // Check if selected date is today and slot time is in the past
                                        selectedDate &&
                                        selectedDate === new Date().getDate() &&
                                        currentMonth.month === new Date().getMonth() &&
                                        currentMonth.year === new Date().getFullYear() &&
                                        new Date(`${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}T${slot.startTime}`) < new Date()
                                    )
                                )}
                                key={slot.id}
                                className={`py-2 px-4 rounded text-center text-sm 
                                    ${selectedSlot === slot.id ? 'bg-[#f47521]' : 'bg-gray-700 bg-opacity-90 hover:bg-opacity-100'} 
                                    ${((slot.statusId !== SlotStatus.Available ) ||
                                        (
                                            // Apply styling for past slots on today
                                            selectedDate === new Date().getDate() &&
                                            currentMonth.month === new Date().getMonth() &&
                                            currentMonth.year === new Date().getFullYear() &&
                                            new Date(`${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}T${slot.startTime}`) < new Date()
                                        )) ? 'cursor-not-allowed !bg-gray-400' : ''}`}
                                onClick={() => handleSlotSelected(slot.id)}
                            >
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400">No available time slots for this date.</p>
                )}
                {!selectedSlot && slots && slots.length > 0 && (
                    <p className='text-center text-red-400 mb-2'>Please select a time slot to continue</p>
                )}
                {/* Session type */}
                <h3 className="text-center mb-4">Session type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {sessionTypes.map((type) => (
                        <button
                            key={type.id}
                            className={`p-4 rounded-lg flex flex-col items-center justify-center hover:border-[#f47521] hover:cursor-pointer hover:border 
                ${selectedSessionType === type.id ? 'bg-[#f47521] bg-opacity-20 border border-[#f47521]' : 'bg-gray-700 bg-opacity-30 hover:bg-opacity-40'}
                    `}
                            onClick={() => setSelectedSessionType(type.id)}
                        >
                            {type.icon}
                            <span>{type.name}</span>
                        </button>
                    ))}
                </div>

                {/* Confirm button */}
                <button
                    className={`w-full py-4 rounded-lg font-semibold transition-colors 
                        ${(loadingBooking || selectedSlot === '' || selectedSessionType === null)
                            ? 'bg-gray-600 opacity-60 cursor-not-allowed'
                            : 'bg-[#f47521] hover:bg-opacity-90 hover:cursor-pointer hover:bg-orange-400'
                        }`}
                    onClick={() => handleBooking()}
                    disabled={loadingBooking || selectedSlot === '' || selectedSessionType === null}
                >
                    {loadingBooking ? 'Booking...' : 'Confirm booking'}
                </button>
            </div>
        </div>
    );
};

export default BookingSession;