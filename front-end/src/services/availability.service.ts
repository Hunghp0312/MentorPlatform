import axiosInstance from "../configs/axiosInstance";
import { UpdateAvailabilityRequest } from "../types/available";

export const availabilityService = {
  async getWeekAvailability(mentorId: string, weekStart: string) {
    try {
      const response = await axiosInstance.get(
        `/availability/${mentorId}/week?weekStartDate=${weekStart}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching week availability:", error);
      throw error;
    }
  },
  async updateAvailability(
    mentorId: string,
    availabilityData: UpdateAvailabilityRequest
  ) {
    try {
      const response = await axiosInstance.put(
        `/availability/${mentorId}/days`,
        availabilityData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating availability:", error);
      throw error;
    }
  },
};
