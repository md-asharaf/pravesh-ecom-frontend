export type MessageStatus = "pending" | "read" | "replied" | "archived";

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: MessageStatus;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

