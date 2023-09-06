import { useRequireAuth } from "app/utils/auth";
import { usePathname } from "next/navigation";
import { ProtectedLayout } from "../cmsLayout";
import SimpleLayout from "../layout";
import { useAppContext } from "app/context/appContext";

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

  const { contextHolder } = useAppContext();
  return (
    <Layout>
      {contextHolder}
      {children}
    </Layout>
  );
};

export default MainLayout;
