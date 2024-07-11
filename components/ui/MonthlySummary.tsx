"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { getExpenseAndIncome } from "@/app/api/transactions/actions/transactions";
import { monthName } from "@/lib/misc";
import { useRecoilValue } from "recoil";
import { allTransactionsAtom } from "@/store/atoms/transactions";

const chartConfig = {
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-5))",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MonthlySummary() {
  const [selectedEndMonth, setSelectedEndMonth] = React.useState(
    new Date().getUTCMonth()
  );
  const [selectedEndYear, setSelectedEndYear] = React.useState(
    new Date().getUTCFullYear()
  );
  const [selectedStartMonth, setSelectedStartMonth] = React.useState(
    new Date(selectedEndYear, selectedEndMonth - 4).getUTCMonth()
  );
  const [selectedStartYear, setSelectedStartYear] = React.useState(
    new Date(selectedEndYear, selectedEndMonth - 4).getUTCFullYear()
  );
  const [chartData, setChartData] = React.useState<
    {
      month: string;
      expense: number;
      income: number;
    }[]
  >([
    { month: "", expense: 0, income: 0 },
    { month: "", expense: 0, income: 0 },
    { month: "", expense: 0, income: 0 },
    { month: "", expense: 0, income: 0 },
    { month: "", expense: 0, income: 0 },
    { month: "", expense: 0, income: 0 },
  ]);
  const allTransactions = useRecoilValue(allTransactionsAtom);
  async function callGetExpenseAndIncome() {
    const res = await getExpenseAndIncome(selectedEndYear, selectedEndMonth);
    if (res) {
      const mappedResults = Object.entries(res).map(([key, value]) => {
        return {
          month: monthName[parseInt(key.split("-")[1])],
          income: value.income,
          expense: value.expense,
        };
      });
      setChartData(mappedResults);
    }
  }
  React.useEffect(() => {
    callGetExpenseAndIncome();
  }, [selectedEndYear, selectedEndMonth, allTransactions]);
  return (
    <Card className="flex flex-col dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100">
      <CardHeader className="items-center">
        <CardTitle>Monthly Income-Expense Summary</CardTitle>
        <CardDescription>
          <div className="flex justify-center items-center">
            <button
              className="text-lg"
              onClick={() => {
                setSelectedEndMonth(selectedStartMonth);
                setSelectedEndYear(selectedStartYear);
                setSelectedStartMonth(
                  new Date(
                    selectedStartYear,
                    selectedStartMonth - 4
                  ).getUTCMonth()
                );
                setSelectedStartYear(
                  new Date(
                    selectedStartYear,
                    selectedStartMonth - 4
                  ).getUTCFullYear()
                );
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
            <h2 className="cursor-pointer mx-2">
              {monthName[selectedStartMonth] +
                "," +
                selectedStartYear +
                " - " +
                monthName[selectedEndMonth] +
                "," +
                selectedEndYear}
            </h2>
            <button
              className="text-lg"
              onClick={() => {
                setSelectedStartMonth(selectedEndMonth);
                setSelectedStartYear(selectedEndYear);
                setSelectedEndMonth(
                  new Date(selectedEndYear, selectedEndMonth + 6).getUTCMonth()
                );
                setSelectedEndYear(
                  new Date(
                    selectedEndYear,
                    selectedEndMonth + 6
                  ).getUTCFullYear()
                );
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
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto max-h-[375px]">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="var(--color-expense)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="income"
              type="monotone"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
/*
{
  '2024-5': { income: 0, expense: 63 },
  '2024-6': { income: 95518, expense: 52518 },
  '2024-7': { income: 0, expense: 0 },
  '2024-8': { income: 0, expense: 0 },
  '2024-9': { income: 0, expense: 855 },
  '2024-10': { income: 0, expense: 0 },
  '2024-11': { income: 0, expense: 0 }
} */
