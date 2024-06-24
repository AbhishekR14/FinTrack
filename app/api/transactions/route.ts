import { NextRequest, NextResponse } from "next/server";
import { NEXT_AUTH_CONFIG } from "../../../lib/authConfig";
import { getServerSession } from "next-auth";
import {
  getAllTransactions,
  getAllTransactionsByMonth,
  getAllTransactionsByYear,
} from "./actions/transactions";

export async function GET(req: NextRequest) {
  try {
    const session: any = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const year = req.nextUrl.searchParams.get("year");
    const month = req.nextUrl.searchParams.get("month");
    if (month && year) {
      const transactions = await getAllTransactionsByMonth(
        session.user.id,
        parseInt(year),
        getMonthNumber(month)
      );
      if (transactions) {
        return NextResponse.json(transactions, { status: 200 });
      }
    } else if (year) {
      const transactions = await getAllTransactionsByYear(
        session.user.id,
        parseInt(year)
      );
      if (transactions) {
        return NextResponse.json(transactions, { status: 200 });
      }
    } else {
      const transactions = await getAllTransactions(session.user.id);
      if (transactions) {
        return NextResponse.json(transactions, { status: 200 });
      }
    }
    return new NextResponse("Incorrect Inputs", { status: 403 });
  } catch (e) {
    console.log(e);
    return new NextResponse("No transactions found", { status: 403 });
  }
}

function getMonthNumber(month: string): number {
  const monthMap: { [key: string]: number } = {
    january: 0,
    jan: 0,
    february: 1,
    feb: 1,
    march: 2,
    mar: 2,
    april: 3,
    apr: 3,
    may: 4,
    june: 5,
    jun: 5,
    july: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    october: 9,
    oct: 9,
    november: 10,
    nov: 10,
    december: 11,
    dec: 11,
  };
  const lowerCaseMonth = month.toLowerCase();
  return monthMap[lowerCaseMonth];
}
