import { createNextApiHandler } from "@trpc/server/adapters/next";
import { useAppContext } from "app/context/appContext";
import { appRouter } from "app/server/api/root";
import { createTRPCContext } from "app/server/api/trpc";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
        // const {setUnaut} = useAppContext()
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
          // error.message === "UNAUTHORIZED" && setUnaut(true)
        }
      : undefined,
});
