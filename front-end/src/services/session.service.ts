import axiosInstance from "../configs/axiosInstance";
import { BookingRequest } from "../types/session";



export const sessionService = {
    async getSessionSlots(mentorId: string, date: string) {
        try {
            const response = await axiosInstance.get(`/Sessions/${mentorId}/schedule-by-day`, {
                params: {
                    date: date,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Error fetching session slots:", error);
            throw error;
        }
    },
    async bookSession(bookSessionData: BookingRequest) {
        try {
            const response = await axiosInstance.post(`/Sessions/booking`, bookSessionData);
            return response.data;
        }
        catch (error) {
            console.error("Error booking session:", error);
            throw error;
        }
    },
    async getAllBookingSessions(fromDate: string | null, toDate: string | null, statusId: number[] | null, pageIndex: number, pageSize: number, query: string | null) {
        try {
            const params = new URLSearchParams();
            
            if (fromDate) params.append('FromSessionDate', fromDate);
            if (toDate) params.append('ToSessionDate', toDate);
            params.append('PageIndex', pageIndex.toString());
            params.append('PageSize', pageSize.toString());
            if (query) params.append('Query', query);
            
            // Add StatusIds as separate parameters with the same name
            if (statusId && statusId.length > 0) {
                statusId.forEach((id) => {
                    params.append('StatusIds', id.toString());
                });
            }

            const response = await axiosInstance.get(`/Sessions/mentor/my-bookings?${params}`);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching all booking sessions:", error);
            throw error;
        }
    },
    async updateStatusBookingSession(sessionId: string, statusId: number, cancelReason?: string) {
        try {
            const response = await axiosInstance.put(`/Sessions/${sessionId}/status`, {
                newStatusId: statusId,
                cancelReason: cancelReason,
            });
            return response.data;
        }
        catch (error) {
            console.error("Error updating booking session status:", error);
            throw error;
        }
    },
    async rescheduleBookingSession(sessionId: string, newMentorTimeAvailableId: string) {
        try {
            const response = await axiosInstance.put(`/Sessions/${sessionId}/reschedule`, {
                newMentorTimeAvailableId: newMentorTimeAvailableId,
            });
            return response.data;
        }
        catch (error) {
            console.error("Error rescheduling booking session:", error);
            throw error;
        }
    },
    async getAvaibilityTime(mentorId: string, date: string) {
        try {
            const res = await axiosInstance.get(`/Availability/${mentorId}/week`, {
                params: {
                    weekStartDate: date,
                },
            });
            return res.data;
        }
        catch (error) {
            console.error("Error fetching availability time:", error);
            throw error;
        }

    }
}