import React, { useState } from 'react';
import {  X } from 'lucide-react';

interface BookingDialogProps {
    mentorName?: string;
    hourlyRate?: number;
    onClose?: () => void;
    onConfirm?: (bookingData: BookingData) => void;
}

interface BookingData {
    date: string;
    timeSlot: string | null;
    sessionType: 'virtual' | 'in-person';
    notes: string;
}

const BookingSessionDialog: React.FC<BookingDialogProps> = ({
    mentorName = "Sarah Johnson",
    hourlyRate = 75,
    onClose,
    onConfirm,
}) => {
    const [bookingData, setBookingData] = useState<BookingData>({
        date: '30/05/2025',
        timeSlot: null,
        sessionType: 'virtual',
        notes: '',
    });

    // In a real app, you would check actual mentor availability
    const isDateAvailable = false;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRadioChange = (value: 'virtual' | 'in-person') => {
        setBookingData(prev => ({
            ...prev,
            sessionType: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm?.(bookingData);
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
                                value={bookingData.date}
                                onChange={handleInputChange}
                                className="w-full bg-[#202938] border border-[#363f4e] rounded p-2  text-white"
                            />
                        </div>
                    </div>

                    {/* Time Slot */}
                    <div className="mb-2">
                        <label className="block text-sm mb-2">Time Slot</label>
                        <select
                            name="timeSlot"
                            value={bookingData.timeSlot || ''}
                            onChange={handleInputChange}
                            className="w-full bg-[#202938] border border-[#363f4e] rounded p-2 text-white appearance-none"
                            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                        >
                            <option value="">Select a time slot</option>
                            <option value="9:00-10:00">9:00 AM - 10:00 AM</option>
                            <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                            <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
                        </select>
                        {!isDateAvailable && (
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
                                    checked={bookingData.sessionType === 'virtual'}
                                    onChange={() => handleRadioChange('virtual')}
                                    className="mr-2 h-4 w-4 accent-blue-500"
                                />
                                <label htmlFor="virtual" className="text-sm">Virtual</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="in-person"
                                    checked={bookingData.sessionType === 'in-person'}
                                    onChange={() => handleRadioChange('in-person')}
                                    className="mr-2 h-4 w-4 accent-blue-500"
                                />
                                <label htmlFor="in-person" className="text-sm">In-Person</label>
                            </div>
                        </div>
                    </div>

                    {/* Discussion Notes */}
                    <div className="mb-6">
                        <label className="block text-sm mb-2">What would you like to discuss?</label>
                        <textarea
                            name="notes"
                            value={bookingData.notes}
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
                            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 rounded text-white font-medium transition-colors"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingSessionDialog;