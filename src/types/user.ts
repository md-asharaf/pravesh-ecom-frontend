import z from "zod";
import { Address, Cart, Order, PaginatedData, Review, Wallet, Wishlist } from ".";

export type User = {
  _id: string;
  name: string;
  email: string;
  img?: string;
  role: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  // relations
  wallet?: Partial<Wallet>;
  cart?: Partial<Cart>;
  addresses?: Partial<Address>[];
  wishlist?: Partial<Wishlist>;
  orders?: Partial<Order>[];
  reviews?: Partial<Review>[];
}

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  img: z.string().url().optional(),
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