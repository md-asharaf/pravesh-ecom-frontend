import z from "zod";
import { PaginatedData } from ".";

export type User = {
  _id: string;
  name: string;
  email?: string;
  phone:string;
  img?: string;
  role: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  img: z.instanceof(File).optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

export interface PaginatedUsers extends PaginatedData {
  users: User[]
}

export interface UserQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  isDeleted?: string;
}