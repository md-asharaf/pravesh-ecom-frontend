import instance from "@/lib/axios";
import { ApiResponse, Category, PaginatedCategories } from "@/types";

export const categoryService = {
  async getAll(options?: { page?: number, limit?: number }) {
    const response = await instance.get<PaginatedCategories>("/categories", {
      params: options
    });
    return response.data;
  },
  async getChildCategories(id: string) {
    const response = await instance.get<ApiResponse<Category[]>>(`/categories/children/${id}`);
    return response.data;
  },

  async getById(id: string, populate?: boolean) {
    const response = await instance.get<ApiResponse<Category>>(`/categories/${id}`, { params: { populate } });
    return response.data;
  }
}

