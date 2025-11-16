import instance from "@/lib/axios";
import { ApiResponse, PaginatedBanners } from "@/types";

export const bannerService = {
  async getAllBanners(options?: { page?: number, limit?: number }) {
    const response = await instance.get<ApiResponse<PaginatedBanners>>("/banners", { params: options });
    return response.data;
  }
}
