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
};
