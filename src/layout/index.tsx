import { Layout } from "antd";
import FooterComponent from "./Footer";
import HeaderComponent from "./Header";
import { useAppContext } from "app/context/appContext";
const { Content } = Layout;

const SimpleLayout = ({ children }: any) => {
  const { contextHolder } = useAppContext();
  return (
    <Layout>
      <HeaderComponent />
      <Content>
        {contextHolder}
        {children}
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default SimpleLayout;
