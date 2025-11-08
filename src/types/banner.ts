import { z } from "zod";
import { PaginatedData } from ".";

export const bannerTypeSchema = z.enum(["product", "category", "offer", "external"]);
export type BannerType = z.infer<typeof bannerTypeSchema>;

export type Banner = {
  _id: string;
  title: string;
  image: string;
  targetUrl?: string;
  type: BannerType;
  targetId?: string;
  isDeleted: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

interface BannerQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  isDeleted?: string;
}

interface PaginatedBanners extends PaginatedData {
  banners: Banner[];
}

export type { BannerQueryOptions, PaginatedBanners };