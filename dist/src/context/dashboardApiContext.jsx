"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApiContext = exports.ApiWrapper = void 0;
const antd_1 = require("antd");
const api_1 = require("app/utils/api");
const react_1 = require("next-auth/react");
const react_2 = require("react");
const AppContext = (0, react_2.createContext)({});
const ApiWrapper = ({ children }) => {
    const { error } = antd_1.Modal;
    const { data } = (0, react_1.useSession)();
    const { mutate } = api_1.api.loan.reguestSearch.useMutation();
    const { mutate: loanMutate } = api_1.api.loan.loanSearch.useMutation();
    const { mutate: loanReqMutate } = api_1.api.loan.loanRequest.useMutation();
    const { mutate: loanReqConfirmMut } = api_1.api.loan.loanRequestConfirm.useMutation();
    const { mutate: addBankMutate } = api_1.api.loan.addBank.useMutation();
    const { mutate: addBankVerMutate } = api_1.api.loan.addBankVerify.useMutation();
    const { data: loanData, refetch: requestLoanList } = api_1.api.loan.loanList.useQuery(undefined, {
        enabled: false,
    });
    const { data: accountInfoData, refetch: requestInfo } = api_1.api.loan.accountInfo.useQuery(undefined, {
        enabled: false,
    });
    const { data: helpBankList, refetch: requestHelpBankList } = api_1.api.loan.helpBankList.useQuery(undefined, {
        enabled: false,
    });
    (0, react_2.useEffect)(() => {
        requestInfo();
        requestLoanList();
        requestHelpBankList();
    }, []);
    const [loan, setLoan] = (0, react_2.useState)();
    const [saving, setSaving] = (0, react_2.useState)();
    const [myFundTabKey, setMyFundTabKey] = (0, react_2.useState)("1");
    const order = "date";
    const order_up = "0";
    const page = "1";
    const page_size = "20";
    const filter_type = "dp";
    const [orders, setMyOrders] = (0, react_2.useState)([]);
    const [myLoanOrders, setMyLoanOrders] = (0, react_2.useState)([]);
    const [mySavingOrders, setMySavingOrders] = (0, react_2.useState)([]);
    const [publicLoanOrders, setPublicLoanOrders] = (0, react_2.useState)([]);
    const [publicSavingOrders, setPublicSavingOrders] = (0, react_2.useState)([]);
    const [publicAllOrders, setPublicAllOrders] = (0, react_2.useState)([]);
    const [accountInfo, setAccountInfo] = (0, react_2.useState)([]);
    (0, react_2.useEffect)(() => {
        setAccountInfo(accountInfoData);
    }, [accountInfoData]);
    (0, react_2.useEffect)(() => {
        mutate({ order, order_up, page, page_size }, {
            onSuccess: (
            /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data) => {
                var _a;
                if (data.success) {
                    setPublicAllOrders(data.loan_requests);
                    (_a = data === null || data === void 0 ? void 0 : data.loan_requests) === null || _a === void 0 ? void 0 : _a.forEach((el) => el.product_type_code == "saving"
                        ? setPublicSavingOrders((prev) => [...prev, el])
                        : setPublicLoanOrders((prev) => [...prev, el]));
                }
                else {
                    (0, react_1.signOut)();
                    error({
                        title: "Амжилтгүй",
                        content: <div>{(data === null || data === void 0 ? void 0 : data.description) || null}</div>,
                    });
                }
            },
        });
        loanMutate({ order, order_up, page, page_size, filter_type }, {
            onSuccess: (
            /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data) => {
                var _a;
                if (data.success) {
                    setMyOrders(data.loan_requests);
                    (_a = data === null || data === void 0 ? void 0 : data.loan_requests) === null || _a === void 0 ? void 0 : _a.forEach((el) => el.product_type_code == "saving"
                        ? setMySavingOrders((prev) => [...prev, el])
                        : setMyLoanOrders((prev) => [...prev, el]));
                }
                else {
                    (0, react_1.signOut)();
                    error({
                        title: "Амжилтгүй",
                        content: <div>{(data === null || data === void 0 ? void 0 : data.description) || null}</div>,
                    });
                }
            },
        });
    }, []);
    const [sumLoan, setSumLoan] = (0, react_2.useState)(0);
    const [sumSaving, setSumSaving] = (0, react_2.useState)(0);
    (0, react_2.useEffect)(() => {
        publicLoanOrders.forEach((/** @type {{ loan_amount: number; }} */ el) => {
            setSumLoan((prev) => prev + Number(el.loan_amount));
        });
        publicSavingOrders.forEach((/** @type {{ loan_amount: number; }} */ el) => {
            setSumSaving((prev) => prev + Number(el.loan_amount));
        });
    }, [publicLoanOrders]);
    const [sumMyLoan, setMySumLoan] = (0, react_2.useState)(0);
    const [sumMySaving, setMySumSaving] = (0, react_2.useState)(0);
    (0, react_2.useEffect)(() => {
        myLoanOrders.forEach((/** @type {{ loan_amount: number; }} */ el) => {
            setMySumLoan((prev) => prev + Number(el.loan_amount));
        });
        mySavingOrders.forEach((/** @type {{ loan_amount: number; }} */ el) => {
            setMySumSaving((prev) => prev + Number(el.loan_amount));
        });
    }, [myLoanOrders]);
    (0, react_2.useEffect)(() => {
        loanData === null || loanData === void 0 ? void 0 : loanData.product_list.forEach((
        /** @type {{ product_code: string; }} */ list) => 
        // @ts-ignore
        list.product_code !== "saving" && setLoan(list));
        loanData === null || loanData === void 0 ? void 0 : loanData.product_list.forEach((
        /** @type {{ product_code: string; }} */ list) => 
        // @ts-ignore
        list.product_code == "saving" && setSaving(list));
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
        mySavingOrders,
        myLoanOrders,
        sumMyLoan,
        sumMySaving,
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
exports.ApiWrapper = ApiWrapper;
const useApiContext = () => (0, react_2.useContext)(AppContext);
exports.useApiContext = useApiContext;
