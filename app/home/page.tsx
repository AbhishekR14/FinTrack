"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "../../components/ui/Spinner";
import NavBar from "@/components/ui/NavBar";
import MonthlySummary from "@/components/ui/MonthlySummary";
import DetailedMonthlySummary from "@/components/ui/DetailedMonthlySummary";
import MonthlyPieChart from "@/components/ui/PieChart";
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
import { PieChartLegend } from "@/components/ui/PieChartLegend";

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
          <div className="col-span-1">
            <MonthlySummary />
          </div>
          <div className="col-span-1 ">
            <PieChartLegend />
          </div>
        </div>
        <div className="mt-8 ">
          <DetailedSummary user={session.data?.user} />
        </div>
      </div>
    </div>
  );
}
