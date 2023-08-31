import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Tabs,
  Upload,
  Collapse,
  Modal,
  Button,
  Input,
  message,
} from "antd";
import styles from "../../../styles/profile.module.css";
import ImgCrop from "antd-img-crop";
import { HeaderDashboard } from "../../../components/header";
import { useMemo, useRef, useState } from "react";
import { Loaderr } from "app/components/Loader";
import { useRequireAuth } from "app/utils/auth";
import { useRouter } from "next/router";
import stylesL from "../../../styles/dloan.module.css";
import { api } from "app/utils/api";
import InputCode from "app/components/input";
import type { RcFile } from "antd/es/upload/interface";
import { useSession } from "next-auth/react";
import PopupModal from "app/components/modal";
const { Panel } = Collapse;

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

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const Profile = () => {
  const { data } = useSession();
  const router = useRouter();
  const { error, warning } = Modal;
  useRequireAuth();

  //mutates
  const { mutate: addEmail } = api.profile.addEmail.useMutation();
  const { mutate: changePhone } = api.profile.changePhone.useMutation();
  const { mutate: changePhoneConfirm } =
    api.profile.changePhoneConfirm.useMutation();
  const { mutate } = api.profile.changePass.useMutation();
  const { mutate: fundMutate } = api.profile.changePassFund.useMutation();
  const { mutate: forgotTransPass } = api.profile.forgotTransPass.useMutation();
  const { mutate: forgotTransPassConfirm } =
    api.profile.forgotTransPassConfirm.useMutation();
  const { mutate: addBankVerMutate } = api.profile.addBankVerify.useMutation();

  //queries
  const { data: accountInfo } = api.account.accountInfo.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: dan } = api.account.accountStatusDan.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: statusData } = api.account.accountStatus.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: loanSearch } = api.loan.loanSearch.useQuery(
    {
      order: "date",
      order_up: "1",
      page: "1",
      page_size: "1",
      filter_type: "contract",
    },
    { refetchOnWindowFocus: false }
  );

  const loanReq = useMemo(() => {
    return loanSearch?.loan_requests;
  }, [loanSearch]);

  let request_id = -1;
  loanReq?.forEach((ln: any) => {
    if (ln?.is_status == "3" && ln?.IsActive == "-7") {
      return (request_id = ln?.request_id);
    }
  });

  //states
  const [open, setOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenVerifyPass, setIsOpenVerifyPass] = useState<boolean>(false);
  const [forgotId, setForgotId] = useState<string>("");
  const [editNumber, setEditNumber] = useState<string>(
    accountInfo?.account?.phone
  );
  const [editEmail, setEditEmail] = useState<string>(
    accountInfo?.account?.email
  );
  const [loginPassPrev, setLoginPassPrev] = useState<string>("");
  const [loginPassNew, setLoginPassNew] = useState<string>("");
  const [loginPassNewVer, setLoginPassNewVer] = useState<string>("");
  const [fundPassPrev, setFundPassPrev] = useState<string>("");
  const [fundPassNew, setFundPassNew] = useState<string>("");
  const [fundPassNewVer, setFundPassNewVer] = useState<string>("");
  const [clickedEdit, setClickedEdit] = useState<number>();
  const [changeId, setChangeId] = useState<string>("");
  const [formToken, setFormToken] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenVerify, setOpenVerify] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const inputs = useRef<any>([]);
  useRef<(HTMLInputElement | null)[]>([]);
  const length = 4;
  const [code, setCode] = useState<any>([...Array(length)].map(() => ""));

  //functions
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

  const onChange = (key: any) => {};
  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url: any) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  function validate(num: any) {
    setClickedEdit(num);
    setOpen(true);
  }

  function handleOk() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (clickedEdit == 0) {
      if (editNumber.length == 8) {
        setIsOpen(true);
      } else {
        warning({
          title: "Амжилтгүй",
          content: <div>Хүчинтэй утасны дугаар оруулна уу !</div>,
        });
      }
    } else if (clickedEdit == 1) {
      if (emailRegex.test(editEmail) == false) {
        warning({
          title: "Амжилтгүй",
          content: <div>Зөв имэйл хаяг оруулана уу!!!</div>,
        });
      } else {
        setIsOpen(true);
      }
    }
  }

  function submit(code: any) {
    clickedEdit == 0
      ? changePhone(
          { phone: editNumber, password: code.toString() },
          {
            onSuccess: (
              /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
            ) => {
              if (data.success) {
                setEditNumber("");
                setIsOpen(false);
                setOpen(false);
                setIsOpenVerifyPass(true);
                setChangeId(data.change_phone_id);
                setFormToken(data.form_token);
                message.success(data.description);
              } else {
                error({
                  title: "Амжилтгүй",
                  content: <div>{data?.description || null}</div>,
                });
              }
            },
          }
        )
      : addEmail(
          { email: editEmail, password: code.toString() },
          {
            onSuccess: (
              /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
            ) => {
              if (data.success) {
                setEditEmail("");
                setIsOpen(false);
                setOpen(false);
                message.success(data.description);
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

  function verifyPass() {
    changePhoneConfirm(
      {
        form_token: formToken,
        change_phone_id: changeId,
        pin_code: code.join(""),
      },
      {
        onSuccess: async (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
        ) => {
          if (data.success) {
            setIsOpenVerifyPass(false);
            setChangeId("");
            setFormToken("");
            setCode("");
            message.success(data?.description);
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

  function handleOkPanel2() {
    const hasUppercase = /[A-Z]/.test(loginPassNewVer);
    const hasLowercase = /[a-z]/.test(loginPassNewVer);
    const hasNumber = /[0-9]/.test(loginPassNewVer);
    if (clickedEdit == 2) {
      if (
        loginPassPrev.length <= 0 ||
        loginPassNew.length <= 0 ||
        loginPassNewVer.length <= 0
      ) {
        return warning({
          title: "Амжилтгүй",
          content: (
            <div>Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэх ёстой.</div>
          ),
        });
      } else if (loginPassNew != loginPassNewVer) {
        return warning({
          title: "Амжилтгүй",
          content: <div>Нэвтрэх нууц үгийг адилхан оруулна уу </div>,
        });
      } else if (!hasUppercase || !hasLowercase || !hasNumber) {
        return warning({
          title: "Амжилтгүй",
          content: (
            <div>
              Нууц үг нь дор хаяж нэг том, нэг жижиг үсэг бас нэг тоо агуулсан
              байх ёстой.
            </div>
          ),
        });
      } else {
        return mutate(
          { old_password: loginPassPrev, new_password: loginPassNewVer },
          {
            onSuccess: (
              /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
            ) => {
              if (data.success) {
                setLoginPassPrev("");
                setLoginPassNew("");
                setLoginPassNewVer("");
                setOpen(false);
                message.success(data.description);
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

    if (clickedEdit == 3) {
      if (
        fundPassPrev.length <= 0 ||
        fundPassNew.length <= 0 ||
        fundPassNewVer.length <= 0
      ) {
        return warning({
          title: "Амжилтгүй",
          content: <div>FundMe код нь 4 тооноос бүрдэх ястой.</div>,
        });
      } else if (fundPassNew !== fundPassNewVer) {
        return warning({
          title: "Амжилтгүй",
          content: <div>FundMe код адилхан оруулна уу</div>,
        });
      } else {
        fundMutate(
          { old_password: fundPassPrev, new_password: fundPassNewVer },
          {
            onSuccess: (
              /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
            ) => {
              if (data.success) {
                setFundPassPrev("");
                setFundPassNew("");
                setFundPassNewVer("");
                setOpen(false);
                message.success(data.description);
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
  }

  function handleOkForgotTrans() {
    if (clickedEdit == 4) {
      if (fundPassNew.length <= 0 || fundPassNewVer.length <= 0) {
        return warning({
          title: "Амжилтгүй",
          content: <div>FundMe код нь 4 тооноос бүрдэх ястой.</div>,
        });
      } else if (fundPassNew !== fundPassNewVer) {
        return warning({
          title: "Амжилтгүй",
          content: <div>FundMe код адилхан оруулна уу</div>,
        });
      } else {
        forgotTransPass(
          {
            register: accountInfo?.account?.register,
            username: accountInfo?.account?.first_name,
          },
          {
            onSuccess: (
              /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
            ) => {
              if (data.success) {
                setForgotId(data?.forgot_id);
                setOpen(false);
                setIsOpenVerifyPass(true);
                message.success(data.description);
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
  }

  function verifyTransPass() {
    forgotTransPassConfirm(
      {
        register: accountInfo?.account?.register,
        username: accountInfo?.account?.first_name,
        forgot_id: forgotId,
        new_password: fundPassNewVer,
        pin_code: code.join(""),
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
        ) => {
          if (data.success) {
            setFundPassNew("");
            setIsOpenVerifyPass(false);
            setFundPassNew("");
            setFundPassNewVer("");
            message.success(data.description);
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

  function submitVerify() {
    if (imageUrl.length > 0 && request_id > -1 && code.join("").length == 4) {
      setLoadingBtn(true);
      addBankVerMutate(
        {
          confirm_code: code.join(""),
          photo: imageUrl,
          request_id: request_id.toString(),
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

  const items = [
    {
      key: "1",
      label: (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
          }}
        >
          Миний мэдээлэл
        </div>
      ),

      children: (
        <Col span={24}>
          <Row gutter={[0, 20]}>
            <Col span={18}>
              <Row justify="space-between" align="middle" gutter={[0, 20]}>
                <Col flex="none">
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader  overflow-hidden"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="avatar"
                          className="h-[100%] w-[100%] "
                        />
                        <img
                          src="/images/camera.svg"
                          className="absolute right-[-10px] top-0 z-50 rounded-[50%] bg-white p-1"
                          alt="cemera"
                        />
                      </div>
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Col>
                <Col flex="none">
                  <Row gutter={[32, 4]}>
                    <Col span={24}>
                      <div className={styles["profile-bankaccount-title"]}>
                        {accountInfo?.account?.user_type == "org"
                          ? "Захиралын нэр"
                          : "Овог"}
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className={styles["profile-information-name"]}>
                        {accountInfo?.account?.last_name
                          ? accountInfo?.account?.last_name
                          : "."}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col flex="none">
                  <Row gutter={[0, 4]}>
                    <Col span={24}>
                      <div className={styles["profile-bankaccount-title"]}>
                        {accountInfo?.account?.user_type == "org"
                          ? "Байгууллагын нэр"
                          : "Нэр"}
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className={styles["profile-information-name"]}>
                        {accountInfo?.account?.first_name
                          ? accountInfo?.account?.first_name
                          : "."}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col flex="none">
                  <Row gutter={[0, 4]}>
                    <Col span={24}>
                      <div className={styles["profile-bankaccount-title"]}>
                        {accountInfo?.account?.user_type == "org"
                          ? "Байгууллагын регисирын дугаар"
                          : "Регисирын дугаар"}
                      </div>
                    </Col>
                    {accountInfo?.account?.user_type == "org" ? (
                      <div className={styles["profile-information-register"]}>
                        {accountInfo?.account?.register
                          ? accountInfo?.account?.register
                          : "."}
                      </div>
                    ) : (
                      <Row gutter={5}>
                        <Col flex="none">
                          <div className={styles["profile-information-name"]}>
                            {accountInfo?.account?.register
                              ? accountInfo?.account?.register.slice(0, 2)
                              : "."}
                          </div>
                        </Col>
                        <Col flex="none">
                          <div
                            className={styles["profile-information-register"]}
                          >
                            {accountInfo?.account?.register
                              ? accountInfo?.account?.register.slice(2, 10)
                              : "."}
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={20}>
              <Row justify="space-between" wrap={true}>
                <Col span={12}>
                  <Row gutter={[0, 20]}>
                    <Col span={24}>
                      <div className={styles["profile-typography-title"]}>
                        {accountInfo?.account?.user_type == "org"
                          ? "Байгууллагын утасны дугаар"
                          : "Утасны дугаар"}
                      </div>
                    </Col>
                    <div className="relative bg-[#fff]">
                      <input
                        type="text"
                        disabled
                        defaultValue={accountInfo?.account?.phone}
                        className="w-[160px] overflow-hidden border-b border-[#000] bg-[#fff] pe-[25px] ps-[5px]"
                      />
                      <img
                        className="absolute right-1 top-0 w-[20px] cursor-pointer"
                        src={"/images/edit-text.svg"}
                        alt="edit-text"
                        onClick={() => validate(0)}
                      />
                    </div>
                  </Row>
                </Col>
                <Col md={12}>
                  <Row gutter={[0, 20]}>
                    <Col span={24}>
                      <div className={styles["profile-typography-title"]}>
                        {accountInfo?.account?.user_type == "org"
                          ? "Байгууллагын имэйл хаяг"
                          : "Имэйл хаяг"}
                      </div>
                    </Col>
                    <div className="relative bg-[#fff]">
                      <input
                        type="text"
                        disabled
                        defaultValue={accountInfo?.account?.email}
                        className="w-[160px] overflow-hidden border-b border-[#000] bg-[#fff] pe-[25px] ps-[5px]"
                      />
                      <img
                        className="absolute right-1 top-0 w-[20px] cursor-pointer"
                        src={"/images/edit-text.svg"}
                        alt="edit-text"
                        onClick={() => validate(1)}
                      />
                    </div>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              {statusData?.stat?.valid_dan == 0 && (
                <Row gutter={[0, 13]} className="mb-[10px]">
                  <Col flex="auto">
                    <div className={styles["profile-bankaccount-title"]}>
                      E-mongolia холбох
                    </div>
                  </Col>
                  <Col flex="right">
                    <div
                      className="cursor-pointer font-raleway text-[12px] font-normal text-primary hover:text-[#524ffd]"
                      onClick={() => {
                        window.open(dan?.https_redirect, "_blank");
                      }}
                    >
                      E-mongolia холбох +
                    </div>
                  </Col>
                </Row>
              )}
              <Row gutter={[0, 13]}>
                <Col flex="auto">
                  <div className={styles["profile-bankaccount-title"]}>
                    Дансны мэдээлэл
                  </div>
                </Col>
                <Col flex="right">
                  <div
                    className="cursor-pointer font-raleway text-[12px] font-normal text-primary hover:text-[#524ffd]"
                    onClick={() => {
                      !accountInfo?.bank_account
                        ? router.push("/dashboard/profile/bank")
                        : accountInfo?.bank_account?.is_verify == 1
                        ? warning({
                            title: "Амжилтгүй",
                            content: (
                              <div>
                                Та данс солих бол манай салбар дээр ирж солино
                                уу !!!
                              </div>
                            ),
                            onOk() {},
                          })
                        : setIsOpenVerifyPass(true);
                    }}
                  >
                    {accountInfo?.bank_account?.is_verify == 0
                      ? "Данс баталгаажуулах +"
                      : "Данс холбох +"}
                  </div>
                </Col>
                <Col span={24}>
                  <Row
                    justify="space-between"
                    className={styles["profile-bankaccount-div"]}
                  >
                    <Col flex="none" className="my-1">
                      <Row gutter={10} align="middle">
                        <Col flex="none">
                          <div className={styles["profile-bankaccount-title"]}>
                            Банк:
                          </div>
                        </Col>
                        <Col flex="none">
                          <div className={styles["profile-backaccount-value"]}>
                            {accountInfo?.bank_account &&
                              accountInfo?.bank_account?.bank_name}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col flex="none" className="my-1">
                      <Row gutter={10} align="middle">
                        <Col flex="none">
                          <div className={styles["profile-bankaccount-title"]}>
                            Дансны дугаар:
                          </div>
                        </Col>
                        <Col flex="none">
                          <div className={styles["profile-backaccount-value"]}>
                            {accountInfo?.bank_account &&
                              accountInfo?.bank_account?.account_num}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col flex="none" className="my-1">
                      <Row gutter={10} align="middle">
                        <Col flex="none">
                          <div className={styles["profile-bankaccount-title"]}>
                            Дансны нэр:
                          </div>
                        </Col>
                        <Col flex="none">
                          <div className={styles["profile-backaccount-value"]}>
                            {accountInfo?.bank_account?.account_name
                              ? accountInfo?.bank_account?.account_name
                              : "."}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      ),
    },
    {
      key: "2",
      label: "Нууцлал",
      children: (
        <Col span={24}>
          <div className="block">
            <button
              onClick={() => validate(2)}
              className={`${styles["profile-tabs-2-collapse-title"]} flex w-full justify-between border-b px-3 py-[10px] text-start`}
            >
              <div>Нэвтрэх нууц үг солих</div>
              <svg width="25px" height="25px" viewBox="0 0 32 32" version="1.1">
                <g id="icomoon-ignore"></g>
                <path
                  d="M19.159 16.767l0.754-0.754-6.035-6.035-0.754 0.754 5.281 5.281-5.256 5.256 0.754 0.754 3.013-3.013z"
                  fill="#000000"
                ></path>
              </svg>
            </button>
            <button
              onClick={() => validate(3)}
              className={`${styles["profile-tabs-2-collapse-title"]} flex w-full justify-between border-b px-3 py-[10px] text-start`}
            >
              <div>Fund me код солих</div>
              <svg width="25px" height="25px" viewBox="0 0 32 32" version="1.1">
                <g id="icomoon-ignore"></g>
                <path
                  d="M19.159 16.767l0.754-0.754-6.035-6.035-0.754 0.754 5.281 5.281-5.256 5.256 0.754 0.754 3.013-3.013z"
                  fill="#000000"
                ></path>
              </svg>
            </button>
            <button
              className={`${styles["profile-tabs-2-collapse-title"]} flex w-full justify-between border-b px-3 py-[10px] text-start`}
              onClick={() => validate(4)}
            >
              <div>Fund me код шинээр үүсгэх</div>
              <svg width="25px" height="25px" viewBox="0 0 32 32" version="1.1">
                <g id="icomoon-ignore"></g>
                <path
                  d="M19.159 16.767l0.754-0.754-6.035-6.035-0.754 0.754 5.281 5.281-5.256 5.256 0.754 0.754 3.013-3.013z"
                  fill="#000000"
                ></path>
              </svg>
            </button>
          </div>
        </Col>
      ),
    },
    {
      key: "3",
      label: "Тусламж",
      children: (
        <Col span={24}>
          <Collapse
            onChange={onChange}
            bordered={false}
            expandIconPosition="end"
          >
            <Panel
              header={
                <div className={styles["profile-tabs-2-collapse-title"]}>
                  Fund me биржийг хэрхэн ашиглаж эхлэх вэ?
                </div>
              }
              key="1"
            >
              <p>adasd</p>
            </Panel>
            <Panel
              header={
                <div className={styles["profile-tabs-2-collapse-title"]}>
                  Хэрхэн зээл авах вэ?
                </div>
              }
              key="2"
            >
              <p>asdasd</p>
            </Panel>
            <Panel
              header={
                <div className={styles["profile-tabs-2-collapse-title"]}>
                  Хэрхэн санхүүжилт авах вэ?
                </div>
              }
              key="3"
            >
              <Col span={24}>
                <Row justify="end" gutter={[0, 10]}>
                  <Col
                    span={22}
                    className={styles["profile-collapse-content-border"]}
                  >
                    <div className={styles["profile-collapse-content-text"]}>
                      Зээлийн эрх хэрхэн тогтоолгох вэ?
                    </div>
                  </Col>
                  <Col
                    span={22}
                    className={styles["profile-collapse-content-border"]}
                  >
                    <div className={styles["profile-collapse-content-text"]}>
                      Зээл авах заавар
                    </div>
                  </Col>
                  <Col
                    span={22}
                    className={styles["profile-collapse-content-border"]}
                  >
                    <div className={styles["profile-collapse-content-text"]}>
                      Авсан зээлээ хэрхэн эргэн төлөх вэ?
                    </div>
                  </Col>
                  <Col
                    span={22}
                    className={styles["profile-collapse-content-border"]}
                  >
                    <div className={styles["profile-collapse-content-text"]}>
                      Авсан санхүүжилтээ сунгах заавар
                    </div>
                  </Col>
                </Row>
              </Col>
            </Panel>
            <Panel
              header={
                <div className={styles["profile-tabs-2-collapse-title"]}>
                  Хувийн мэдээллээ хэрхэн шинэчлэх вэ?
                </div>
              }
              key="4"
            >
              <p>asdasd</p>
            </Panel>
          </Collapse>
        </Col>
      ),
    },
    {
      key: "4",
      label: "Үйлчилгээний нөхцөл",
      children: (
        <Col span={24}>
          <Collapse
            onChange={onChange}
            bordered={false}
            expandIconPosition="end"
            background-color="#FFF"
          >
            <Panel
              header={
                <div className={styles["profile-tabs-2-collapse-title"]}>
                  Нэвтрэх нууц үг солих
                </div>
              }
              key="1"
            >
              <p>adasd</p>
            </Panel>
            <Panel
              header={
                <div className={styles["profile-tabs-2-collapse-title"]}>
                  Fund me код солих
                </div>
              }
              key="2"
            >
              <p>asdasd</p>
            </Panel>
            <Panel
              header={
                <div className={styles["profile-tabs-2-collapse-title"]}>
                  Fund me код сэргээх
                </div>
              }
              key="3"
            >
              <p>asdasd</p>
            </Panel>
            <Panel
              header={
                <div className={styles["profile-tabs-2-collapse-title"]}>
                  Fund Me нууцлалын горим
                </div>
              }
              key="4"
            >
              <p>asdasd</p>
            </Panel>
          </Collapse>
        </Col>
      ),
    },
  ];

  if (!data) {
    return <Loaderr />;
  } else {
    return (
      <Row justify="center" className={styles["profile-main-row"]}>
        <Modal
          title={
            clickedEdit == 0
              ? "Утасны дугаар өөрчлөх"
              : clickedEdit == 1
              ? "Имэйл хаяг өөрчлөх"
              : clickedEdit == 2
              ? "Нэвтрэх нууц үг солих"
              : clickedEdit == 3
              ? "Fund me код солих"
              : clickedEdit == 4 && "Fund me код шинээр үүсгэх"
          }
          centered
          open={open}
          width={378}
          closeIcon={false}
          footer={[
            <div className="flex justify-between">
              <Button
                className="w-[158px] cursor-pointer rounded-[20px] border bg-[#fff] text-center text-[#000]"
                onClick={() => {
                  setOpen(false);
                  setCode([...Array(length)].map(() => ""));
                  setEditEmail("");
                  setLoginPassPrev("");
                  setLoginPassNew("");
                  setFundPassPrev("");
                  setFundPassNewVer("");
                  setLoginPassNewVer("");
                  setFundPassNew("");
                }}
              >
                Хаах
              </Button>

              <Button
                className="w-[168px] rounded-[20px] bg-primary font-raleway text-[#fff]"
                type="primary"
                onClick={
                  clickedEdit == 0
                    ? handleOk
                    : clickedEdit == 4
                    ? handleOkForgotTrans
                    : clickedEdit == 1
                    ? handleOk
                    : handleOkPanel2
                }
              >
                {clickedEdit == 0
                  ? "Үргэлжлүүлэх"
                  : clickedEdit == 4
                  ? "Үргэлжлүүлэх"
                  : clickedEdit == 1
                  ? "Үргэлжлүүлэх"
                  : "Хадгалах"}
              </Button>
            </div>,
          ]}
          onCancel={() => {
            setOpen(false);
            setCode([...Array(length)].map(() => ""));
            setEditEmail("");
            setLoginPassPrev("");
            setLoginPassNew("");
            setFundPassPrev("");
            setFundPassNewVer("");
            setLoginPassNewVer("");
            setFundPassNew("");
          }}
        >
          {clickedEdit == 2 && (
            <div className="mt-5">
              <label className="text-sm font-normal text-black text-opacity-50">
                Одоогын нууц үг оруулах
              </label>{" "}
              <Input.Password
                className="mb-5 w-full rounded-[9px] border px-2 py-1"
                value={loginPassPrev}
                onChange={(e) => setLoginPassPrev(e.target.value)}
              />
            </div>
          )}
          {clickedEdit == 2 && (
            <div>
              <label className="text-sm font-normal text-black text-opacity-50">
                Шинэ нууц үг оруулах
              </label>
              <Input.Password
                className="mb-5 w-full rounded-[9px] border px-2 py-1"
                value={loginPassNew}
                onChange={(e) => setLoginPassNew(e.target.value)}
              />
            </div>
          )}
          {clickedEdit == 2 && (
            <div>
              <label className="text-sm font-normal text-black text-opacity-50">
                Шинэ нууц үг дахин оруулах
              </label>
              <Input.Password
                className=" w-full rounded-[9px] border px-2 py-1"
                value={loginPassNewVer}
                onChange={(e) => setLoginPassNewVer(e.target.value)}
              />
            </div>
          )}
          {clickedEdit == 3 && (
            <div className="mt-5">
              <label className="text-sm font-normal text-black text-opacity-50">
                Одоогын FundMe код оруулах
              </label>{" "}
              <Input.Password
                className="mb-5 w-full rounded-[9px] border px-2 py-1"
                value={fundPassPrev}
                maxLength={4}
                onChange={(e) => setFundPassPrev(e.target.value)}
              />
            </div>
          )}
          {clickedEdit == 3 && (
            <div>
              <label className="text-sm font-normal text-black text-opacity-50">
                Шинэ FundMe код оруулах
              </label>
              <Input.Password
                className="mb-5 w-full rounded-[9px] border px-2 py-1"
                value={fundPassNew}
                maxLength={4}
                onChange={(e) => setFundPassNew(e.target.value)}
              />
            </div>
          )}
          {clickedEdit == 3 && (
            <div>
              <label className="text-sm font-normal text-black text-opacity-50">
                Шинэ FundMe код дахин оруулах
              </label>
              <Input.Password
                className=" w-full rounded-[9px] border px-2 py-1"
                value={fundPassNewVer}
                maxLength={4}
                onChange={(e) => setFundPassNewVer(e.target.value)}
              />
            </div>
          )}
          {clickedEdit == 0 && (
            <Input
              className="my-5 w-full rounded-[9px] border px-2 py-1"
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value)}
            />
          )}
          {clickedEdit == 1 && (
            <Input
              className="my-5 w-full rounded-[9px] border px-2 py-1"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          )}

          {clickedEdit == 4 && (
            <div className="mt-5">
              <label className="text-sm font-normal text-black text-opacity-50">
                Шинэ FundMe код оруулах
              </label>
              <Input.Password
                className="mb-5 w-full rounded-[9px] border px-2 py-1"
                value={fundPassNew}
                maxLength={4}
                onChange={(e) => setFundPassNew(e.target.value)}
              />
            </div>
          )}
          {clickedEdit == 4 && (
            <div>
              <label className="text-sm font-normal text-black text-opacity-50">
                Шинэ FundMe код дахин оруулах
              </label>
              <Input.Password
                className="mb-[20px] w-full rounded-[9px] border px-2 py-1"
                value={fundPassNewVer}
                maxLength={4}
                onChange={(e) => setFundPassNewVer(e.target.value)}
              />
            </div>
          )}
          <p className="font-sub mx-auto mb-[40px] w-[60%] text-center font-raleway text-[12px] font-normal">
            {clickedEdit == 0
              ? "Та өөрийн шинээр бүртгүүлэх утасны дугаараа оруулна уу."
              : clickedEdit == 4
              ? "Та өөрийн FundMe код оруулж зээл авах хүсэлтээ баталгаажуулна уу."
              : clickedEdit == 1
              ? "Та өөрийн шинээр бүртгүүлэх имэйл хаяг оруулна уу."
              : ""}
          </p>
        </Modal>

        <InputCode open={isOpen} onFinish={submit} setOpen={setIsOpen} />

        <Modal
          centered
          width={378}
          title={
            <div className="mx-auto my-[20px] w-[50%] text-center font-raleway text-[18px] font-bold">
              Баталгаажуулах код оруулах
            </div>
          }
          closable={true}
          onCancel={() => setIsOpenVerifyPass(false)}
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
                    onClick={() =>
                      code.join("").length == 4
                        ? clickedEdit
                          ? clickedEdit == 0
                            ? verifyPass()
                            : verifyTransPass()
                          : setOpenVerify(true)
                        : error({
                            title: "Амжилтгүй",
                            content: (
                              <div>Хүчинтэй утасны дугаар оруулна уу !</div>
                            ),
                          })
                    }
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
                <ImgCrop rotationSlider>
                  <Upload
                    beforeUpload={beforeUpload}
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
            setIsOpenVerifyPass(false);
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

        <Col span={22}>
          <Row gutter={[0, 20]}>
            <HeaderDashboard
              title={"Миний мэдээлэл"}
              subTitle={
                "Та банкны мэдээллээ өөрчлөх бол манай байгууллагын таньд ойрхон салбарт хандана уу."
              }
            />
            <Col span={24}>
              <Tabs defaultActiveKey="1" items={items} tabBarGutter={0} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
};

export default Profile;
