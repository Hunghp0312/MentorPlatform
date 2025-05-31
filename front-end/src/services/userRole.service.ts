import axiosInstance from "../configs/axiosInstance";
import {
  userChangeStatusRequest,
  userListPage,
  userPaginationRequest,
  userType,
} from "../types/userRole.d";

export const userService = {
  async GetPaginatedUser(payload: userPaginationRequest) {
    console.log(payload);

    const response = await axiosInstance.get("/Users/paged", {
      params: {
        Query: payload.Query,
        RoleId: payload.RoleId,
        PageIndex: payload.PageIndex,
        PageSize: payload.PageSize,
      },
    });

    return response.data as userListPage;
  },
  async UpdateStatus(payload: userChangeStatusRequest) {
    const response = await axiosInstance.put(
      `/Users/${payload.UserId}/status`,
      {
        statusId: payload.StatusId,
      }
    );

    return response.data as userType;
  },
};

export default userService;
