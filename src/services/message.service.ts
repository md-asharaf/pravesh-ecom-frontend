import instance from "@/lib/axios";
import { ApiResponse, Message, MessageFormData } from "@/types";

export const messageService = {
  async sendEmail(data: MessageFormData) {
    const response = await instance.post<ApiResponse<Message>>("/messages", data);
    return response.data;
  },
};
