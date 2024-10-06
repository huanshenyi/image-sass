import { db } from "@/server/db/db";
import {
  AuthOptions,
  DefaultSession,
  getServerSession as nextAuthGetServerSession,
} from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GithubProvider from "next-auth/providers/github";
import { Adapter } from "next-auth/adapters";

// DefaultSessionの拡張
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db) as Adapter,
  callbacks: {
    async session({ session, token: { sub } }) {
      if (session.user && sub) {
        session.user.id = sub as string; // トークンからIDを取得してセッションに設定
      }
      return session;
    },
  },
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
