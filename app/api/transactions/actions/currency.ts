"use server";

import prisma from "@/db";
import { NEXT_AUTH_CONFIG } from "@/lib/authConfig";
import { getServerSession } from "next-auth";

export async function getCurrency() {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session.user) return false;
    const res = await prisma.users.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        currency: true,
      },
    });
    if (res) {
      return res;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function setCurrency(userId: string, newCurrency: string) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session.user) return false;
    const res = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        currency: newCurrency,
      },
    });
    if (res) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}
