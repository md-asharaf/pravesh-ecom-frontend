import instance from "@/lib/axios";
import { PaginatedBanners } from "@/types";

export const bannerService = {
  async getAllBanners(options?: { page?: number, limit?: number }) {
    const response = await instance.get<PaginatedBanners>("/banners", { params: options });
    return response.data;
  }
}
