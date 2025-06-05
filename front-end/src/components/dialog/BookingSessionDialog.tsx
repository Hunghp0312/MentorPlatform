import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { sessionService } from '../../services/session.service';
import { BookingRequest, TimeSlot } from '../../types/session';

interface BookingDialogProps {
    mentorId: string;
    mentorName?: string;
    hourlyRate?: number;
    onClose?: () => void;
    onConfirm?: (bookingData: BookingRequest) => void;
}

const BookingSessionDialog: React.FC<BookingDialogProps> = ({
    mentorId,
    mentorName = "Sarah Johnson",
    hourlyRate = 75,
    onClose,
    onConfirm,
}) => {
    const [slots, setSlots] = useState<TimeSlot[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingData, setBookingData] = useState<BookingRequest>({
        mentorId: mentorId,
        mentorTimeAvailableId: "",
        learnerMessage: "",
        sessionTypeId: "1",
    })

    const [selectedDate, setSelectedDate] = useState<string>('');

    // In a real app, you would check actual mentor availability

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        setSelectedDate(e.target.value);
        setBookingData(prev => ({
            ...prev,
            mentorTimeAvailableId: '', // Reset time slot when date changes
        }));
        try {
            const res = await sessionService.getSessionSlots(bookingData.mentorId, e.target.value);
            setSlots(res.mentorTimeSlots)
        }
        catch (error) {
            console.error("Error fetching available slots:", error);
            setSlots([]);
        }

    }
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRadioChange = (value: string) => {
        setBookingData(prev => ({
            ...prev,
            sessionTypeId: value,
        }));
    };
    useEffect(() => {
        const fetchSlots = async () => {
            const today = new Date().toISOString().split('T')[0];
            try {
                setSelectedDate(today);
                const res = await sessionService.getSessionSlots(mentorId, today);
                setSlots(res.mentorTimeSlots);
            } catch (error) {
                console.error("Error fetching initial slots:", error);
                setSlots([]);
            }

        };
        fetchSlots();
    }, [mentorId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            onConfirm?.(bookingData);
        }, 1000);

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
            <div className="bg-[#1a2030] text-white p-6 rounded-lg w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                    <X size={18} />
                </button>

                <h2 className="text-xl font-semibold mb-1">Book a Session with {mentorName}</h2>
                <p className="text-sm text-gray-400 mb-5">Session rate: ${hourlyRate} / hour</p>

                <form onSubmit={handleSubmit}>
                    {/* Date Input */}
                    <div className="mb-4">
                        <label className="block text-sm mb-2">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                                className="w-full bg-[#202938] border border-[#363f4e] rounded p-2 text-white"
                            />
                        </div>
                    </div>

                    {/* Time Slot */}
                    <div className="mb-2">
                        <label className="block text-sm mb-2">Time Slot</label>
                        <select
                            name="mentorTimeAvailableId"
                            value={bookingData.mentorTimeAvailableId || ''}
                            onChange={handleInputChange}
                            className="w-full bg-[#202938] border border-[#363f4e] rounded p-2 text-white appearance-none"
                            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                        >
                            <option value="">Select a time slot</option>
                            {slots?.map((timeSlot) => (
                                <option key={timeSlot.id} value={timeSlot.id}>
                                    {timeSlot.startTime} - {timeSlot.endTime}
                                </option>
                            ))}
                        </select>
                        {slots.length === 0 && (
                            <p className="text-orange-500 text-xs mt-1">
                                Mentor is not available on this day. Please select another date.
                            </p>
                        )}
                    </div>

                    {/* Session Type */}
                    <div className="mb-4 mt-4">
                        <label className="block text-sm mb-2">Session Type</label>
                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="virtual"
                                    checked={bookingData.sessionTypeId === '1'}
                                    onChange={() => handleRadioChange('1')}
                                    className="mr-2 h-4 w-4 accent-blue-500"
                                />
                                <label htmlFor="virtual" className="text-sm">Virtual</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="in-person"
                                    checked={bookingData.sessionTypeId === '2'}
                                    onChange={() => handleRadioChange('2')}
                                    className="mr-2 h-4 w-4 accent-blue-500"
                                />
                                <label htmlFor="in-person" className="text-sm">In-Person</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="in-person"
                                    checked={bookingData.sessionTypeId === '3'}
                                    onChange={() => handleRadioChange('3')}
                                    className="mr-2 h-4 w-4 accent-blue-500"
                                />
                                <label htmlFor="in-person" className="text-sm">Onsite-Session</label>
                            </div>
                        </div>
                    </div>

                    {/* Discussion Notes */}
                    <div className="mb-6">
                        <label className="block text-sm mb-2">What would you like to discuss?</label>
                        <textarea
                            name="learnerMessage"
                            value={bookingData.learnerMessage || ''}
                            onChange={handleInputChange}
                            placeholder="Briefly describe what you'd like to cover in this session..."
                            className="w-full bg-[#202938] border border-[#363f4e] rounded p-2 text-white h-24 resize-none"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">You won't be charged yet</p>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 rounded text-white font-medium transition-colors disabled:opacity-70 disabled:hover:bg-orange-500"
                        >
                            {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingSessionDialog;