import { Col, Modal, Row, message, Button } from "antd";
import { HeaderDashboard } from "app/components/header";
import React, { useMemo, useRef, useState } from "react";
import styles from "../../../styles/profile.module.css";
import stylesL from "../../../styles/dloan.module.css";
import { useRequireAuth } from "app/utils/auth";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useRouter } from "next/router";
import PopupModal from "app/components/modal";
import { Loaderr } from "app/components/Loader";
import { UploadChangeParam } from "antd/lib/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";
import Select from "react-select";

// const getBase64 = (img: RcFile, callback: (url: string) => void) => {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result as string));
//   reader.readAsDataURL(img);
// };

// var file = document.querySelector('#files > input[type="file"]').files[0];
// getBase64(file); // prints the base64 string

const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function Bank() {
  const router = useRouter();
  const { error } = Modal;
  const { data } = useSession();
  useRequireAuth();

  //mutates
  const { mutate: addBankMutate } = api.profile.addBank.useMutation();
  const { mutate: addBankVerMutate } = api.profile.addBankVerify.useMutation();

  //queries
  const { data: accountInfo } = api.account.accountInfo.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: helpBankList } = api.loan.helpBankList.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  //states
  const [isOpenVerify, setOpenVerify] = useState<boolean>(false);
  const [isOpenVerifyPass, setOpenVerifyPass] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [requestId, setReqId] = useState<string>("");
  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<any>("");
  const inputs = useRef<any>([]);
  useRef<(HTMLInputElement | null)[]>([]);
  const length = 4;
  const [code, setCode] = useState<any>([...Array(length)].map(() => ""));

  //functions
  function getBase64(file: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setImageUrl(reader.result?.toString());
      setLoading(false);
    };
    reader.onerror = function (error) {
      console.log(error);
    };
  }

  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: any) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    if (slot !== length - 1) {
      inputs.current[slot + 1].focus();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: any) => {
    if (e.keyCode === 8 && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = "";
      setCode(newCode);
      inputs.current[slot - 1].focus();
    }
  };

  function submit() {
    setLoadingBtn(true);
    addBankMutate(
      { account_num: number, bank_id: selectedBank },
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
            setLoadingBtn(false);
            message.success(data.description);
          } else {
            setLoadingBtn(false);
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  }

  function submitVerify() {
    if (
      imageUrl.length > 0 &&
      requestId.length > 0 &&
      code.join("").length == 4
    ) {
      setLoadingBtn(true);
      addBankVerMutate(
        {
          confirm_code: code.join(""),
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
              setLoadingBtn(false);
              setOpenVerify(false);
              setCheck(true);
            } else {
              setLoadingBtn(false);
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
      getBase64(info.file.originFileObj);
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

  const option = useMemo(() => {
    if (helpBankList?.bank_list?.length > 0) {
      return helpBankList.bank_list.map((list: any) => ({
        value: list.bank_id,
        label: list.bank_name,
      }));
    } else {
      return [];
    }
  }, [helpBankList]);

  if (!data) {
    return <Loaderr />;
  } else
    return (
      <div className="h-full w-full bg-[#fff] px-[30px] py-[40px]">
        <HeaderDashboard
          title={"Банкны данс холбох"}
          subTitle={
            "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
          }
        />

        <div className={`${styles["profile-bankaccount-title"]} mt-3 pb-[8px]`}>
          Банк сонгох
        </div>

        <Select
          defaultValue={option[0]}
          onChange={(e: any) => setSelectedBank(e.value.toString())}
          options={option}
        />

        <div
          className={`${styles["profile-bankaccount-title"]} pb-[8px] pt-[16px]`}
        >
          Дансны дугаар оруулах
        </div>
        <input
          onChange={(e) => setNumber(e.target.value)}
          name="bank_number"
          type="number"
          className="w-full rounded-[4px] border border-[#ccc] bg-white px-[10px] py-[8px] font-[14px]"
        />
        <div className="mt-[40px] text-right">
          <Button
            type="primary"
            loading={loadingBtn}
            onClick={() => {
              selectedBank.length > 0 && number.length > 0 && submit();
            }}
            className={`${stylesL["dloan-modal-verify-button"]} mt-[20px`}
          >
            Баталгаажуулах код авах
          </Button>
          {/* <input
            className="w-[100%] max-w-[195px] cursor-pointer rounded-[10px] bg-primary p-[8px] px-[8px] text-[14px] font-normal text-white"
            type="button"
            onClick={() => {
              selectedBank.length > 0 && number.length > 0 && submit();
            }}
            value={"Баталгаажуулах код авах"}
          /> */}
        </div>

        <Modal
          centered
          width={378}
          title={
            <div className="mx-auto my-[20px] w-[50%] text-center font-raleway text-[18px] font-bold">
              Баталгаажуулах код оруулах
            </div>
          }
          closable={true}
          onCancel={() => setOpenVerifyPass(false)}
          open={isOpenVerifyPass}
          footer={null}
        >
          <Row justify="center">
            <Col span={20}>
              <Row justify="center" gutter={[0, 20]}>
                <Col span={20} className="my-3 flex justify-between">
                  {code.map(
                    (
                      num: string | number | readonly string[] | undefined,
                      idx: React.Key | null | undefined
                    ) => {
                      return (
                        <input
                          key={idx}
                          type="text"
                          inputMode="numeric"
                          className="w-[40px] rounded-[9px] border border-[#1375ED] p-2 text-center"
                          maxLength={1}
                          value={num}
                          autoFocus={!code[0].length && idx === 0}
                          onChange={(e) => processInput(e, idx)}
                          onKeyUp={(e) => onKeyUp(e, idx)}
                          ref={(ref) => inputs.current.push(ref)}
                        />
                      );
                    }
                  )}
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
                      code.join("").length == 4 && setOpenVerifyPass(false);
                      code.join("").length == 4 && setOpenVerify(true);
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
          closable={true}
          onCancel={() => setOpenVerify(false)}
          open={isOpenVerify}
          footer={null}
        >
          <Row justify="center">
            <Col span={20}>
              <Row justify="center" gutter={[0, 20]}>
                {/* <ImgCrop rotationSlider> */}
                <Upload
                  beforeUpload={beforeUpload}
                  // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
                {/* </ImgCrop> */}
                <Row>
                  <p className="text-center">
                    {accountInfo?.account?.user_type == "org"
                      ? "ААН бол захиралын гарын үсэг болон байгууллагын тамгыг цаасан дээр гаргацтай тод дарж зургийг дарж оруулна уу!"
                      : " Та гарын үсгээг цаасан дээр гаргацтай тод зурж зургийг дарж  оруулна уу"}
                  </p>
                </Row>
                <Col span={24}>
                  <Button
                    type="primary"
                    loading={loadingBtn}
                    onClick={imageUrl.length > 0 ? submitVerify : undefined}
                    className={`${stylesL["dloan-modal-verify-button"]} mt-[20px`}
                  >
                    Баталгаажуулах
                  </Button>
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
}

//   else {
//     router.back();
//   }
// }
