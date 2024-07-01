import { atom } from "recoil";

export const allTransactionsAtom = atom({
  key: "allTransactions",
  default: [],
});
export const allMonthlyTransactionsAtom = atom({
  key: "allMonthlyTransactionsAtom",
  default: [],
});
