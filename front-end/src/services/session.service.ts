import axiosInstance from "../configs/axiosInstance";
import { BookingRequest } from "../types/session";

export const sessionService = {
    async getSessionSlots (mentorId: string, date: string) {
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
    async bookSession (bookSessionData: BookingRequest) {
        try {
            const response = await axiosInstance.post(`/Sessions/booking`, bookSessionData);
            return response.data;
        }
        catch (error) {
            console.error("Error booking session:", error);
            throw error;
        }
    },
    async getAllBookingSessions (mentorId: string) {
        try {
            const response = await axiosInstance.get(`/Sessions/mentor/${mentorId}/my-bookings`,{
                params: {
                    FromSessionDate: new Date().toISOString(), // Fetch bookings from today onwards
                    ToSessionDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Fetch bookings for the next year
                    StatusId: 1, // Assuming 1 is the status for active bookings
                    PageIndex: 1,
                    PageSize: 100, // Adjust as needed
                    Query: "", // Optional query parameter for filtering
                },

            });
            return response.data;
        }
        catch (error) {
            console.error("Error fetching all booking sessions:", error);
            throw error;
        }
    },
    async updateStatusBookingSession (sessionId : string, statusId: number,cancelReason?: string) {
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
    async rescheduleBookingSession(sessionId:string, newMentorTimeAvailableId : string) {
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
    }
}