import axiosInstance from "../configs/axiosInstance";
import { CourseCreateUpdateType, CourseFilterType } from "../types/course";

export const courseService = {
  async getPaginationCourses(
    query: string,
    filter: CourseFilterType,
    page: number,
    pageSize: number
  ) {
    const response = await axiosInstance.get("/Courses", {
      params: {
        Query: query,
        MentorId: filter.mentorId,
        CategoryId: filter.categoryId,
        Level: filter.levelId,
        PageIndex: page,
        PageSize: pageSize,
      },
    });
    return response.data;
  },
  async createCourse(course: CourseCreateUpdateType) {
    const response = await axiosInstance.post("/Courses", course);
    return response.data;
  },
  async editCourse(id: string, course: CourseCreateUpdateType) {
    const res = await axiosInstance.put(`/Courses/${id}`, course);
    return res.data;
  },
  async deleteCourse(id: string) {
    const res = await axiosInstance.delete(`/Courses/${id}`);
    return res.data;
  },
  async getCourseById(id: string) {
    const res = await axiosInstance.get(`/Courses/${id}`);
    return res.data;
  },
  async getMyCourseAssignment() {
    const response = await axiosInstance.get(
      "/Courses/mentor/course-asignment"
    );
    return response.data;
  },
  async enrollCourse(courseId: string) {
    const response = await axiosInstance.post(`/Courses/enroll/${courseId}`);
    return response.data;
  },
  async finishCourse(courseId: string) {
    const response = await axiosInstance.post(`/Courses/finish/${courseId}`);
    return response.data;
  },
  async getMyCourses(
    query: string,
    filter: CourseFilterType,
    page: number,
    pageSize: number
  ) {
    const response = await axiosInstance.get("/Courses/learner", {
      params: {
        Query: query,
        MentorId: filter.mentorId,
        CategoryId: filter.categoryId,
        Level: filter.levelId,
        PageIndex: page,
        PageSize: pageSize,
      },
    });
    return response.data;
  },
};
