import axiosInstance from "../configs/axiosInstance"

export const mentorDashboardService = {
    async getUpcommingSessions() {
        try {
            const response  = await axiosInstance.get("/Sessions/all") 
            return response.data;
        }
        catch (error) {
            console.error("Error fetching upcoming sessions:", error);
            throw error;
        }
    },
}