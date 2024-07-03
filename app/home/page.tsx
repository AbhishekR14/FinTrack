"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "../../components/ui/Spinner";
import NavBar from "@/components/ui/NavBar";
import MonthlySummary from "@/components/ui/MonthlySummary";
import DetailedMonthlySummary from "@/components/ui/DetailedMonthlySummary";
import PieChart from "@/components/ui/PieChart";
import CurrentMonthSummary from "@/components/ui/CurrentMonthSummay";
import { DetailedSummary } from "@/components/ui/DetailedSummary";
import { useRecoilState } from "recoil";
import { monthlyAllTransactionsAtom } from "@/store/atoms/transactions";
import { getAllTransactionsByMonth } from "../api/transactions/actions/transactions";
import { monthName } from "@/lib/misc";
import AddTransactionButton from "@/components/ui/AddTransactionButton";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const [monthlyAllTransactions, setMonthlyAllTransactions] = useRecoilState(
    monthlyAllTransactionsAtom
  );
  const [selectedMonth, setSelectedMonth] = React.useState(12);
  const [selectedYear, setSelectedYear] = React.useState(0);
  const [monthInfoLoading, setMonthInfoLoading] = React.useState(true);
  const [reloadTransactions, setReloadTransactions] = React.useState(0);
  const income = 52;
  const categories = [
    { name: "Family", amount: 10911.0 },
    { name: "Eating Out", amount: 2599.0 },
    { name: "Lunch @ office", amount: 1459.0 },
    { name: "Shopping", amount: 1390.0 },
    { name: "Travel", amount: 160.0 },
    { name: "Family", amount: 10911.0 },
    { name: "Eating Out", amount: 2599.0 },
    { name: "Lunch @ office", amount: 1459.0 },
    { name: "Shopping", amount: 1390.0 },
    { name: "Travel", amount: 160.0 },
  ];
  async function callGetAllTransactionsByMonth(month: number, year: number) {
    const res = await getAllTransactionsByMonth(
      //@ts-ignore
      session.data?.user?.id || "",
      year,
      month
    );
    if (res) {
      setMonthlyAllTransactions(
        //@ts-ignore
        res.map((transaction: any) => {
          return { ...transaction, date: formatDate(transaction.date) };
        })
      );
    }
    setMonthInfoLoading(false);
  }
  React.useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    callGetAllTransactionsByMonth(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, reloadTransactions]);
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
            changed={setReloadTransactions}
          />

          <div className="ml-4">
            <AddTransactionButton
              type="Income"
              //@ts-ignore
              userId={session.data?.user?.id}
              changed={setReloadTransactions}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 lg:w-max-xl">
            <CurrentMonthSummary income={income} categories={categories} />
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
            <PieChart />
          </div>
        </div>
        <div className="mt-8 ">
          <DetailedSummary user={session.data?.user} />
        </div>
      </div>
    </div>
  );
}
