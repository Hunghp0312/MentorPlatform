import axiosInstance from "../configs/axiosInstance";

export const adminDashboardService = {
  async getDashboardStats() {
    try {
      const response = await axiosInstance.get("/Dashboard/statistics");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
  async getDashboardPreformance() {
    try {
      const response = await axiosInstance.get("/PlatformStatistics/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard performance:", error);
      throw error;
    }
  },
};
