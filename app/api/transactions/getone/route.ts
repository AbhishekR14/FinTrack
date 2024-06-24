import { NextRequest, NextResponse } from "next/server";
import { NEXT_AUTH_CONFIG } from "../../../../lib/authConfig";
import { getServerSession } from "next-auth";
import prisma from "../../../../db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const res = await prisma.transactions.findFirst({
        where: { userId: session.user.id, id: id },
      });
      if (res) {
        return new NextResponse(JSON.stringify(res), { status: 200 });
      }
    }
    return new NextResponse("Please provide a valid transaction id", {
      status: 403,
    });
  } catch (e) {
    console.log(e);
    return new NextResponse("No transaction found", { status: 403 });
  }
}
