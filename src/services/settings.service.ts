import instance from "@/lib/axios";
import { ApiResponse, Setting } from "@/types";

export const settingsService = {
  async get() {
    const response = await instance.get<ApiResponse<Setting>>("/settings");
    return response.data;
  },
};

