"use server";
import prisma from "../../../../db";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../../lib/authConfig";

async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session;
}

export async function signup(name: string, email: string, password: string) {
  try {
    await prisma.users.create({
      data: {
        name,
        email,
        password,
      },
    });
    return "User created";
  } catch (e) {
    return "Error while creating the user.";
  }
}