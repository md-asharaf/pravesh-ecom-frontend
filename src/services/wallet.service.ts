import instance from "@/lib/axios";
import { ApiResponse, Transaction } from "@/types";

export const walletService = {
  async getBalance() {
    const response = await instance.get<ApiResponse<{balance: number}>>("/wallet/balance");
    return response.data;
  },
  async getTransactions() {
    const response = await instance.get<ApiResponse<Transaction[]>>("/wallet/transactions");
    return response.data;
  }
}