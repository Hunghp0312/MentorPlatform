import React, { useState } from 'react';
import InputCustom from '../input/InputCustom';
import { TimeSlot } from '../../types/session';
import { sessionService } from '../../services/session.service';
import { SlotStatus } from '../../types/commonType';
import { formatTime } from '../../utils/formatDate';
import { toast } from 'react-toastify';
import { getUserFromToken } from '../../utils/auth';


interface RescheduleDialogProps {
    sessionId: string | null;
    onClose: () => void;
    onConfirm: () => void;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
    sessionId,
    onClose,
    onConfirm,
}) => {
    const mentorId = getUserFromToken()?.id;
    const [date, setDate] = useState<string>('');
    const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
    const [reason, setReason] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<string>('');

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);

        try {
            const res = await sessionService.getSessionSlots(mentorId as string, e.target.value);
            setTimeSlot(res.mentorTimeSlots)
        } catch (error) {
            console.error("Error fetching time slots:", error);
        }

    }
    const handleConfirm = async () => {
        try {
            setIsSubmitting(true);
            await sessionService.rescheduleBookingSession(sessionId as string, selectedSlot)
            toast.success('Session rescheduled successfully!');
            onConfirm();
        }
        catch (error) {
            console.error('Error rescheduling session:', error);
            toast.error('Failed to reschedule session. Please try again.');
            return;
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
                        <select
                            id="mentorTimeAvailableId"
                            name="mentorTimeAvailableId"
                            value={selectedSlot || ''}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="w-full bg-[#202938] border border-[#363f4e] rounded p-2 text-white appearance-none"
                            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                            data-testid="time-slot-select"
                        >
                            <option value="">Select a time slot</option>
                            {timeSlot?.map((timeSlot) => (
                                <option
                                    key={timeSlot.id}
                                    value={timeSlot.id}
                                    disabled={
                                        (timeSlot.statusId !== SlotStatus.Available) ||
                                        (date === new Date().toISOString().split('T')[0] &&
                                            new Date(`${date}T${timeSlot.startTime}`).getTime() < new Date().getTime())
                                    }
                                    data-testid={`time-slot-option-${timeSlot.id}`}
                                >
                                    {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
                                </option>
                            ))}
                        </select>
                        {timeSlot.length === 0 && (
                            <p className="text-orange-500 text-xs mt-1" data-testid="no-slots-message">
                                Mentor is not available on this day. Please select another date.
                            </p>
                        )}
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
                        disabled={!selectedSlot || isSubmitting || !date}
                        className={`flex-1 px-4 py-2 ${isSubmitting
                            ? 'bg-gray-500'
                            : (!selectedSlot || !date)
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-[#f47521] hover:bg-[#e06a1e]'
                            } text-white rounded-lg`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Send Reschedule Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleDialog;
