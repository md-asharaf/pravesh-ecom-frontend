import instance from "@/lib/axios";
import { Address, ApiResponse, PaginatedAddresses } from "@/types";
export const addressService =  {
  async getMyAddresses(options?: { page?: number, limit?: number }) {
    const response = await instance.get<PaginatedAddresses>("/addresses", { params: options });
    return response.data;
  },
  async getById(id: string) {
    const response = await instance.get<ApiResponse<Address>>(`/addresses/${id}`, { params: { populate: true } });
    return response.data;
  }
}