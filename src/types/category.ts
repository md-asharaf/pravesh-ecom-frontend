import { Brand, PaginatedData, Product } from ".";

export type Category = {
  _id: string;
  title: string;
  slug:string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
  childCount?: number;
  brandCount?: number;
  parentCategory?: Partial<Category>;
  // relations
  children?: Partial<Category>[];
  products?: Partial<Product>[];
  brands?: Partial<Brand>[]
};


interface PaginatedCategories extends PaginatedData {
  categories: Category[];
}

interface CategoryQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  isDeleted?: string;
  isParent?: boolean;
}
export type { PaginatedCategories, CategoryQueryOptions };