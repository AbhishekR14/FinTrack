import NextAuth from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../../lib/authConfig";

const handler = NextAuth(NEXT_AUTH_CONFIG);

export { handler as GET, handler as POST };
