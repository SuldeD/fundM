import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Tabs,
  Upload,
  Collapse,
  Typography,
  Image,
  Modal,
} from "antd";
import styles from "../../../styles/profile.module.css";
import { HeaderDashboard } from "../../../components/header";
import { useState } from "react";
import { Loaderr } from "app/components/Loader";
import { useApiContext } from "app/context/dashboardApiContext";
import { useRequireAuth } from "app/utils/auth";
import { useRouter } from "next/router";
const { Panel } = Collapse;
const { Paragraph } = Typography;

export const Profile = () => {
  const { accountInfo, data } = useApiContext();
  const router = useRouter();
  const { error } = Modal;
  useRequireAuth();

  const [editNumber, seteditNumber] = useState(accountInfo?.account?.phone);
  const [editEmail, setEditEmail] = useState(`${accountInfo?.account?.email}`);

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
                          АХ
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["profile-information-register"]}>
                          82043023
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
                    <Col span={24}>
                      <Paragraph
                        editable={{
                          // @ts-ignore
                          onChange: seteditNumber,
                          icon: (
                            <Image
                              width="100%"
                              src={"/images/edit-text.svg"}
                              preview={false}
                              alt="edit-text"
                            />
                          ),
                        }}
                        style={{
                          borderBottom: "1px solid rgba(26, 33, 85, 0.2)",
                          width: "100%",
                        }}
                      >
                        <span
                          className={styles["profile-typography-phone-number"]}
                        >
                          {editNumber}
                        </span>
                      </Paragraph>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row gutter={[0, 20]}>
                    <Col span={24}>
                      <div className={styles["profile-typography-title"]}>
                        Имэйл хаяг
                      </div>
                    </Col>
                    <Col span={24}>
                      <Paragraph
                        editable={{
                          onChange: setEditEmail,
                          icon: (
                            <Image
                              width="100%"
                              src={"/images/edit-text.svg"}
                              preview={false}
                              alt="edit-text"
                            />
                          ),
                          // @ts-ignore
                          text: { editEmail },
                        }}
                        style={{
                          borderBottom: "1px solid rgba(26, 33, 85, 0.2)",
                        }}
                      >
                        <span className={styles["profile-typography-email"]}>
                          {editEmail}
                        </span>
                      </Paragraph>
                    </Col>
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
                                Ta dans solih bol manai salbar deer ochij
                                soliulna uu!!!
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
                            Бичил Глобус ХХК
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