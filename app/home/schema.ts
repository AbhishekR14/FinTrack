import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Amount must be a positive number",
    }),
  category: z.string().nonempty("Category is required"),
  note: z.string().optional(),
  type: z.enum(["Expense", "Income"]),
  date: z.date(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;


