import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import prisma from "../db/index";
import { signupInputsSchema } from "@/api/user/actions/schema";

export const NEXT_AUTH_CONFIG = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const user = await prisma.users.findFirst({
          where: {
            email: credentials.email,
            password: credentials.password,
          },
        });

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GIT_ID || "",
      clientSecret: process.env.GIT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        const res = await prisma.users.findFirst({
          where: { email: user.email },
        });
        if (res) {
          token.sub = res.id;
        } else {
          const data = {
            name: user.name,
            email: user.email,
            password: "Logged In Via Google/Github",
          };
          const success = signupInputsSchema.safeParse(data);
          if (success) {
            const res = await prisma.users.create({
              data: data,
            });
            if (res) {
              token.sub = res.id;
            }
          }
        }
      }
      return token;
    },
    session: ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
