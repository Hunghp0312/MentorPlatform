import React, { useState } from 'react';
import Button from '../ui/Button';

interface MentorAvailabilityProps {
    onScheduleSession: () => void;
    initialSelectedDays?: string[];
    initialTimeSlots?: { dayName: string; TimeSlot: { startTime: string; endTime: string }[] }[] ;
}

const MentorAvailability: React.FC<MentorAvailabilityProps> = ({
    onScheduleSession,
    initialSelectedDays,
    initialTimeSlots 
}) => {
    const [selectedDays, setSelectedDays] = useState<string[]>(initialSelectedDays as string[] || []);
    const [timeSlots] = useState<{ dayName: string; TimeSlot: { startTime: string; endTime: string }[] }[]>(initialTimeSlots || []); 
    console.log("timeSlots", initialTimeSlots);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


    return (
        <div className="flex flex-col gap-4 rounded-lg text-white">
            <h2 className="text-xl font-semibold mb-2" >Availability</h2>
            {/* Available Time Slots */}
            <div className="mb-4 bg-gray-700 p-4 rounded-lg">
                <p className="text-sm mb-2">Available Days</p>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => (
                        <button
                            key={day}
                            className={`py-2 rounded ${selectedDays.includes(day)
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : 'bg-gray-800'
                                } transition-colors text-center text-sm`}
                            onClick={() => setSelectedDays(selectedDays.includes(day) 
                                ? selectedDays.filter(d => d !== day)
                                : [...selectedDays, day])}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Available Time Slots */}
            <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm mb-2">Available Time Slots</p>
                {selectedDays.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {selectedDays.map(day => (
                            <div key={day} className="mb-2">
                                <h3 className="text-sm font-medium mb-1">{day}</h3>
                                {timeSlots.find(slot => slot.dayName === day)?.TimeSlot?.length ? (
                                    timeSlots.find(slot => slot.dayName === day)?.TimeSlot.map((slot, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-800 py-2 px-4 rounded text-sm mb-1"
                                        >
                                            {slot.startTime} - {slot.endTime}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400">No time slots available</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Select a day to view available time slots</p>
                )}
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