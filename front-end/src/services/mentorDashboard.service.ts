import axiosInstance from "../configs/axiosInstance"

export const mentorDashboardService = {
    async getUpcommingSessions() {
        try {
            const response  = await axiosInstance.get("/Sessions/mentor/session-dashboard") 
            return response.data;
        }
        catch (error) {
            console.error("Error fetching upcoming sessions:", error);
            throw error;
        }
    },
    async getCourseOfMentor() {
        try {
            const response = await axiosInstance.get("/Courses/mentor/course-dashboard");
            return response.data;
        } catch (error) {
            console.error("Error fetching courses of mentor:", error);
            throw error;
        }
    }
}