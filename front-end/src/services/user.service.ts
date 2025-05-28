import axiosInstance from "../configs/axiosInstance";
import { UserApplication } from "../types/user";

export const userService = {
  async getCurrentUser(): Promise<UserApplication> {
    const response = await axiosInstance.get(`/Users/current-user`);
    const data = response.data;

    // Map backend response to frontend User interface

    return data;
  },
};
