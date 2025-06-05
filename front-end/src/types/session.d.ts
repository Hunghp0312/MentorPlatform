export interface BookingRequest {
    mentorId: string;
    mentorTimeAvailableId: string
    learnerMessage: string;
    sessionTypeId: string;
}

export interface TimeSlot {
    id: string;
    startTime: string; 
    endTime: string;
}