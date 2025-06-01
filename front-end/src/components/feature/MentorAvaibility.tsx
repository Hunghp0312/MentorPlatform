import React, { useState } from 'react';
import Button from '../ui/Button';

interface TimeSlot {
    id: number;
    timeRange: string;
}

interface MentorAvailabilityProps {
    onScheduleSession: () => void;
    initialSelectedDays?: string[];
    initialTimeSlots?: TimeSlot[];
}

const MentorAvailability: React.FC<MentorAvailabilityProps> = ({
    onScheduleSession,
    initialSelectedDays = ['Mon', 'Tue', 'Wed'],
    initialTimeSlots = [
        { id: 1, timeRange: '9:00 AM - 11:00 AM' },
        { id: 2, timeRange: '2:00 PM - 5:00 PM' },
    ],
}) => {
    const [selectedDays, setSelectedDays] = useState<string[]>(initialSelectedDays);
    const [timeSlots] = useState<TimeSlot[]>(initialTimeSlots);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


    return (
        <div className="flex flex-col gap-4 rounded-lg text-white">
            <h2 className="text-xl font-semibold mb-2">Availability</h2>

            {/* Available Days */}
            <div className="mb-4 bg-gray-700 p-4 rounded-lg ">
                <p className="text-sm mb-2">Available Days</p>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => (
                        <button
                            key={day}
                            className={`py-2 rounded ${selectedDays.includes(day)
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : 'bg-gray-800'
                                } transition-colors text-center text-sm`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Available Time Slots */}
            <div>
                <p className="text-sm mb-2">Available Time Slots</p>
                <div className="flex flex-col gap-2">
                    {timeSlots.map((slot) => (
                        <div
                            key={slot.id}
                            className="bg-gray-700 py-2 px-4 rounded text-sm"
                        >
                            {slot.timeRange}
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule Button */}
            <Button
                onClick={onScheduleSession}
                className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            >
                Schedule a Session
            </Button>
        </div>
    );
};

export default MentorAvailability;