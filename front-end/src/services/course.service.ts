import axiosInstance from "../configs/axiosInstance";
import { CourseFilterType, CourseType } from "../types/course";

export const courseService = {
  async getPaginationCourses(
    query: string,
    filter: CourseFilterType,
    page: number,
    pageSize: number
  ) {
    try {
      const response = await axiosInstance.get("/Courses", {
        params: {
          Query: query,
          MentorId: filter.mentorId,
          CategoryId: filter.categoryId,
          Level: filter.level,
          PageIndex: page,
          PageSize: pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },
  async createCourse(course: CourseType) {
    try {
      const response = await axiosInstance.post("/Courses", course);
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },
  async editCourse(id: string, course: CourseType) {
    try {
      const res = await axiosInstance.put(`/Courses/${id}`, course);
      return res.data;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },
};
