import axiosInstance from "@/lib/axios";
import { ApiResponse, UpdateUser, User } from "@/types";

export const userService = {
  async getMe() {
    const response = await axiosInstance.get<ApiResponse<User>>("/users/me");
    return response.data;
  },

  async update(data: UpdateUser) {
    const response = await axiosInstance.patch<ApiResponse<User>>(`/users`, data);
    return response.data;
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    const response = await axiosInstance.patch<ApiResponse<User>>(`/users/password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async resetPassword(otp: string, newPassword: string) {
    const response = await axiosInstance.post<ApiResponse<User>>('/users/password/reset', {
      otp,
      newPassword
    })
    return response.data;
  }
}
