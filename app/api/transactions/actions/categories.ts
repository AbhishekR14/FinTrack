"use server";

import prisma from "@/db";
import { NEXT_AUTH_CONFIG } from "@/lib/authConfig";
import { getServerSession } from "next-auth";

export async function getAllCategories() {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) return false;
    const res = await prisma.users.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        categories: true,
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

export async function editCategories(
  userId: string,
  newCategoryString: string
) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) return false;
    const res = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        categories: newCategoryString,
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
