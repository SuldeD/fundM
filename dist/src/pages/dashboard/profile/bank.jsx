"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const antd_1 = require("antd");
const header_1 = require("app/components/header");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const react_1 = __importStar(require("react"));
const profile_module_css_1 = __importDefault(require("../../../styles/profile.module.css"));
const dloan_module_css_1 = __importDefault(require("../../../styles/dloan.module.css"));
const auth_1 = require("app/utils/auth");
const antd_2 = require("antd");
const antd_img_crop_1 = __importDefault(require("antd-img-crop"));
const router_1 = require("next/router");
function Bank() {
    const { helpBankList, addBankMutate, addBankVerMutate, data, accountInfo } = (0, dashboardApiContext_1.useApiContext)();
    const [isOpen, setOpen] = (0, react_1.useState)(false);
    const [isOpenVerify, setOpenVerify] = (0, react_1.useState)(false);
    const [isOpenVerifyPass, setOpenVerifyPass] = (0, react_1.useState)(false);
    const [selectedBank, setSelectedBank] = (0, react_1.useState)("");
    const [number, setNumber] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [requestId, setReqId] = (0, react_1.useState)("");
    const [confirmCode, setConfirmCode] = (0, react_1.useState)("");
    const { error } = antd_1.Modal;
    const router = (0, router_1.useRouter)();
    (0, auth_1.useRequireAuth)();
    function submit() {
        addBankMutate({ password, account_num: number, bank_id: selectedBank }, {
            onSuccess: (
            /** @type {{ request_id: any; success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data) => {
                if (data.success) {
                    console.log(data);
                    setReqId(data === null || data === void 0 ? void 0 : data.request_id);
                    setOpenVerifyPass(true);
                    setOpen(false);
                }
                else {
                    error({
                        title: "Амжилтгүй",
                        content: <div>{(data === null || data === void 0 ? void 0 : data.description) || null}</div>,
                    });
                    setOpen(false);
                }
            },
        });
    }
    function submitVerify() {
        var _a;
        addBankVerMutate({
            password,
            confirm_code: confirmCode,
            photo: (_a = fileList[0]) === null || _a === void 0 ? void 0 : _a.thumbUrl,
            request_id: requestId,
        }, {
            onSuccess: (
            /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data) => {
                if (data.success) {
                    console.log(data);
                    setOpenVerifyPass(true);
                    setOpen(false);
                }
                else {
                    error({
                        title: "Амжилтгүй",
                        content: <div>{(data === null || data === void 0 ? void 0 : data.description) || null}</div>,
                    });
                }
            },
        });
    }
    const [fileList, setFileList] = (0, react_1.useState)([]);
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow === null || imgWindow === void 0 ? void 0 : imgWindow.document.write(image.outerHTML);
    };
    if (accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.bank_account) {
        router.push("/dashboard/profile");
    }
    else {
        return (<div className="h-full w-full bg-[#fff] px-[30px] py-[40px]">
        <header_1.HeaderDashboard title={"Банкны данс холбох"} subTitle={"Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."}/>

        <div className={`${profile_module_css_1.default["profile-bankaccount-title"]} pb-[8px]`}>
          Банк сонгох
        </div>
        <select className={`w-full rounded-[12px] border-black bg-bank p-[16px]`} name="bank_id" onChange={(e) => setSelectedBank(e.target.value)}>
          <option value={""}>Банк сонгон уу!</option>
          {helpBankList === null || helpBankList === void 0 ? void 0 : helpBankList.bank_list.map((list, idx) => (<option key={`option ${idx}`} value={`${list.bank_id}`}>
              {list.bank_name}
            </option>))}
        </select>
        <div className={`${profile_module_css_1.default["profile-bankaccount-title"]} pb-[8px] pt-[16px]`}>
          Дансны дугаар оруулах
        </div>
        <input onChange={(e) => setNumber(e.target.value)} name="bank_number" type="number" className="w-full rounded-[12px] border-black bg-bank p-[16px]"/>
        <div className="mt-[40px] text-right">
          <input className="w-[100%] max-w-[195px] cursor-pointer rounded-[10px] bg-primary p-[8px] px-[8px] text-[14px] font-normal text-white" type="button" onClick={() => {
                selectedBank.length > 0 && number.length > 0 && setOpen(true);
            }} value={"Баталгаажуулах код авах"}/>
        </div>

        <antd_1.Modal centered width={378} title={<div className={dloan_module_css_1.default["dloan-modal-verify-title"]}>
              <img width="50%" className="mx-auto" src={"/logo.svg"} alt="Header Logo"/>
            </div>} open={isOpen} footer={null} closable={false}>
          <antd_1.Row justify="center">
            <antd_1.Col span={20}>
              <antd_1.Row justify="center" gutter={[0, 20]}>
                <antd_1.Col span={24}>
                  <antd_1.Input.Password className={dloan_module_css_1.default["dloan-modal-verify-input"]} placeholder="FundMe кодоо оруулна уу!!!" 
        // @ts-ignore
        onChange={(e) => setPassword(e.target.value)} maxLength={4} autoFocus/>
                </antd_1.Col>
                <antd_1.Col span={20}>
                  <div className={dloan_module_css_1.default["dloan-modal-content-text"]}>
                    Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах
                    салбар нэгжид хандан нээлгэнэ үү.
                  </div>
                </antd_1.Col>
                <antd_1.Col span={20}>
                  <antd_1.Button type="primary" onClick={password.length > 0 ? submit : undefined} className={dloan_module_css_1.default["dloan-modal-verify-button"]}>
                    Баталгаажуулах
                  </antd_1.Button>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Modal>

        <antd_1.Modal centered width={378} title={<div className="mx-auto my-[20px] w-[50%] text-center font-raleway text-[18px] font-bold">
              Баталгаажуулах код оруулах
            </div>} closable={false} open={isOpenVerifyPass} footer={null}>
          <antd_1.Row justify="center">
            <antd_1.Col span={20}>
              <antd_1.Row justify="center" gutter={[0, 20]}>
                <antd_1.Col span={24}>
                  <antd_1.Input.Password className={dloan_module_css_1.default["dloan-modal-verify-input"]} placeholder="Гүйлгээний нууц үг оруулна уу!!!" name="password" maxLength={4} onChange={(e) => setConfirmCode(e.target.value)} autoFocus/>
                </antd_1.Col>
                <antd_1.Col span={20}>
                  <div className="text-center font-raleway text-[12px] font-normal text-sub">
                    Бид таны бүртгүүлсэн банкны дансруу нэг удаагын
                    баталгаажуулах код илгэлээ.
                  </div>
                </antd_1.Col>
                <antd_1.Col span={20}>
                  <button type="submit" className={`${dloan_module_css_1.default["dloan-modal-verify-button"]} bg-primary text-white`} onClick={() => {
                confirmCode.length > 0 && setOpenVerify(true);
                confirmCode.length > 0 && setOpenVerifyPass(false);
            }}>
                    Баталгаажуулах
                  </button>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Modal>

        <antd_1.Modal centered width={478} title={<div className="mx-auto my-[20px] w-[50%] text-center font-raleway text-[18px] font-bold">
              Гарын үсгийн зураг оруулах
            </div>} closable={false} open={isOpenVerify} footer={null}>
          <antd_1.Row justify="center">
            <antd_1.Col span={20}>
              <antd_1.Row justify="center" gutter={[0, 20]}>
                <antd_img_crop_1.default rotationSlider>
                  <antd_2.Upload action="" listType="picture" fileList={fileList} onChange={onChange} onPreview={onPreview} className="w-full rounded-[9px] border-[2px] border-dashed px-[20px] py-[30px] text-center">
                    {fileList.length < 1 &&
                "+ Drag or drop files here or browser"}
                  </antd_2.Upload>
                </antd_img_crop_1.default>
                <antd_1.Col span={20}>
                  <button type="submit" onClick={fileList.length > 0 ? submitVerify : undefined} className={`${dloan_module_css_1.default["dloan-modal-verify-button"]} bg-primary text-white`}>
                    Баталгаажуулах
                  </button>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Modal>
      </div>);
    }
}
exports.default = Bank;
