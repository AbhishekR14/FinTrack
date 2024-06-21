"use server";
import prisma from "../../../../db";
import { signupInputsSchema } from "./schema";

export async function signup(name: string, email: string, password: string) {
  try {
    const { success } = signupInputsSchema.safeParse({ name, email, password });
    if (success) {
      await prisma.users.create({
        data: {
          name,
          email,
          password,
        },
      });
      return "User created";
    }
    return "Invalid Data.";
  } catch (e) {
    return "Error while creating the user.";
  }
}
