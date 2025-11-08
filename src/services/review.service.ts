import instance from "@/lib/axios";
import { ApiResponse, CreateReview, PaginatedReviews, Review, UpdateReview } from "@/types";

export const reviewService = {
  async getMyReviews(options?: { page?: number, limit?: number }) {
    const response = await instance.get<ApiResponse<PaginatedReviews>>("/reviews", {
      params: options
    });
    return response.data;
  },

  async getProductReviews(productId: string, options?: { page?: number, limit?: number }) {
    const response = await instance.get<ApiResponse<PaginatedReviews>>(`/reviews/${productId}`, {
      params: options
    });
    return response.data;
  },

  async create(data: CreateReview) {
    const response = await instance.post<ApiResponse<Review>>("/reviews", data);
    return response.data;
  },

  async update(reviewId: string, data: UpdateReview) {
    const response = await instance.patch<ApiResponse<Review>>(`/reviews/${reviewId}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await instance.delete<ApiResponse<Review>>(`/reviews/${id}`);
    return response.data;
  }
};