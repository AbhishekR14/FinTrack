import { atom } from "recoil";

export const allTransactionsAtom = atom({
  key: "allTransactionsAtom",
  default: [],
});
export const monthlyAllTransactionsAtom = atom({
  key: "monthlyAllTransactionsAtom",
  default: [],
});

export const selectedMonthAtom = atom({
  key: "selectedMonthAtom",
  default: new Date().getMonth(),
});
export const selectedYearAtom = atom({
  key: "selectedYearAtom",
  default: new Date().getFullYear(),
});
