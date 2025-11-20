import instance from "@/lib/axios";
import { ApiResponse, CreateCustomOrder, CreateOrder, Order, PaginatedOrders } from "@/types";

export const orderService = {
  async create(data: CreateOrder) {
    const response = await instance.post<ApiResponse<Order>>("/orders", data);
    return response.data;
  },

  async createCustomOrder(data: CreateCustomOrder) {
    const formData = new FormData();
    if (data && data.image) {
      formData.append("image", data.image);
    }
    const response = await instance.post<ApiResponse<Order>>("/orders/custom", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async confirmCustomOrder(orderId: string) {
    const response = await instance.post<ApiResponse<Order>>("/orders/confirm", { orderId });
    return response.data;
  },

  async cancelOrder(orderId: string) {
    const response = await instance.patch<ApiResponse<Order>>("/orders/cancel", { orderId });
    return response.data;
  },

  async getMyOrders(options?: { page?: number, limit?: number, search?: string, status?: string, time?: string }) {
    const response = await instance.get<ApiResponse<PaginatedOrders>>("/orders/me", {
      params: {
        page: options?.page,
        limit: options?.limit,
        search: options?.search,
        status: options?.status,
        time: options?.time,
        populate: true
      },
    });
    return response.data;
  },

  async getById(orderId: string) {
    const response = await instance.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
  }
};
