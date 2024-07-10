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

const chartData = [
  { month: "January", expense: 186, income: 80 },
  { month: "February", expense: 305, income: 200 },
  { month: "March", expense: 237, income: 120 },
  { month: "April", expense: 73, income: 190 },
  { month: "May", expense: 209, income: 130 },
  { month: "June", expense: 214, income: 140 },
];

const chartConfig = {
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MonthlySummary() {
  return (
    <Card className="flex flex-col dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100">
      <CardHeader className="items-center">
        <CardTitle>Monthly Income-Expense Summary</CardTitle>
        <CardDescription>
          <div className="flex justify-center items-center">
            <button className="text-lg" onClick={() => {}}>
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
            <h2 className="cursor-pointer mx-2">Jan,2024 - Jun,2024</h2>
            <button className="text-lg" onClick={() => {}}>
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
