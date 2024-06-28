"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "../../components/ui/Spinner";
import NavBar from "@/components/ui/NavBar";
import { Button } from "@/components/ui/button";
import MonthlySummary from "@/components/ui/MonthlySummary";
import LineGraph from "@/components/ui/LineGraph";
import PieChart from "@/components/ui/PieChart";
import DetailedSummary from "@/components/ui/DetailedSummary";
import CurrentMonthSummary from "@/components/ui/CurrentMonthSummay";

export default function Home() {
  const session = useSession();
  const router = useRouter();
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
  if (session.status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (!session || session.status === "unauthenticated") {
    router.push("/");
    return <></>;
  }
  return (
    <div className="h-min-screen">
      <NavBar
        profilePicture={session.data?.user?.image || "/default-avatar.png"}
        userName={session.data?.user?.name || ""}
        email={session.data?.user?.email || ""}
      />
      <div className="p-8">
        <div className="flex mb-4">
          <Button variant={"secondary"}>Add Expense</Button>
          <Button variant={"secondary"} className="ml-4">
            Add Income
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 lg:w-max-xl">
            <CurrentMonthSummary income={income} categories={categories} />
          </div>
          <div className="col-span-1 ">
            <MonthlySummary />
          </div>
          <div className="col-span-1">
            <LineGraph />
          </div>
          <div className="col-span-1 ">
            <PieChart />
          </div>
        </div>
        <div className="mt-8">
          <DetailedSummary />
        </div>
      </div>
    </div>
  );
}
