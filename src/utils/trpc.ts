import { TRPCError, initTRPC } from "@trpc/server";
import { getSession } from "next-auth/react";

export async function createContext() {
  const session = await getSession();

  return {
    session,
  };
}
const t = initTRPC.context<typeof createContext>().create();

const { router, procedure } = t;

const middleware = t.middleware(async ({ ctx, next }) => {
  const start = Date.now();
  const result = await next();
  console.log(`Took ${Date.now() - start}ms`);
  return result;
});

const checkLoginMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Unauthorized",
    });
  }
  return next();
});

const logProcedure = procedure.use(middleware);
const protectedProcedure = logProcedure.use(checkLoginMiddleware);

export const testRouter = router({
  hello: logProcedure.query(({ ctx }) => {
    return {
      hello: "world",
    };
  }),
});

export type TestRouter = typeof testRouter;
