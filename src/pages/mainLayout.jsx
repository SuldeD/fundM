import { Loaderr } from "app/components/Loader";
import { useRequireAuth } from "app/utils/auth";
import { useSession } from "next-auth/react";
import { ProtectedLayout } from "../cmsLayout";
import SimpleLayout from "../layout";

// @ts-ignore
const MainLayout = ({ children }) => {
  const { data, status } = useSession();
  useRequireAuth();

  const Layout = data?.user ? ProtectedLayout : SimpleLayout;
  if (status == "loading") {
    return <Loaderr />;
  }
  return <Layout>{children}</Layout>;
};

export default MainLayout;
