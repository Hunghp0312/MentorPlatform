import React, { useState } from 'react';
import InputCustom from '../input/InputCustom';


interface RescheduleDialogProps {
    sessionId: string | null;
    onClose: () => void;
    onConfirm: (sessionId: string, date: string, time: string, reason: string) => void;
}
interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
    sessionId,
    onClose,
    onConfirm,
}) => {
    const [date, setDate] = useState<string>('');
    const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
    const [reason, setReason] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
        // Reset time slot when date changes
        setSelectedTime('');
        // Simulate fetching available time slots for the selected date
        const availableSlots: TimeSlot[] = [
            { id: '1', time: '9:00-10:00', available: true },
            { id: '2', time: '10:00-11:00', available: true },
            { id: '3', time: '14:00-15:00', available: false }, // Example of an unavailable slot
        ];
        setTimeSlot(availableSlots.filter(slot => slot.available));
    }
    const handleConfirm = () => {
        if (sessionId) {
            onConfirm(sessionId, date, selectedTime, reason);
        }
        // Reset form
        setDate('');
        setTimeSlot([]);
        setReason('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#252d3d] rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Reschedule Session</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Suggested Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => handleDateChange(e)}
                            className="w-full bg-[#1e2432] border border-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-lg px-3 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Suggested Time slot
                        </label>
                        <InputCustom
                            type='select'
                            name="timeSlot"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            optionList={timeSlot.map(slot => ({
                                id: slot.id,
                                name: slot.time,
                            }))}

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Reason for Reschedule (Optional)
                        </label>
                        <InputCustom
                            type="textarea"
                            name="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter your reason for rescheduling"
                            className="bg-[#1e2432] border border-gray-600  rounded-lg px-3 py-2 text-white"
                        />
                    </div>
                </div>

                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-[#f47521] hover:bg-[#e06a1e] text-white rounded-lg"
                    >
                        Send Reschedule Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleDialog;
