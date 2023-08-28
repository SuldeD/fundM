import { useRequireAuth } from "app/utils/auth";
import { usePathname } from "next/navigation";
import { ProtectedLayout } from "../cmsLayout";
import SimpleLayout from "../layout";

const MainLayout = ({ children }: any) => {
  const path = usePathname();
  useRequireAuth();

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
  const Layout = privatePaths.includes(path) ? ProtectedLayout : SimpleLayout;

  return <Layout>{children}</Layout>;
};

export default MainLayout;
