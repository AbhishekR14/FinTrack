import { NextRequest, NextResponse } from "next/server";
import { NEXT_AUTH_CONFIG } from "../../../lib/authConfig";
import { getServerSession } from "next-auth";
import {
  getAllTransactions,
  getAllTransactionsByMonth,
} from "./actions/transactions";
import { getMonthNumber } from "@/lib/misc";

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
