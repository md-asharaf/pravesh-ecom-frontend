import instance from "@/lib/axios";
import { Address, ApiResponse, CreateAddress, PaginatedAddresses } from "@/types";
export const addressService =  {
  async getMyAddresses(options?: { page?: number, limit?: number }) {
    const response = await instance.get<ApiResponse<PaginatedAddresses>>("/addresses/me", { params: options });
    return response.data;
  },
  async getById(id: string) {
    const response = await instance.get<ApiResponse<Address>>(`/addresses/${id}`, { params: { populate: true } });
    return response.data;
  },

  async create(data:CreateAddress){
    const response = await instance.post<ApiResponse<Address>>("/addresses", data);
    return response.data;
  },

  async update(id:string, data:CreateAddress){
    const response = await instance.patch<ApiResponse<Address>>(`/addresses/${id}`, data);
    return response.data;
  },

  async delete(id:string){
    const response = await instance.delete<ApiResponse<Address>>(`/addresses/${id}`);
    return response.data;
  }
}