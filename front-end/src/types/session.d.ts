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
    sharedResources: number;
    sessionsThisMonth: number;
    lifetimeLearners: number;
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

interface BookingSessionResponse {
    bookingId: string;
    learnerId: string;
    learnerPhotoData: string;
    mentorPhotoData: string;
    learnerFullName: string;
    mentorId: string;
    mentorFullName: string;
    availabilityTimeSlotId: string;
    date: string;
    slotStartTime: string;
    slotEndTime: string;
    learnerMessage: string;
    statusName: string;
    sessionTypeName: string;
    bookingRequestedAt: string;
    cancelReason?: string;
}