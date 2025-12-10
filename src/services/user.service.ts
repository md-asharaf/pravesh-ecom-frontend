import axiosInstance from "@/lib/axios";
import { ApiResponse, UpdateUser, User } from "@/types";

export const userService = {
  async getMe() {
    const response = await axiosInstance.get<ApiResponse<User>>("/users/me");
    return response.data;
  },

  async update(data: UpdateUser) {
    const formdata = new FormData();
    if (data.img) {
      formdata.append("image", data.img);
    }
    if (data.name) formdata.append("name", data.name);
    if (data.email) formdata.append("email", data.email);
    const response = await axiosInstance.patch<ApiResponse<User>>(`/users`, formdata,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
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
