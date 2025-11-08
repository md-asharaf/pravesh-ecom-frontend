import { User } from "./user";
import { PaginatedData, Product } from ".";
import { z } from "zod";

export const createReviewSchema = z.object({
  product: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});
export const updateReviewSchema = createReviewSchema.partial()
export type CreateReview = z.infer<typeof createReviewSchema>
export type UpdateReview = z.infer<typeof createReviewSchema>

export type Review = {
  _id: string;
  user: string | Partial<User>;
  product: string | Partial<Product>;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};

export interface ReviewQueryOptions {
  page?: number;
  limit?: number;
  rating?: number;
  user?: string;
  product?: string;
  search?: string;
}
export interface PaginatedReviews extends PaginatedData {
  reviews: Review[];
}
