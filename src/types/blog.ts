import { PaginatedData } from ".";

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  tags?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

interface PaginatedBlogs extends PaginatedData {
  blogs: Blog[];
}

interface BlogQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: string;
  isDeleted?: string;
}

export type { PaginatedBlogs, BlogQueryOptions };