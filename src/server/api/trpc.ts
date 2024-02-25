/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "../../server/auth";
import { prisma } from "../../server/db";
import { IncomingMessage } from "http";
import ws from "ws";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type CreateContextOptions = {
  session: Session | null;
  deviceId: any;
};
// const ee = new EventEmitter();
/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    deviceId: opts?.deviceId,
  };
};

// 6b76bf84-9b5a-415f-a88a-6d74e8c4e2d9

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (
  opts:
    | CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  const devId =
    process.env.NODE_ENV === "production"
      ? (req?.headers?.cookie?.match(/__Host-next-auth\.csrf-token=([^;]*)/) ||
          [])[1]
      : (req?.headers?.cookie?.match(/next-auth\.csrf-token=([^;]*)/) || [])[1];

  // 0dd1c441f9d6a65bc9871f751f95b21035f239402d160ea9e86ca0761b40183e%7Cac4d45e21869faa20dd693dff74daf134a4151e3a78df104f58c7072f83e7392

  return createInnerTRPCContext({
    session,
    deviceId: devId,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */

// const storedDeviceId = opts.ctx.req.session.deviceId; // Adjust this based on your session management

// // If not stored, generate a new device ID
// const deviceId = storedDeviceId || generateDeviceId();

// // If not stored, save the device ID to the session or database
// if (!storedDeviceId) {
//   opts.ctx.req.session.deviceId = deviceId; // Adjust this based on your session management
// }

export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
