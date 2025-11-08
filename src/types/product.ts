import { z } from "zod";
import { Brand, Category, PaginatedData, Review } from ".";

export const stockStatusSchema = z.enum(["in-stock", "out-of-stock", "low-stock"]);
export const discountTypeSchema = z.enum(["percentage", "fixed"]);
export const unitSchema = z.enum([
  "bag",
  "piece",
  "kg",
  "tonne",
  "litre",
  "bundle",
  "meter",
  "box",
  "packet",
  "set",
  "other"
]);
export type stockStatus = z.infer<typeof stockStatusSchema>;
export type discountType = z.infer<typeof discountTypeSchema>;
export type unit = z.infer<typeof unitSchema>;

export const queryOptionsSchema = z.object({
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  stockStatus: stockStatusSchema.optional(),

  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isDiscount: z.boolean().optional(),
  isDeleted: z.boolean().optional(),

  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  search: z.string().optional(),
});
export type QueryOptions = z.infer<typeof queryOptionsSchema>;

export type Product = {
  _id: string;
  name: string,
  sku: string,
  slug: string,
  description?: string,
  shortDescription?: string,
  brand?: string | Partial<Brand>,
  category: string | Partial<Category>,
  thumbnail: string,
  images: string[],
  originalPrice: number,
  discountValue: number,
  discountType: discountType,
  finalPrice: number,
  stock: number,
  stockStatus: stockStatus,
  unit: unit,
  minStock: number,
  features?: string[],
  specifications: Record<string, string>,
  tags: string[],
  isFeatured: boolean,
  isNewArrival: boolean,
  isDiscount: boolean,
  reviewCount: number,
  rating: number,
  totalSold: number,
  salesCount: number,
  createdAt: string,
  updatedAt: string,
  isDeleted: boolean,
  // relations
  reviews?: Partial<Review>[];
};


interface PaginatedProducts extends PaginatedData {
  products: Product[];
}

interface ProductFilters {
  categories: { _id: string; title: string }[];
  brands: { _id: string; name: string }[];
  priceRange: { minPrice: number; maxPrice: number };
  colors: string[];
  sizes: string[];
};

export type { PaginatedProducts, ProductFilters };