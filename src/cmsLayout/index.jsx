import { Layout } from "antd";
import SidebarRightComponent from "./SidebarRight";
import SidebarLeftComponent from "./SidebarLeft";
import { useEffect, useState } from "react";
import PopupModal from "../components/modal";
// import { useAppContext } from "@/context/appContext";
const { Content } = Layout;

// @ts-ignore
export const ProtectedLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [danStatus, setDanStatus] = useState();
  // const { updateUserInfo } = useAppContext();

  function buttonClick() {
    console.log("clicked button");
  }

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Layout>
      {danStatus == 0 && (
        <PopupModal
          open={open}
          closeModal={null}
          buttonText={"Үргэлжлүүлэх"}
          iconPath={"/images/e-mongolia"}
          customIconWidth={278}
          customDiv={null}
          closableM={"false"}
          buttonClick={buttonClick}
          text={
            "Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах салбар нэгжид хандан нээлгэнэ үү."
          }
        />
      )}
      <SidebarLeftComponent />
      <Layout>
        <Content>{children}</Content>
      </Layout>
      <SidebarRightComponent />
    </Layout>
  );
};
