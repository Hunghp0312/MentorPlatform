import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Video, Users, Building, Mail, Calendar, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

interface SessionType {
    id: string;
    name: string;
    icon: React.ReactNode;
}

interface SlotSelection {
    date: { year: number; month: number; day: number };
    id: string; // Optional ID for the slot
}

const BookingSession: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<number>(17);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedSessionType, setSelectedSessionType] = useState<string | null>(null);

    // New: slots state to keep track of selected slots - initialized as undefined
    const [slots, setSlots] = useState<SlotSelection | undefined>(undefined);

    // Calendar month state
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState<{ month: number; year: number }>({
        month: today.getMonth(),
        year: today.getFullYear(),
    });

    // Time slots
    const timeSlots: TimeSlot[] = [
        { id: 'slot-1', time: '9:00 AM - 10:00 AM', available: true },
        { id: 'slot-2', time: '10:00 AM - 10:30 AM', available: true },
        { id: 'slot-3', time: '11:00 AM - 11:30 AM', available: true },
        { id: 'slot-4', time: '12:00 PM - 12:30 PM', available: true },
        { id: 'slot-5', time: '1:00 PM : 1:30 PM', available: true },
    ];

    // Session types
    const sessionTypes: SessionType[] = [
        { id: 'virtual', name: 'Virtual Session', icon: <Video className="w-5 h-5 mx-auto mb-2" /> },
        { id: 'in-person', name: 'In-Person Session', icon: <Users className="w-5 h-5 mx-auto mb-2" /> },
        { id: 'on-site', name: 'On-Site Session', icon: <Building className="w-5 h-5 mx-auto mb-2" /> },
    ];

    // Week days
    const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    // Helper to add or update slot selection
    const handleSlotSelection = (day: number, time: string) => {
        setSelectedDate(day);
        setSelectedTime(time);

        const slotDate = { year: currentMonth.year, month: currentMonth.month, day };
        const slot = timeSlots.find(s => s.time === time);
        
        // Directly set the new slot
        setSlots({ 
            date: slotDate, 
            id: slot?.id ?? 'slot-1' 
        });
    };

    // Optionally, update slot if user changes date or time
    const handleDateChange = (day: number) => {
        //TODO:call api to get all slot of that day
        const date = new Date(currentMonth.year, currentMonth.month, day);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        console.log(formattedDate);  
        
        // Reset time selection when changing date
        setSelectedDate(day);
        setSelectedTime(null);
        
        // Clear any previously selected slots for other days
        setSlots(undefined);
    };
    
    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        
        // Create a new single slot selection for current date and time
        const slotDate = { year: currentMonth.year, month: currentMonth.month, day: selectedDate };
        const slot = timeSlots.find(s => s.time === time);
        
        // Set the new slot
        setSlots({ 
            date: slotDate, 
            id: slot?.id ?? 'slot-1' 
        });
    }

    function handleBooking(): void {
        if(slots === undefined) {
            toast.error('Please select a date and time slot before booking.');
            return;
        }
        const data  = {
            mentorId : 'mentor-id', 
            mentorTimeAvailableId : slots ? slots.id : 'default-slot-id',
            learnerMessage: 'Your message here',
            sessionTypeId: selectedSessionType ?? 'virtual',
        }
        console.log('Booking data:', data);
        
        // Add or update slot for current date/time
        if (selectedDate && selectedTime) {
            handleSlotSelection(selectedDate, selectedTime);
        }
        // You can use the slots state here for further logic
        console.log(slots);
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
                                src="/placeholder.svg?height=48&width=48"
                                alt="John Doe"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="font-bold">John Doe, PhD</h2>
                            <p className="text-gray-400 text-sm">Leadership, Strategy</p>
                            <p className="text-green-400 text-xs">Available from M-F, 9:00-17:00</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="w-8 h-8 rounded-full bg-[#f47521] flex items-center justify-center">
                            <Plus size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#f47521] flex items-center justify-center">
                            <Mail size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#f47521] flex items-center justify-center">
                            <Calendar size={16} />
                        </button>
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
                    {timeSlots.map((slot) => (
                        <button
                            key={slot.time}
                            className={`py-2 px-4 rounded text-center text-sm
                ${selectedTime === slot.time ? 'bg-[#f47521]' : 'bg-gray-700 bg-opacity-90 hover:bg-opacity-100'}
                    `}
                            onClick={() => handleTimeChange(slot.time)}
                        >
                            {slot.time}
                        </button>
                    ))}
                </div>

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
                    className="w-full py-4 bg-[#f47521] rounded-lg font-semibold hover:bg-opacity-90 transition-colors hover:cursor-pointer hover:bg-orange-400"
                    onClick={() => handleBooking()}
                >
                    Confirm booking
                </button>
            </div>
        </div>
    );
};

export default BookingSession;