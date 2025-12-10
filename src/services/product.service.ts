import axiosInstance from "@/lib/axios";
import { ApiResponse, PaginatedProducts, Product, ProductFilters, QueryOptions } from "@/types";

export const productService = {
  async getAll(options: QueryOptions) {
    const response = await axiosInstance.get<ApiResponse<PaginatedProducts>>("/products", {
      params: options
    });
    return response.data;
  },

  async getFilters() {
    const response = await axiosInstance.get<ApiResponse<ProductFilters>>("/products/filters");
    return response.data;
  },

  async getBySlug(slug: string, populate = false) {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/slug/${slug}`, {
      params: {
        populate
      }
    });
    return response.data;
  },

  async getById(id: string, populate = false) {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`, { params: { populate } });
    return response.data;
  },

  async getRelated(id: string, options?: { page?: number; limit?: number }) {
    const params: { page: number; limit?: number } = {
      page: options?.page && !isNaN(options.page) ? Number(options.page) : 1,
    };
    if (options?.limit !== undefined && !isNaN(options.limit)) {
      params.limit = Number(options.limit);
    }
    const response = await axiosInstance.get<ApiResponse<PaginatedProducts>>(`/products/${id}/related`, {
      params
    });
    return response.data;
  },
}