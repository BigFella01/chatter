import prisma from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import github from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  debug: true
});


