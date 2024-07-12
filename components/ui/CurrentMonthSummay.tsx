import { useRecoilState, useRecoilValue } from "recoil";
import MonthPicker from "./monthpicker";
import {
  currency,
  monthlyAllTransactionsAtom,
  selectedMonthAtom,
  selectedYearAtom,
} from "@/store/atoms/transactions";
import React from "react";
import { formattedAmount } from "@/lib/misc";

type CategoryTransaction = {
  category: string;
  amount: number;
};

const CurrentMonthSummary: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useRecoilState(selectedMonthAtom);
  const [selectedYear, setSelectedYear] = useRecoilState(selectedYearAtom);
  const transactions = useRecoilValue(monthlyAllTransactionsAtom);
  const [income, setIncome] = React.useState<number>(0);
  const [totalExpense, setTotalExpense] = React.useState<number>(0);
  const [balance, setBalance] = React.useState<number>(0);
  const [transactionByCategory, setTransactionByCategory] = React.useState<
    CategoryTransaction[]
  >([]);
  const selectedCurrency = useRecoilValue(currency);

  React.useEffect(() => {
    let incomeSum = 0;
    let expenseSum = 0;
    const categoryMap = new Map<string, number>();

    transactions.forEach((transaction) => {
      if (transaction.type.toLocaleLowerCase() === "income") {
        incomeSum += transaction.amount;
      } else if (transaction.type.toLocaleLowerCase() === "expense") {
        expenseSum += transaction.amount;
        if (categoryMap.has(transaction.category)) {
          categoryMap.set(
            transaction.category,
            categoryMap.get(transaction.category)! + transaction.amount
          );
        } else {
          categoryMap.set(transaction.category, transaction.amount);
        }
      }
    });

    setIncome(incomeSum);
    setTotalExpense(expenseSum);

    const groupedTransactions = Array.from(
      categoryMap,
      ([category, amount]) => ({
        category,
        amount,
      })
    );
    setTransactionByCategory(groupedTransactions);
  }, [transactions, selectedMonth, selectedYear]);

  React.useEffect(() => {
    setBalance(income - totalExpense);
  }, [income, totalExpense]);

  return (
    <div className="p-6 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100 hover:dark:bg-gray-700">
      <div className="flex justify-center items-center mb-4">
        <button
          className="text-lg"
          onClick={() => {
            const date = new Date(selectedYear, selectedMonth - 1);
            setSelectedMonth(date.getMonth());
            setSelectedYear(date.getFullYear());
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 20A10 10 0 1 0 0 10a10 10 0 0 0 10 10zm1.289-15.7 1.422 1.4-4.3 4.344 4.289 4.245-1.4 1.422-5.714-5.648z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="cursor-pointer mx-2">
          <MonthPicker />
        </div>
        <button
          className="text-lg"
          onClick={() => {
            const date = new Date(selectedYear, selectedMonth + 1);
            setSelectedMonth(date.getMonth());
            setSelectedYear(date.getFullYear());
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 20A10 10 0 1 0 0 10a10 10 0 0 0 10 10zM8.711 4.3l5.7 5.766L8.7 15.711l-1.4-1.422 4.289-4.242-4.3-4.347z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-lg">
          <span>Income</span>
          <span className="text-green-500 pr-2">
            {formattedAmount(income.toFixed(2), selectedCurrency)}
          </span>
        </div>
        <div className="flex justify-between text-lg">
          <span>Expense</span>
          <span className="text-red-500 pr-2">
            {formattedAmount(totalExpense.toFixed(2), selectedCurrency)}
          </span>
        </div>
      </div>
      <div className="mb-4 h-52 pr-2 overflow-y-auto top-1/2 left-1/4">
        {transactionByCategory.map((transaction) => {
          return (
            <div
              key={transaction.category}
              className="flex justify-between pb-1"
            >
              <span>{transaction.category}</span>
              <span>
                {formattedAmount(
                  transaction.amount.toFixed(2),
                  selectedCurrency
                )}
              </span>
            </div>
          );
        })}
      </div>
      <hr className="border-t-2 border-gray-600 mb-4" />
      <div className="flex justify-between text-xl pr-2">
        <span>Balance</span>
        <span
          className={`font-bold ${
            balance < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {balance < 0 ? "-" : ""}
          {formattedAmount(Math.abs(balance).toFixed(2), selectedCurrency)}
        </span>
      </div>
    </div>
  );
};

export default CurrentMonthSummary;
