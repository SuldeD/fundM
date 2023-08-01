import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Row, Col, Tabs, Upload, Collapse, Modal, Button, Input } from "antd";
import styles from "../../../styles/profile.module.css";
import { HeaderDashboard } from "../../../components/header";
import { useState } from "react";
import { Loaderr } from "app/components/Loader";
import { useApiContext } from "app/context/dashboardApiContext";
import { useRequireAuth } from "app/utils/auth";
import { useRouter } from "next/router";
import stylesL from "../../../styles/dloan.module.css";
const { Panel } = Collapse;

export const Profile = () => {
  const { accountInfo, data, addEmail, changePhone, changePhoneConfirm } =
    useApiContext();
  const router = useRouter();
  const { error } = Modal;
  useRequireAuth();

  const [open, setOpen] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenVerifyPass, setIsOpenVerifyPass] = useState<boolean>(false);

  const [editNumber, setEditNumber] = useState(accountInfo?.account?.phone);
  const [editEmail, setEditEmail] = useState(`${accountInfo?.account?.email}`);
  const [password, setPassword] = useState<any>("");
  const [confirmCode, setConfirmCode] = useState<any>("");
  const [clickedEdit, setClickedEdit] = useState<any>();
  const [changeId, setChangeId] = useState<any>("");
  const [formToken, setFormToken] = useState<any>();

  // @ts-ignore
  const onChange = (key) => {};
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  // @ts-ignore
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      // @ts-ignore
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      // @ts-ignore
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  // @ts-ignore
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      // @ts-ignore
      getBase64(info.file.originFileObj, (url) => {
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
        error({
          title: "Амжилтгүй",
          content: <div>Хүчинтэй утасны дугаар оруулна уу !</div>,
        });
      }
    } else if (clickedEdit == 1) {
      if (emailRegex.test(editEmail) == false) {
        error({
          title: "Амжилтгүй",
          content: <div>Zow email oruulna uu!!!</div>,
        });
      } else {
        setIsOpen(true);
      }
    }
  }

  function submit() {
    clickedEdit == 0
      ? changePhone(
          { phone: editNumber, password: password },
          {
            onSuccess: (
              /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
            ) => {
              if (data.success) {
                setPassword("");
                setEditNumber("");
                setIsOpen(false);
                setOpen(false);
                setIsOpenVerifyPass(true);
                setChangeId(data.change_phone_id);
                setFormToken(data.form_token);
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
          { email: editEmail, password: password },
          {
            onSuccess: (
              /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
            ) => {
              if (data.success) {
                setPassword("");
                setEditEmail("");
                setIsOpen(false);
                setOpen(false);
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
        pin_code: confirmCode,
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data: any
        ) => {
          if (data.success) {
            console.log(data);
            setIsOpenVerifyPass(false);
            setChangeId("");
            setFormToken("");
            setConfirmCode("");
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );

    console.log("A");
  }

  const items = [
    {
      key: "1",
      label: "Миний мэдээлэл",
      children: (
        <Col span={24}>
          <Row gutter={[0, 20]}>
            <Col span={18}>
              <Row justify="space-between" align="middle" gutter={[0, 20]}>
                <Col flex="none">
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                          width: "100%",
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Col>
                <Col flex="none">
                  <Row gutter={[0, 4]}>
                    <Col span={24}>
                      <div className={styles["profile-bankaccount-title"]}>
                        Овог
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
                        Нэр
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
                        Регисирын дугаар
                      </div>
                    </Col>
                    <Row gutter={5}>
                      <Col flex="none">
                        <div className={styles["profile-information-name"]}>
                          {accountInfo?.account?.register
                            ? accountInfo?.account?.register.slice(0, 2)
                            : "."}
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["profile-information-register"]}>
                          {accountInfo?.account?.register
                            ? accountInfo?.account?.register.slice(2, 10)
                            : "."}
                        </div>
                      </Col>
                    </Row>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={20}>
              <Row justify="space-between">
                <Col span={8}>
                  <Row gutter={[0, 20]}>
                    <Col span={24}>
                      <div className={styles["profile-typography-title"]}>
                        Утасны дугаар
                      </div>
                    </Col>
                    <div className="relative bg-[#fff]">
                      <input
                        type="text"
                        disabled
                        defaultValue={
                          editNumber ? editNumber : accountInfo?.account?.phone
                        }
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
                <Col span={12}>
                  <Row gutter={[0, 20]}>
                    <Col span={24}>
                      <div className={styles["profile-typography-title"]}>
                        Имэйл хаяг
                      </div>
                    </Col>
                    <div className="relative bg-[#fff]">
                      <input
                        type="text"
                        disabled
                        defaultValue={
                          editEmail ? editEmail : accountInfo?.account?.email
                        }
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
              <Row gutter={[0, 13]}>
                <Col flex="auto">
                  <div className={styles["profile-bankaccount-title"]}>
                    Дансны мэдээлэл
                  </div>
                </Col>
                <Col flex="right">
                  <div
                    className="cursor-pointer font-lato text-[12px] font-normal text-primary hover:text-[#524ffd]"
                    onClick={() => {
                      !accountInfo.bank_account
                        ? router.push("/dashboard/profile/bank")
                        : error({
                            title: "Амжилтгүй",
                            content: (
                              <div>
                                Та данс солих бол манай салбар дээр ирж солино
                                уу !!!
                              </div>
                            ),
                          });
                    }}
                  >
                    Данс холбох +
                  </div>
                </Col>
                <Col span={24}>
                  <Row
                    justify="space-between"
                    className={styles["profile-bankaccount-div"]}
                  >
                    <Col flex="none">
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
                    <Col flex="none">
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
                    <Col flex="none">
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
          <Collapse
            onChange={onChange}
            bordered={false}
            expandIconPosition="end"
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
            clickedEdit == 0 ? "Утасны дугаар өөрчлөх" : "Имэйл хаяг өөрчлөх"
          }
          centered
          open={open}
          width={378}
          footer={[
            <div className="flex justify-between">
              <Button
                className="w-[158px] cursor-pointer rounded-[20px] border bg-[#fff] text-center text-[#000]"
                onClick={() => setOpen(false)}
              >
                Хаах
              </Button>

              <Button
                className="w-[168px] rounded-[20px] bg-primary text-[#fff]"
                type="primary"
                onClick={handleOk}
              >
                Үргэлжлүүлэх
              </Button>
            </div>,
          ]}
          onCancel={() => setOpen(false)}
        >
          <Input
            className="my-5 w-full rounded-[9px] border px-2 py-1"
            defaultValue={clickedEdit == 0 ? editNumber : editEmail}
            onChange={(e) =>
              clickedEdit == 0
                ? setEditNumber(e.target.value)
                : setEditEmail(e.target.value)
            }
          />
          <p className="font-sub mx-auto mb-[40px] w-[60%] text-center font-raleway text-[12px] font-normal">
            {clickedEdit == 0
              ? "Та өөрийн шинээр бүртгүүлэх утасны дугаараа оруулна уу."
              : "Та өөрийн шинээр бүртгүүлэх имэйл хаяг оруулна уу."}
          </p>
        </Modal>

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
                    onClick={() =>
                      confirmCode.length > 0
                        ? verifyPass()
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
