import { getServerSession } from "@/server/auth";
import { TRPCError, initTRPC } from "@trpc/server";

// export async function createContext() {
//   const session = await getSession();

//   return {
//     session,
//   };
// }
const t = initTRPC.context().create();

const { router, procedure } = t;

// const middleware = t.middleware(async ({ ctx, next }) => {
//   const start = Date.now();
//   const result = await next();
//   return result;
// });

// const checkLoginMiddleware = t.middleware(async ({ ctx, next }) => {
//   if (!ctx.session?.user) {
//     throw new TRPCError({
//       code: "FORBIDDEN",
//       message: "Unauthorized",
//     });
//   }
//   return next();
// });

// const logProcedure = procedure.use(middleware);

export const withLoggerProcedure = procedure.use(async ({ ctx, next }) => {
  const start = Date.now();
  const result = await next();
  return result;
});

export const withSessionMiddleware = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession();
  console.log(session);
  return next({
    ctx: {
      session,
    },
  });
});

export const protectedProcedure = withLoggerProcedure
  .use(withSessionMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }
    return next({
      ctx: {
        session: ctx.session!,
      },
    });
  });

export { router };
