import { exampleRouter } from "app/server/api/routers/example";
import { createTRPCRouter } from "app/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { loanRouter } from "./routers/loan";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  posts: postsRouter,
  loan: loanRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
