import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useRequireAuth() {
  const router = useRouter();
  const { data, status } = useSession();

  const privatePaths: any = [
    "/dashboard",
    "/dashboard/fund",
    "/dashboard/myfund",
    "/dashboard/history",
    "/dashboard/loan",
    "/dashboard/foundation",
    "/dashboard/profile",
  ];
  const publicPaths: any = [
    "/login",
    "/signup",
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

  useEffect(() => {
    if (status == "loading") {
    } else if (data && !privatePaths?.includes(path)) {
      router.replace("/dashboard");
    } else if (!data && !publicPaths?.includes(path)) {
      router.replace("/");
    }
  }, []);
}
