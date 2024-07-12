import { z } from "zod";

export const addTransactionSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  note: z.string().optional(),
  type: z.enum(["Expense", "Income"]),
  date: z.date(),
});

export const updateTransactionSchema = z.object({
  id: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  note: z.string().optional(),
  type: z.enum(["Expense", "Income"]),
  date: z.date(),
});/*
id: string;
    amount: number;
    date: Date;
    category: string;
    type: string;
    note: string;
}*/