export type Unit = "bag" | "piece" | "kg" | "tonne" | "litre" | "box" | "packet" | "set" | "bundle" | "meter";
export type DiscountType = "percentage" | "fixed";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type BannerType = "product" | "category" | "offer" | "external";
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled" | "awaiting_confirmation" | "awaiting_payment";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  desc?: string;
  shortDesc?: string;
  cat: string;
  brand?: string;
  orig: number;
  discVal: number;
  discType: DiscountType;
  final: number;
  stock: number;
  unit: Unit;
  stockStatus: StockStatus;
  imgs: string[];
  thumb: string;
  tags?: string[];
  featured?: boolean;
  new?: boolean;
  discount?: boolean;
  rating?: number;
  reviews?: number;
  sold?: number;
}

export interface Filter {
  cat?: string;
  brand?: string;
  min?: number;
  max?: number;
  inStock?: boolean;
  featured?: boolean;
  new?: boolean;
  discount?: boolean;
  tags?: string[];
  rating?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface Banner {
  id: string;
  title: string;
  img: string;
  url?: string;
  type: BannerType;
  target?: string;
  order: number;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  img?: string;
  tags?: string[];
  published: boolean;
}

export interface Brand {
  id: string;
  name: string;
  img?: string;
}

export interface CartItem {
  p: Product;
  qty: number;
}

export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface Category {
  id: string;
  title: string;
  img?: string;
  parent?: string;
}

export interface OrderItem {
  p: Product;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  user: string;
  items: OrderItem[];
  total: number;
  ship: string;
  status: OrderStatus;
  custom: boolean;
  img?: string;
  feedback?: string;
}

export interface Review {
  id: string;
  user: string;
  product: string;
  rating: number;
  comment?: string;
}

export interface Wishlist {
  id: string;
  user: string;
  items: Product[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  img?: string;
  wallet: number;
}
