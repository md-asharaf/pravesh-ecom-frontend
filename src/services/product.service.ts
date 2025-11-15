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
}