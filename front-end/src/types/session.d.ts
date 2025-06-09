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


export interface SessionKPIs {
    sessionsThisMonth: number;
    activeLearners: number;
}

export interface UpcomingSession {
    bookingId: string;
    learnerId: string;
    learnerPhotoData: string;
    learnerFullName: string;
    availabilityTimeSlotId: string;
    date: string;
    slotStartTime: string;
    slotEndTime: string;
    learnerMessage: string;
    statusName: string;
    sessionTypeName: string;
}

export interface SessionsResponse {
    sessionKPIs: SessionKPIs;
    upcomingSessions: UpcomingSession[];
}