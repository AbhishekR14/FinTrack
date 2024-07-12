import { getCurrency } from "@/app/api/transactions/actions/currency";
import { atom, selector } from "recoil";

export const allTransactionsAtom = atom<
  | {
      id: string;
      userId: string;
      amount: number;
      date: string;
      category: string;
      type: string;
      note: string;
    }[]
  | never[]
>({
  key: "allTransactionsAtom",
  default: [],
});
export const monthlyAllTransactionsAtom = atom<
  | {
      id: string;
      userId: string;
      amount: number;
      date: string;
      category: string;
      type: string;
      note: string;
    }[]
  | never[]
>({
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

export const currencySelector = selector({
  key: "currencySelector",
  get: async () => {
    const res = await getCurrency();
    if (res) {
      return res.currency;
    } else {
      return "INR";
    }
  },
});

export const currency = atom({
  key: "currency",
  default: currencySelector,
});
