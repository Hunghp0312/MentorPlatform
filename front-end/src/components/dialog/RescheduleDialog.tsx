import React, {  useState } from 'react';
import InputCustom from '../input/InputCustom';
import { TimeSlot } from '../../types/session';
import { sessionService } from '../../services/session.service';
import { useParams } from 'react-router-dom';


interface RescheduleDialogProps {
    sessionId: string | null;
    onClose: () => void;
    onConfirm: (sessionId: string, mentorTimeAvailableId: string) => void;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
    sessionId,
    onClose,
    onConfirm,
}) => {
    const { id } = useParams<string>();
    const [date, setDate] = useState<string>('');
    const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
    const [reason, setReason] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<string>('');

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);

        try {
            const res = await sessionService.getSessionSlots(id as string, e.target.value);
            setTimeSlot(res.mentorTimeSlots)
        } catch (error) {
            console.error("Error fetching time slots:", error);
        }

    }
    const handleConfirm = () => {
        setIsSubmitting(true);

        if (sessionId) {
            setTimeout(() => {
                setIsSubmitting(false);
                onConfirm(sessionId, selectedSlot);
            }, 2000);
        }
        // Reset form
        setDate('');
        setTimeSlot([]);
        setReason('');
    };

    const timeSlotOption = timeSlot.map(slot => ({
        id: slot.id,
        name: `${slot.startTime} - ${slot.endTime}`,
    }));
    timeSlotOption.unshift({ id: '', name: 'Select Time Slot' });

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
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            optionList={timeSlotOption}

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
                        disabled={isSubmitting}
                        className={`flex-1 px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-[#f47521] hover:bg-[#e06a1e]'} text-white rounded-lg`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Send Reschedule Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleDialog;
