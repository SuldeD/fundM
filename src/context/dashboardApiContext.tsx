import { Modal } from "antd";
import { api } from "app/utils/api";
import { signOut, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface AppContext {
  myFundTabKey: string;
  setMyFundTabKey: React.Dispatch<React.SetStateAction<string>>;

  addBankMutate: any;
  data: any;
  changePhone: any;

  loanReqConfirmMut: any;
  loanReqMutate: any;
  addBankVerMutate: any;

  changePhoneConfirm: any;
  addEmail: any;
}

const AppContext = createContext<AppContext>({} as AppContext);

export const ApiWrapper = ({ children }: any) => {
  const { error } = Modal;

  const { data } = useSession();

  const { mutate } = api.loan.reguestSearch.useMutation();
  const { mutate: loanReqMutate } = api.loan.loanRequest.useMutation();
  const { mutate: loanReqConfirmMut } =
    api.loan.loanRequestConfirm.useMutation();
  const { mutate: addBankMutate } = api.profile.addBank.useMutation();
  const { mutate: addBankVerMutate } = api.profile.addBankVerify.useMutation();
  const { mutate: addEmail } = api.profile.addEmail.useMutation();
  const { mutate: changePhone } = api.profile.changePhone.useMutation();
  const { mutate: changePhoneConfirm } =
    api.profile.changePhoneConfirm.useMutation();

  const [myFundTabKey, setMyFundTabKey] = useState("1");

  const value = {
    myFundTabKey,
    setMyFundTabKey,

    addBankMutate,

    data,
    changePhone,

    loanReqConfirmMut,
    loanReqMutate,
    addBankVerMutate,

    changePhoneConfirm,
    addEmail,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApiContext = () => useContext(AppContext);
