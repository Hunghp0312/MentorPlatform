import axiosInstance from "../configs/axiosInstance";

export const userService = {
  async getCurrentUser() {
    const response = await axiosInstance.get(`/Users/current-user`);
    const data = response.data;
    return data;
  },
  async updateUserProfile(userData: FormData, userId: string) {
    userData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
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
