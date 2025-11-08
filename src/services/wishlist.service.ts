import instance from "@/lib/axios";
import { ApiResponse, Wishlist } from "@/types";

export const wishlistService = {
  async getWishlist() {
    const response = await instance.get<ApiResponse<Wishlist>>("/wishlist");
    return response.data;
  },

  async addProduct(productId: string) {
    const response = await instance.post<ApiResponse<Wishlist>>("/wishlist/add", { productId });
    return response.data;
  },

  async removeProduct(productId: string) {
    const response = await instance.post<ApiResponse<Wishlist>>("/wishlist/remove", { productId });
    return response.data;
  }
}