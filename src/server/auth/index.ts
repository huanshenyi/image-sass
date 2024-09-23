import { db } from "@/server/db/db";
import {
  AuthOptions,
  getServerSession as nextAuthGetServerSession,
} from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GithubProvider from "next-auth/providers/github";
import { Adapter } from "next-auth/adapters";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // ...add more providers here
  ],
};

export function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}
