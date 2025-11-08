import instance from "@/lib/axios";
import { PaginatedBrands } from "@/types";

export const brandService = {
  async getAll(options?: { page?: number, limit?: number }) {
    const response = await instance.get<PaginatedBrands>("/brands", {
      params: options
    });
    return response.data;
  }
}