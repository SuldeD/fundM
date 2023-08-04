import { Modal } from "antd";
import { api } from "app/utils/api";
import { signOut, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface AppContext {
  myFundTabKey: string;
  setMyFundTabKey: React.Dispatch<React.SetStateAction<string>>;
  loan: any;
  sumLoan: any;
  sumSaving: any;

  activeSavingOrders: any;
  activeLoanOrders: any;
  addBankMutate: any;

  accountInfo: any;
  data: any;
  changePhone: any;
  saving: any;

  loanReqConfirmMut: any;
  loanReqMutate: any;
  addBankVerMutate: any;
  helpBankList: any;

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
  const { mutate: addBankMutate } = api.loan.addBank.useMutation();
  const { mutate: addBankVerMutate } = api.loan.addBankVerify.useMutation();
  const { mutate: addEmail } = api.loan.addEmail.useMutation();
  const { mutate: changePhone } = api.loan.changePhone.useMutation();
  const { mutate: changePhoneConfirm } =
    api.loan.changePhoneConfirm.useMutation();

  const { data: loanData, refetch: requestLoanList } =
    api.loan.loanList.useQuery(undefined, {
      enabled: false,
    });

  const { data: accountInfoData, refetch: requestInfo } =
    api.loan.accountInfo.useQuery(undefined, {
      enabled: false,
    });

  const { data: helpBankList, refetch: requestHelpBankList } =
    api.loan.helpBankList.useQuery(undefined, {
      enabled: false,
    });

  useEffect(() => {
    requestInfo();
    requestLoanList();
    requestHelpBankList();
  }, []);

  const [loan, setLoan] = useState();
  const [saving, setSaving] = useState();
  const [myFundTabKey, setMyFundTabKey] = useState("1");

  const [activeLoanOrders, setActiveLoanOrders] = useState<any[]>([]);
  const [activeSavingOrders, setActiveSavingOrders] = useState<any[]>([]);

  const [accountInfo, setAccountInfo] = useState<any[]>([]);

  useEffect(() => {
    setAccountInfo(accountInfoData);
  }, [accountInfoData]);

  useEffect(() => {
    mutate(
      {
        order: "date",
        order_up: "1",
        page: "1",
        page_size: "1",
        filter_type: "active",
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            data?.requests?.forEach((el: any) => {
              if (el.is_my_request == "0") {
                if (el.request_type == "wallet") {
                  setActiveLoanOrders((prev) => [...prev, el]);
                } else if (el.request_type == "saving") {
                  setActiveSavingOrders((prev) => [...prev, el]);
                }
              }
            });
          } else {
            signOut();
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  }, []);

  const [sumLoan, setSumLoan] = useState(0);
  const [sumSaving, setSumSaving] = useState(0);

  useEffect(() => {
    activeLoanOrders.forEach((/** @type {{ loan_amount: number; }} */ el) => {
      setSumLoan((prev) => prev + Number(el.loan_amount));
    });
    activeSavingOrders.forEach((/** @type {{ loan_amount: number; }} */ el) => {
      setSumSaving((prev) => prev + Number(el.loan_amount));
    });
  }, [activeSavingOrders]);

  useEffect(() => {
    loanData?.product_list?.forEach(
      (
        /** @type {{ product_code: string; }} */ list: { product_code: string }
      ) =>
        // @ts-ignore
        list.product_code !== "saving" && setLoan(list)
    );
    loanData?.product_list?.forEach(
      (
        /** @type {{ product_code: string; }} */ list: { product_code: string }
      ) =>
        // @ts-ignore
        list.product_code == "saving" && setSaving(list)
    );
  }, [loanData]);

  const value = {
    myFundTabKey,
    setMyFundTabKey,
    loan,
    sumLoan,
    sumSaving,

    activeSavingOrders,
    activeLoanOrders,
    addBankMutate,

    accountInfo,
    data,
    changePhone,
    saving,

    loanReqConfirmMut,
    loanReqMutate,
    addBankVerMutate,
    helpBankList,

    changePhoneConfirm,
    addEmail,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApiContext = () => useContext(AppContext);
