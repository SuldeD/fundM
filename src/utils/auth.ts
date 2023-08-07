import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function useRequireAuth() {
  const router = useRouter();
  const { data, status } = useSession();

  const privatePaths: any = [
    "/dashboard",
    "/dashboard/fund",
    "/dashboard/myfund",
    "/dashboard/myfund/list",
    "/dashboard/history",
    "/dashboard/loan",
    "/dashboard/foundation",
    "/dashboard/profile",
    "/dashboard/profile/bank",
  ];
  const publicPaths: any = [
    "/login",
    "/signup",
    "/forgot",
    "/signup/verify-phone",
    "/signup/password",
    "/signup/question",
    "/signup/transaction-password",
    "/",
    "/about-us",
    "/finance",
    "/loan",
    "/#app",
    "/#contact",
  ];
  const path = router.asPath.split("?")[0];
  if (status == "loading") {
  } else if (data?.user && !privatePaths?.includes(path)) {
    router.replace("/dashboard");
  } else if (!data && !publicPaths?.includes(path)) {
    router.replace("/");
  }
}
