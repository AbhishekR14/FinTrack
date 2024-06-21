"use server";
import prisma from "../../../../db";

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