import axiosInstance from "../configs/axiosInstance";

export interface UpcomingSessionResponse {
  numberOfUpcomingSession: number;
  nextSessionDay: string;
  nextSessionTime: string;
}

export interface LearningProcessResponse {
  learningProgress: number;
}

export interface OnlineMentorsResponse {
  numberOfMentors: number;
}

export interface Course {
  courseName: string;
  isCompleted: boolean;
  courseCategory: string;
}

export interface ListCoursesResponse {
  courseList: Course[];
}

export const learnerDashboardService = {
  async getUpcomingSession(): Promise<UpcomingSessionResponse> {
    const response = await axiosInstance.get(
      "/learnerdashboard/upcoming-sessions"
    );
    return response.data as UpcomingSessionResponse;
  },

  async getLearningProcess(): Promise<LearningProcessResponse> {
    const response = await axiosInstance.get(
      "/learnerdashboard/learning-progress"
    );
    return response.data as LearningProcessResponse;
  },

  async getOnlineMentors(): Promise<OnlineMentorsResponse> {
    const response = await axiosInstance.get("/learnerdashboard/mentors");
    return response.data as OnlineMentorsResponse;
  },

  async listCourses(): Promise<ListCoursesResponse> {
    const response = await axiosInstance.get(
      "/learnerdashboard/enrolled-courses"
    );
    return response.data as ListCoursesResponse;
  },
};
