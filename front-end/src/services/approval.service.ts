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
    page: number,
    pageSize: number,
    status: number
  ) {
    const response = await axiosInstance.get(
      "/MentorApplications/applications",
      {
        params: {
          Query: query,
          PageIndex: page,
          PageSize: pageSize,
          Status: status,
        },
      }
    );
    return response.data;
  },
};
