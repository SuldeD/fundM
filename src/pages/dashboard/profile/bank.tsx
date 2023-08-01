import { Col, Modal, Row, Input, Button } from "antd";
import { HeaderDashboard } from "app/components/header";
import { useApiContext } from "app/context/dashboardApiContext";
import React, { useState } from "react";
import styles from "../../../styles/profile.module.css";
import stylesL from "../../../styles/dloan.module.css";
import { useRequireAuth } from "app/utils/auth";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useRouter } from "next/router";
import PopupModal from "app/components/modal";

export default function Bank() {
  const { helpBankList, addBankMutate, addBankVerMutate, data, accountInfo } =
    useApiContext();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenVerify, setOpenVerify] = useState<boolean>(false);
  const [isOpenVerifyPass, setOpenVerifyPass] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [requestId, setReqId] = useState<string>("");
  const [confirmCode, setConfirmCode] = useState<string>("");
  const { error } = Modal;
  const router = useRouter();
  useRequireAuth();

  const [check, setCheck] = useState<boolean>(false);

  function submit() {
    addBankMutate(
      { password, account_num: number, bank_id: selectedBank },
      {
        onSuccess: (
          /** @type {{ request_id: any; success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: {
            success: any;
            loan_requests: import("react").SetStateAction<undefined>;
            description: any;
            request_id: any;
          }
        ) => {
          if (data.success) {
            console.log(data);
            setReqId(data?.request_id);
            setOpenVerifyPass(true);
            setOpen(false);
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
            setOpen(false);
          }
        },
      }
    );
  }

  function submitVerify() {
    addBankVerMutate(
      {
        password,
        confirm_code: confirmCode,
        photo: fileList[0]?.thumbUrl,
        request_id: requestId,
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: {
            success: any;
            loan_requests: import("react").SetStateAction<undefined>;
            description: any;
          }
        ) => {
          if (data.success) {
            setOpenVerifyPass(true);
            setOpen(false);
            setCheck(true);
            router.push("/dashboard/profile");
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  }

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  if (!data) {
  } else if (accountInfo?.account?.bank) {
    router.push("/dashboard/profile");
  } else {
    return (
      <div className="h-full w-full bg-[#fff] px-[30px] py-[40px]">
        <HeaderDashboard
          title={"Банкны данс холбох"}
          subTitle={
            "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
          }
        />

        <div className={`${styles["profile-bankaccount-title"]} pb-[8px]`}>
          Банк сонгох
        </div>
        <select
          className={`w-full rounded-[12px] border-black bg-bank p-[16px]`}
          name="bank_id"
          onChange={(e) => setSelectedBank(e.target.value)}
        >
          <option value={""}>Банк сонгон уу!</option>
          {helpBankList?.bank_list.map((list: any, idx: any) => (
            <option key={`option ${idx}`} value={`${list.bank_id}`}>
              {list.bank_name}
            </option>
          ))}
        </select>
        <div
          className={`${styles["profile-bankaccount-title"]} pb-[8px] pt-[16px]`}
        >
          Дансны дугаар оруулах
        </div>
        <input
          onChange={(e) => setNumber(e.target.value)}
          name="bank_number"
          type="number"
          className="w-full rounded-[12px] border-black bg-bank p-[16px]"
        />
        <div className="mt-[40px] text-right">
          <input
            className="w-[100%] max-w-[195px] cursor-pointer rounded-[10px] bg-primary p-[8px] px-[8px] text-[14px] font-normal text-white"
            type="button"
            onClick={() => {
              selectedBank.length > 0 && number.length > 0 && setOpen(true);
            }}
            value={"Баталгаажуулах код авах"}
          />
        </div>

        <Modal
          centered
          width={378}
          title={
            <div className={stylesL["dloan-modal-verify-title"]}>
              <img
                width="50%"
                className="mx-auto"
                src={"/logo.svg"}
                alt="Header Logo"
              />
            </div>
          }
          open={isOpen}
          footer={null}
          closable={false}
        >
          <Row justify="center">
            <Col span={20}>
              <Row justify="center" gutter={[0, 20]}>
                <Col span={24}>
                  <Input.Password
                    className={stylesL["dloan-modal-verify-input"]}
                    placeholder="FundMe кодоо оруулна уу!!!"
                    // @ts-ignore
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={4}
                    autoFocus
                  />
                </Col>
                <Col span={20}>
                  <div className={stylesL["dloan-modal-content-text"]}>
                    Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах
                    салбар нэгжид хандан нээлгэнэ үү.
                  </div>
                </Col>
                <Col span={20}>
                  <Button
                    type="primary"
                    onClick={password.length > 0 ? submit : undefined}
                    className={stylesL["dloan-modal-verify-button"]}
                  >
                    Баталгаажуулах
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>

        <Modal
          centered
          width={378}
          title={
            <div className="mx-auto my-[20px] w-[50%] text-center font-raleway text-[18px] font-bold">
              Баталгаажуулах код оруулах
            </div>
          }
          closable={false}
          open={isOpenVerifyPass}
          footer={null}
        >
          <Row justify="center">
            <Col span={20}>
              <Row justify="center" gutter={[0, 20]}>
                <Col span={24}>
                  <Input.Password
                    className={stylesL["dloan-modal-verify-input"]}
                    placeholder="Гүйлгээний нууц үг оруулна уу!!!"
                    name="password"
                    maxLength={4}
                    onChange={(e) => setConfirmCode(e.target.value)}
                    autoFocus
                  />
                </Col>
                <Col span={20}>
                  <div className="text-center font-raleway text-[12px] font-normal text-sub">
                    Бид таны бүртгүүлсэн банкны дансруу нэг удаагын
                    баталгаажуулах код илгэлээ.
                  </div>
                </Col>
                <Col span={20}>
                  <button
                    type="submit"
                    className={`${stylesL["dloan-modal-verify-button"]} bg-primary text-white`}
                    onClick={() => {
                      confirmCode.length > 0 && setOpenVerify(true);
                      confirmCode.length > 0 && setOpenVerifyPass(false);
                    }}
                  >
                    Баталгаажуулах
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>

        <Modal
          centered
          width={478}
          title={
            <div className="mx-auto my-[20px] w-[50%] text-center font-raleway text-[18px] font-bold">
              Гарын үсгийн зураг оруулах
            </div>
          }
          closable={false}
          open={isOpenVerify}
          footer={null}
        >
          <Row justify="center">
            <Col span={20}>
              <Row justify="center" gutter={[0, 20]}>
                <ImgCrop rotationSlider>
                  <Upload
                    action=""
                    listType="picture"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    className="w-full rounded-[9px] border-[2px] border-dashed px-[20px] py-[30px] text-center"
                  >
                    {fileList.length < 1 &&
                      "+ Drag or drop files here or browser"}
                  </Upload>
                </ImgCrop>
                <Col span={20}>
                  <button
                    type="submit"
                    onClick={fileList.length > 0 ? submitVerify : undefined}
                    className={`${stylesL["dloan-modal-verify-button"]} bg-primary text-white`}
                  >
                    Баталгаажуулах
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>

        <PopupModal
          buttonClick={() => setCheck(false)}
          buttonText={"Хаах"}
          closableM={null}
          closeModal={null}
          customDiv={null}
          customIconWidth={null}
          iconPath={"/images/check"}
          modalWidth={null}
          open={check}
          text={<p>Таны данс амжилттай холбогдлоо.</p>}
          textAlign={"center"}
        />
      </div>
    );
  }
}
