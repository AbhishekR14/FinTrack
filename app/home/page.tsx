"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "../../components/ui/Spinner";
import NavBar from "@/components/ui/NavBar";
import MonthlySummary from "@/components/ui/MonthlySummary";
import DetailedMonthlySummary from "@/components/ui/DetailedMonthlySummary";
import MonthlyPieChart from "@/components/ui/MonthlyPieChart";
import CurrentMonthSummary from "@/components/ui/CurrentMonthSummay";
import { DetailedSummary } from "@/components/ui/DetailedSummary";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  monthlyAllTransactionsAtom,
  selectedMonthAtom,
  selectedYearAtom,
} from "@/store/atoms/transactions";
import { getAllTransactionsByMonth } from "../api/transactions/actions/transactions";
import { monthName } from "@/lib/misc";
import AddTransactionButton from "@/components/ui/AddTransactionButton";
import { loadTransactions } from "@/store/atoms/misc";
import { formatDateToString } from "@/lib/misc";
import { getTransactionsType } from "../api/transactions/types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const [monthlyAllTransactions, setMonthlyAllTransactions] = useRecoilState(
    monthlyAllTransactionsAtom
  );
  const selectedMonth = useRecoilValue(selectedMonthAtom);
  const selectedYear = useRecoilValue(selectedYearAtom);
  const [monthInfoLoading, setMonthInfoLoading] = React.useState(true);
  const reloadTransactions = useRecoilValue(loadTransactions);
  const setReloadTransactions = useSetRecoilState(loadTransactions);
  const [isDemo, setIsDemo] = React.useState(false);

  async function callGetAllTransactionsByMonth(month: number, year: number) {
    const res = await getAllTransactionsByMonth(
      //@ts-ignore
      session.data?.user?.id,
      year,
      month
    );
    if (res) {
      setMonthlyAllTransactions(
        //@ts-ignore
        res.map((transaction: getTransactionsType) => {
          return {
            ...transaction,
            //@ts-ignore
            date: formatDateToString(transaction.date),
          };
        })
      );
    }
    setMonthInfoLoading(false);
  }
  React.useEffect(() => {
    if (session.status === "authenticated") {
      callGetAllTransactionsByMonth(selectedMonth, selectedYear);
      if (session.data?.user?.email === "Demo@Fintrack.com") {
        setIsDemo(true);
      }
    }
  }, [selectedMonth, selectedYear, reloadTransactions, session.status]);

  if (session.status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (!session || session.status === "unauthenticated") {
    router.push("/");
    return <div className="h-screen"></div>;
  }

  return (
    <div className="min-h-screen">
      <NavBar
        profilePicture={session.data?.user?.image || "/default-avatar.png"}
        userName={session.data?.user?.name || ""}
        email={session.data?.user?.email || ""}
      />
      {isDemo && (
        <div className="relative m-4 mb-0 text-center p-6 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100 hover:dark:bg-gray-700">
          <button
            className="absolute top-2 right-3 text-xl text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            onClick={() => {
              setIsDemo(false);
            }}
          >
            ×
          </button>
          <div className="mb-4 text-2xl">Welcome to demo account!</div>
          <div className="text-red-500">
            You are logged in as a demo user with sample data generated to show
            you how things might look like.
          </div>
          <Button
            className="mt-2 text-white"
            onClick={() => {
              signOut({ callbackUrl: "/signup" });
            }}
          >
            Create your own account
          </Button>
        </div>
      )}
      <div className="p-8">
        <div className="flex mb-4">
          <AddTransactionButton
            type="Expense"
            //@ts-ignore
            userId={session.data?.user?.id}
          />

          <div className="ml-4">
            <AddTransactionButton
              type="Income"
              //@ts-ignore
              userId={session.data?.user?.id}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 lg:w-max-xl">
            <CurrentMonthSummary />
          </div>
          <div className="col-span-1 ">
            <DetailedMonthlySummary
              month={monthName[selectedMonth]}
              loading={monthInfoLoading}
            />
          </div>
          <div className="col-span-1 ">
            <MonthlyPieChart />
          </div>
          <div className="col-span-1">
            <MonthlySummary />
          </div>
        </div>
        <div className="mt-8 ">
          <DetailedSummary user={session.data?.user} />
        </div>
      </div>
    </div>
  );
}
