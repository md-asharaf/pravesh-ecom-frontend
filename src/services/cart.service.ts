import instance from "@/lib/axios"
import { ApiResponse, Cart } from "@/types";

export const cartService = {
  async getMyCart() {
    const response = await instance.get<ApiResponse<Cart>>("/cart/me");
    return response.data;
  },

  async addToCart(productId: string) {
    const response = await instance.post<ApiResponse<Cart>>("/cart/add", { productId });
    return response.data;
  },

  async removeFromCart(productId: string) {
    const response = await instance.delete<ApiResponse<Cart>>(`/cart/item/${productId}`);
    return response.data;
  },

  async updateCart(productId: string, quantity: number) {
    const response = await instance.patch<ApiResponse<Cart>>(`/cart/item/${productId}`, { quantity });
    return response.data;
  },

  async clearCart() {
    const response = await instance.delete<ApiResponse<Cart>>("/cart/clear");
    return response.data;
  },

  async getCartSummary() {
    const response = await instance.get<ApiResponse<{ totalPrice: number, totalItems: number }>>("/cart/summary");
    return response.data;
  }
}