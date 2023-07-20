import { createContext, useContext, useState } from "react";

interface AppContext {
  myFundTabKey: string;
  setMyFundTabKey: React.Dispatch<React.SetStateAction<string>>;
}
const AppContext = createContext<AppContext>({} as AppContext);

export const AppWrapper = ({ children }: any) => {
  const [myFundTabKey, setMyFundTabKey] = useState("1");

  const value = {
    myFundTabKey,
    setMyFundTabKey,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
