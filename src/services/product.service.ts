import axiosInstance from "@/lib/axios";
import { ApiResponse, PaginatedProducts, Product } from "@/types";

export const productService = {
  async search(query?: string, options?: { page?: number, limit?: number }) {
    const response = await axiosInstance.get<PaginatedProducts>(`/products/search`, {
      params: {
        q: query,
        ...options
      }
    });
    return response.data;
  },

  async getAll(options?: { page?: number, limit?: number }) {
    const response = await axiosInstance.get<PaginatedProducts>("/products", {
      params: options
    });
    return response.data;
  },

  async getFilters() {
    const response = await axiosInstance.get("/products/filters");
    return response.data;
  },

  async getDiscounted(options?: { page?: number, limit?: number }) {
    const response = await axiosInstance.get<PaginatedProducts>("/products/discount", {
      params: options
    });
    return response.data;
  },

  async getFeatured(options?: { page?: number, limit?: number }) {
    const response = await axiosInstance.get<PaginatedProducts>("/products/featured", {
      params: options
    });
    return response.data;
  },

  async getTrending(options?: { page?: number, limit?: number }) {
    const response = await axiosInstance.get<PaginatedProducts>("/products/trending", {
      params: options
    });
    return response.data;
  },

  async getBestSelling(options?: { page?: number, limit?: number }) {
    const response = await axiosInstance.get<PaginatedProducts>("/products/best-selling", {
      params: options
    });
    return response.data;
  },

  async getNewArrivals(options?: { page?: number, limit?: number }) {
    const response = await axiosInstance.get<PaginatedProducts>("/products/new-arrivals", {
      params: options
    });
    return response.data;
  },

  async getByCategory(categoryId: string, options?: { page?: number, limit?: number }) {
    const response = await axiosInstance.get<PaginatedProducts>(`/products/category/${categoryId}`, {
      params: options
    });
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