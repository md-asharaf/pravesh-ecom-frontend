import instance from "@/lib/axios";
import { ApiResponse, PaginatedBrands } from "@/types";

export const brandService = {
  async getAll(options?: { page?: number, limit?: number }) {
    const response = await instance.get<ApiResponse<PaginatedBrands>>("/brands", {
      params: options
    });
    return response.data;
  }
}