import { PaginatedData, Product } from ".";

export type Brand = {
  _id: string;
  name: string;
  image: string;
  productCount?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};


interface PaginatedBrands extends PaginatedData {
  brands: Brand[];
}

interface BrandQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  isDeleted?: string;
}

export type { PaginatedBrands, BrandQueryOptions };