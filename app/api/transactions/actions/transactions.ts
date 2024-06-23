"use server";

import { getServerSession } from "next-auth";
import prisma from "../../../../db";
import { NEXT_AUTH_CONFIG } from "../../../../lib/authConfig";
import { addTransactionType, updateTransactionType } from "../types";

export async function postTransaction(data: addTransactionType) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) return false;
    const res = await prisma.transactions.create({ data });
    if (res) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function putTransactions(data: updateTransactionType) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) return false;
    const res = await prisma.transactions.update({
      where: { id: data.id, userId: data.userId },
      data,
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
