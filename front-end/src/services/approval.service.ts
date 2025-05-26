import axiosInstance from "../configs/axiosInstance";
import {
  MentorApplicationResponse,
  MentorUpdateStatusRequest,
} from "../types/approval";

export const mentorService = {
  async updateMentorApplicationStatus(request: MentorUpdateStatusRequest) {
    try {
      const response = await axiosInstance.put<MentorApplicationResponse>(
        "/MentorApplications/update-status",
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error updating mentor application status:", error);
      throw error;
    }
  },
};
