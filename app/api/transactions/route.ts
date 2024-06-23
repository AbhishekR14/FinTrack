import { NextResponse } from "next/server";
import { NEXT_AUTH_CONFIG } from "../../../lib/authConfig";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (session) {
    return new NextResponse("Authorized", { status: 401 });
  }
  return new NextResponse("Unauthorized", { status: 401 });
}
