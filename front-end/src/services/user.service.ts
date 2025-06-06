import axiosInstance from "../configs/axiosInstance";

export const userService = {
  async getCurrentUser() {
    const response = await axiosInstance.get(`/Users/current-user`);
    const data = response.data;
    return data;
  },
  async getUserById(userId: string) {
    const response = await axiosInstance.get(`/Users/${userId}`);
    const data = response.data;
    return data;
  },
  async updateUserProfile(userData: FormData, userId: string) {
    const response = await axiosInstance.put(
      `/Users/${userId}/profile`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const data = response.data;
    return data;
  },
  async getAllMentors(query: string = "") {
    const response = await axiosInstance.get(
      `/Users/mentors/paged?query=${query}`
    );
    const data = response.data;
    return data;
  },
  async getMentorById(mentorId: string) {
    try {
      const response = await axiosInstance.get(`/Users/${mentorId}`);
      return response.data;
    }catch (error) {
      console.error("Error fetching mentor by ID:", error);
      throw error; 
    }
  }
};
