import { message } from "antd";
import { createContext, useContext, useState } from "react";

interface AppContext {
  myFundTabKey: string;
  setMyFundTabKey: React.Dispatch<React.SetStateAction<string>>;
  success: any;
  contextHolder: any;
}
const AppContext = createContext<AppContext>({} as AppContext);

export const AppWrapper = ({ children }: any) => {
  const [myFundTabKey, setMyFundTabKey] = useState("1");

  const [messageApi, contextHolder] = message.useMessage();

  const success = (message: any) => {
    messageApi.open({
      type: "success",
      content: message,
      duration: 6,
      style: {
        marginTop: "80px",
      },
    });
  };

  const value = {
    myFundTabKey,
    setMyFundTabKey,
    contextHolder,
    success,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
