import { getAllCategories } from "@/app/api/transactions/actions/categories";
import { atom, selector } from "recoil";

export const loadTransactions = atom({
  key: "loadTransactions",
  default: 0,
});

export const categoryStringSelector = selector({
  key: "categoryStringSelector",
  get: async () => {
    const res = await getAllCategories();
    if (res) {
      return res.categories;
    } else {
      return "";
    }
  },
});

export const categoryStringAtom = atom({
  key: "categoryStringAtom",
  default: categoryStringSelector,
});
