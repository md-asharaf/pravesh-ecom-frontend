import { z } from "zod";
import { PaginatedData } from ".";

export const transactionTypeEnum = z.enum(["credit", "debit"]);
export type TransactionType = z.infer<typeof transactionTypeEnum>;

export type Transaction = {
  amount: number;
  description: string;
  createdAt: Date;
};

export type Wallet = {
  _id: string;
  balance: number;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
};

export type WalletQueryOptions = {
  user?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedWallets extends PaginatedData {
  wallets: Wallet[];
}
