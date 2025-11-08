import instance from "@/lib/axios";
import { ApiResponse, Login, Register, User } from "@/types";


export const authService = {
  async login(data: Login) {
    const response = await instance.post<ApiResponse<User>>("/auth/login", data);
    return response.data;
  },

  async register(data: Register) {
    const response = await instance.post<ApiResponse<User>>("/auth/register", data);
    return response.data;
  },

  async requestForOtp(phoneOrEmail: string) {
    const response = await instance.post("/auth/request-otp", { phoneOrEmail });
    return response.data;
  },

  async loginViaOtp(phoneOrEmail: string, otp: string) {
    const response = await instance.post("/auth/otp-login", { phoneOrEmail, otp });
    return response.data;
  },

  async refreshTokens() {
    const response = await instance.post("/auth/refresh-tokens");
    return response.data;
  }
}