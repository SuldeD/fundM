import { Layout } from "antd";
import { Loaderr } from "app/components/Loader";
import { useRequireAuth } from "app/utils/auth";
import { useSession } from "next-auth/react";
import FooterComponent from "./Footer";
import HeaderComponent from "./Header";
const { Content } = Layout;

// @ts-ignore
const SimpleLayout = ({ children }) => {
  const { status } = useSession();
  // useRequireAuth();
  // if (status == "loading") {
  //   return <Loaderr />;
  // }

  return (
    <Layout>
      <HeaderComponent />
      <Content>{children}</Content>
      <FooterComponent />
    </Layout>
  );
};

export default SimpleLayout;
