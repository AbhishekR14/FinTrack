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

export async function deleteTransaction(userId: string, id: string) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) return false;
    const res = await prisma.transactions.delete({
      where: { id: id, userId: userId },
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

export async function getAllTransactions(userId: string) {
  try {
    const res = await prisma.transactions.findMany({
      where: { userId: userId },
      select: {
        id: true,
        userId: true,
        amount: true,
        date: true,
        category: true,
        type: true,
        note: true,
      },
      orderBy: { date: "desc" },
    });
    if (res) {
      return res;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getAllTransactionsByYear(userId: string, year: number) {
  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    const res = await prisma.transactions.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        id: true,
        userId: true,
        amount: true,
        date: true,
        category: true,
        type: true,
        note: true,
      },
      orderBy: { date: "desc" },
    });
    if (res) {
      return res;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getAllTransactionsByMonth(
  userId: string,
  year: number,
  month: number
) {
  try {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);
    const res = await prisma.transactions.findMany({
      where: { userId: userId, date: { gte: startDate, lt: endDate } },
      select: {
        id: true,
        userId: true,
        amount: true,
        date: true,
        category: true,
        type: true,
        note: true,
      },
      orderBy: { date: "desc" },
    });
    if (res) {
      return res;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}
