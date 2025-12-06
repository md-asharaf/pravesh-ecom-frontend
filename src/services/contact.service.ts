import instance from "@/lib/axios";
import { ApiResponse, Contact, ContactFormData } from "@/types";

export const contactService = {
  async sendEmail(data: ContactFormData) {
    const response = await instance.post<ApiResponse<Contact>>("/contact", data);
    return response.data;
  },
};

