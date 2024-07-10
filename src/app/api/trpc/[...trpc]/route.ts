import { createContext, testRouter } from "@/utils/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getSession } from "next-auth/react";
import { NextRequest } from "next/server";

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: testRouter,
    createContext: createContext,
  });
};

export { handler as GET, handler as POST };
