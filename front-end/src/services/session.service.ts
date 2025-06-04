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
    async getAllBookingSessions (fromDate: string, toDate: string, statusId: number, pageIndex: number, pageSize: number, query: string) {
        try {
            const response = await axiosInstance.get(`/Sessions/mentor/my-bookings`,{
                params: {
                    FromSessionDate: fromDate, 
                    ToSessionDate: toDate, 
                    PageIndex: pageIndex, 
                    PageSize: pageSize, 
                    StatusId: statusId,
                    Query: query, 
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
    },
    async getAvaibilityTime(mentorId : string, date: string) {
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