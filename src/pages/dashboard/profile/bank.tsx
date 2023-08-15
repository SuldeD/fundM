import { Col, Modal, Row, Input, message } from "antd";
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
import InputCode from "app/components/input";
import { Loaderr } from "app/components/Loader";
import { UploadChangeParam } from "antd/lib/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

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
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  function submit(code: any) {
    setPassword(code.toString());
    addBankMutate(
      { password: code.toString(), account_num: number, bank_id: selectedBank },
      {
        onSuccess: (
          /** @type {{ request_id: any; success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: {
            success: any;
            loan_requests: import("react").SetStateAction<undefined>;
            description: any;
            request_id: any;
            confirm_code: any;
          }
        ) => {
          if (data.success) {
            setReqId(data?.request_id);
            setOpenVerifyPass(true);
            setOpen(false);
            message.success(data.description);
            message.success(data.confirm_code);
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
    if (
      imageUrl.length > 0 &&
      password.length > 0 &&
      requestId.length > 0 &&
      confirmCode.length > 0
    ) {
      addBankVerMutate(
        {
          password,
          confirm_code: confirmCode,
          photo: imageUrl,
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
  }

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="h-[40px] w-[60px]" style={{ marginTop: 8 }}>
        Upload
      </div>
    </div>
  );

  if (!data) {
    return <Loaderr />;
  } else if (!accountInfo?.bank_account?.bank_name) {
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

        <InputCode open={isOpen} onFinish={submit} setOpen={setOpen} />

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
                    onChange={(e: any) => setConfirmCode(e.target.value)}
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
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture"
                    showUploadList={false}
                    onChange={handleChange}
                    className="w-full rounded-[9px] border-[2px] border-dashed px-[20px] py-[30px] text-center"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        className="h-[60px] w-[60px]"
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </ImgCrop>
                <div>
                  Та гарын үсгээг цаасан дээр гаргацтай тод зурж зургийг дарж
                  оруулна уу” , “ААН бол захиралын гарын үсэг болон байгууллагын
                  тамгыг цаасан дээр гаргацтай тод дарж зургийг дарж оруулна уу!
                </div>
                <Col span={24}>
                  <button
                    type="submit"
                    onClick={imageUrl.length > 0 ? submitVerify : undefined}
                    className={`${stylesL["dloan-modal-verify-button"]} mt-[20px] bg-primary text-white`}
                  >
                    Баталгаажуулах
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>

        <PopupModal
          buttonClick={() => {
            setCheck(false);
            router.push("/dashboard/profile");
          }}
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
  } else {
    router.push("/dashboard/profile");
  }
}
