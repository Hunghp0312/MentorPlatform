import axiosInstance from "../configs/axiosInstance";
import {
  MentorApplicationResponse,
  MentorUpdateStatusRequest,
} from "../types/approval";

export const approvalService = {
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
  async getAllMentorApplications(
    query: string,
    applicationStatus: number,
    pageIndex: number,
    pageSize: number
  ) {
    const response = await axiosInstance.get(
      "/MentorApplications/applications",
      {
        params: {
          Query: query,
          PageIndex: pageIndex,
          PageSize: pageSize,
          applicationStatus: applicationStatus,
        },
      }
    );
    return response.data;
  },
  async getMentorApplicationDetail(mentorApplicationId: string) {
    try {
      const response = await axiosInstance.get(
        `/MentorApplications/mentor-application-detail/${mentorApplicationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching mentor application detail:", error);
      throw error;
    }
  },
};
