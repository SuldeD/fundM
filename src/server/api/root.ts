import { exampleRouter } from "../../server/api/routers/example";
import { createTRPCRouter } from "../../server/api/trpc";
import { postsRouter } from "./routers/posts";
import { loanRouter } from "./routers/loan";
import { registerRouter } from "./routers/register";
import { accountRouter } from "./routers/account";
import { otherRouter } from "./routers/other";
import { termRouter } from "./routers/term";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  posts: postsRouter,
  loan: loanRouter,
  register: registerRouter,
  account: accountRouter,
  other: otherRouter,
  term: termRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
