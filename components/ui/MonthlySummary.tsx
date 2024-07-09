"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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
  { month: "January", desktop: 186 },
  { month: "February", desktop: 1005 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function MonthlySummary() {
  return (
    <Card className="flex flex-col dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100 ">
      <CardHeader className="md:pb-0 items-center">
        <CardTitle>Monthly Expense Summary</CardTitle>
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
            <h2 className="cursor-pointer mx-2">2024</h2>
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
      <CardContent className="flex flex-col items-center w-full h-96">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart data={chartData} width={500} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground hidden md:block"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
