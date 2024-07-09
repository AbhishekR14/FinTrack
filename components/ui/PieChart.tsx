"use client";

import React, { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRecoilValue } from "recoil";
import {
  monthlyAllTransactionsAtom,
  selectedMonthAtom,
  selectedYearAtom,
} from "@/store/atoms/transactions";
import { monthName } from "@/lib/misc";

interface Transaction {
  amount: number;
  category: string;
  date: string;
  id: string;
  note: string;
  type: string;
  userId: string;
}

interface ChartData {
  category: string;
  amount: number;
  fill: string;
}

const defaultColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const MonthlyPieChart: React.FC = () => {
  const monthTransactions = useRecoilValue<Transaction[]>(
    monthlyAllTransactionsAtom
  );
  const selectedMonth = useRecoilValue(selectedMonthAtom);
  const selectedYear = useRecoilValue(selectedYearAtom);

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    category: { label: "category" },
  });

  useEffect(() => {
    const categoryMap: { [key: string]: number } = {};

    monthTransactions.forEach((transaction) => {
      if (categoryMap[transaction.category]) {
        categoryMap[transaction.category] += transaction.amount;
      } else {
        categoryMap[transaction.category] = transaction.amount;
      }
    });

    const sortedCategories = Object.keys(categoryMap)
      .sort((a, b) => categoryMap[b] - categoryMap[a])
      .slice(0, 4);

    const data: ChartData[] = [];
    const config: ChartConfig = {};
    let othersAmount = 0;

    sortedCategories.forEach((category, index) => {
      const color = defaultColors[index];
      data.push({
        category: category,
        amount: categoryMap[category],
        fill: color,
      });
      config[category] = {
        label: category,
        color: color,
      };
    });

    Object.keys(categoryMap).forEach((category) => {
      if (!sortedCategories.includes(category)) {
        othersAmount += categoryMap[category];
      }
    });

    if (othersAmount > 0) {
      const color = defaultColors[4];
      data.push({
        category: "Others",
        amount: othersAmount,
        fill: color,
      });
      config["Others"] = {
        label: "Others",
        color: color,
      };
    }

    setChartData(data);
    setChartConfig(config);
  }, [monthTransactions]);

  return (
    <Card className="flex flex-col dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100">
      <CardHeader className="md:p-6 items-center pb-0">
        <CardTitle>Category Summary</CardTitle>
        <CardDescription>
          {monthName[selectedMonth] + " " + selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 ">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          {chartData.length === 0 ? (
            <div className="flex justify-center h-full items-center text-base">
              No Transactions this month!
            </div>
          ) : (
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="amount"
                label={({ name }) => name}
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius="80%"
              />
            </PieChart>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm md:p-6">
        <div className="flex items-center gap-2 font-medium leading-none p-3">
          {chartData.length !== 0 ? `Category-wise Expenses` : ""}
        </div>
        <div className="md:p-2"></div>
      </CardFooter>
    </Card>
  );
};

export default MonthlyPieChart;
