import { Modal } from "antd";
import { api } from "app/utils/api";
import { signOut, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface AppContext {
  myFundTabKey: string;
  setMyFundTabKey: React.Dispatch<React.SetStateAction<string>>;
  loan: any;
  publicSavingOrders: any;
  publicLoanOrders: any;
  mutate: any;
  accountInfo: any;
  data: any;
  saving: any;
  status: any;
  orders: any;
  publicAllOrders: any;
  sumLoan: any;
  sumSaving: any;
  loanReqMutate: any;
  addBankMutate: any;
  loanReqConfirmMut: any;
  helpBankList: any;
  addBankVerMutate: any;
}
const AppContext = createContext<AppContext>({} as AppContext);

export const ApiWrapper = ({ children }: any) => {
  const { error } = Modal;

  const { data } = useSession();

  const { mutate } = api.loan.reguestSearch.useMutation();
  const { mutate: loanMutate } = api.loan.loanSearch.useMutation();
  const { mutate: loanReqMutate } = api.loan.loanRequest.useMutation();
  const { mutate: loanReqConfirmMut } =
    api.loan.loanRequestConfirm.useMutation();
  const { mutate: addBankMutate } = api.loan.addBank.useMutation();
  const { mutate: addBankVerMutate } = api.loan.addBankVerify.useMutation();

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

  const order = "date";
  const order_up = "1";
  const page = "1";
  const page_size = "20";
  const filter_type = "dp";
  const [orders, setOrders] = useState();

  const [publicLoanOrders, setPublicLoanOrders] = useState<any[]>([]);
  const [publicSavingOrders, setPublicSavingOrders] = useState<any[]>([]);
  const [publicAllOrders, setPublicAllOrders] = useState<any[]>([]);
  const [accountInfo, setAccountInfo] = useState<any[]>([]);

  useEffect(() => {
    setAccountInfo(accountInfoData);
  }, [accountInfoData]);

  useEffect(() => {
    mutate(
      { order, order_up, page, page_size },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data.success) {
            setOrders(data.loan_requests);
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

    loanMutate(
      { order, order_up, page, page_size, filter_type },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data.success) {
            setPublicAllOrders(data.loan_requests);

            data?.loan_requests?.forEach((el: any) =>
              el.product_type_code == "saving"
                ? setPublicSavingOrders((prev) => [...prev, el])
                : setPublicLoanOrders((prev) => [...prev, el])
            );
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
    publicLoanOrders.forEach((/** @type {{ loan_amount: number; }} */ el) => {
      setSumLoan((prev) => prev + Number(el.loan_amount));
    });
    publicSavingOrders.forEach((/** @type {{ loan_amount: number; }} */ el) => {
      setSumSaving((prev) => prev + Number(el.loan_amount));
    });
  }, [publicLoanOrders]);

  useEffect(() => {
    loanData?.product_list.forEach(
      (
        /** @type {{ product_code: string; }} */ list: { product_code: string }
      ) =>
        // @ts-ignore
        list.product_code !== "saving" && setLoan(list)
    );
    loanData?.product_list.forEach(
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
    publicSavingOrders,
    publicLoanOrders,
    addBankMutate,
    mutate,
    accountInfo,
    data,
    saving,
    status,
    publicAllOrders,
    orders,
    loanReqConfirmMut,
    loanReqMutate,
    addBankVerMutate,
    helpBankList,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApiContext = () => useContext(AppContext);