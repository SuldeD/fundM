import { Layout } from "antd";
import FooterComponent from "./Footer";
import HeaderComponent from "./Header";
const { Content } = Layout;

const SimpleLayout = ({ children }) => {
  return (
    <Layout>
      <HeaderComponent />
      <Content>{children}</Content>
      <FooterComponent />
    </Layout>
  );
};

export default SimpleLayout;
