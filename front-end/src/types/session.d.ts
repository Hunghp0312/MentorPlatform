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
    statusId: number
}


export interface Session {
    learnerId: string;
    fullName: string;
    sessionId: string;
    sessionStatus: SessionStatus;
    slotStartTime: string;
    slotEndTime: string;
    sessionType: SessionType;
    bookingDay: string;
}

export interface SessionStatus {
    id: number;
    name: string;
}

export interface SessionType {
    id: number;
    name: string;
}