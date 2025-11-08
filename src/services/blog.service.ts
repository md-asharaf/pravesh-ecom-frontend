import instance from "@/lib/axios";
import { ApiResponse, Blog, PaginatedBlogs } from "@/types";

export const blogService = {
  async getPostById(id: string) {
    const response = await instance.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return response.data;
  },

  async getAllPosts(options?: { page?: number, limit?: number }) {
    const response = await instance.get<PaginatedBlogs>("/blogs", { params: options });
    return response.data;
  }
}

