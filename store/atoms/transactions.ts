import { atom } from "recoil";

export const allTransactionsAtom = atom({
  key: "allTransactions",
  default: [],
});
export const monthlyAllTransactionsAtom = atom({
  key: "monthlyAllTransactionsAtom",
  default: [],
});
