import instance from "@/lib/axios";
import { ApiResponse, Blog, PaginatedBlogs } from "@/types";

export const blogService = {
  async getPostBySlug(slug: string) {
    const response = await instance.get<ApiResponse<Blog>>(`/blogs/slug/${slug}`);
    return response.data;
  },

  async getAllPosts(options?: { page?: number, limit?: number }) {
    const response = await instance.get<ApiResponse<PaginatedBlogs>>("/blogs", { params: options });
    return response.data;
  }
}

