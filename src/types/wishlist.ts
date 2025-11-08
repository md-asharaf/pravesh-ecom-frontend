import { Product } from "./product";

export type Wishlist = {
  _id: string;
  items: Array<Partial<Product>>;
  createdAt: string;
  updatedAt: string;
};
