import { Button, Checkbox, Col, Form, Layout, Modal, Row } from "antd";
import SidebarRightComponent from "./SidebarRight";
import SidebarLeftComponent from "./SidebarLeft";
import PopupModal from "../components/modal";
import { useRequireAuth } from "app/utils/auth";
import { Loaderr } from "app/components/Loader";
import styles from "../styles/foundation.module.css";
import { useSession } from "next-auth/react";
import { ApiWrapper } from "app/context/dashboardApiContext";
import { api } from "app/utils/api";
import { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";
const { Content } = Layout;

export const ProtectedLayout = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [html, setHtml] = useState<any>();
  const { error } = Modal;

  const [form] = Form.useForm();
  const { status } = useSession();

  const { data: statusData, refetch: requestStatus } =
    api.loan.accountStatus.useQuery(undefined, {
      enabled: false,
    });

  const { data: dan, refetch: requestDan } = api.loan.accountStatusDan.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const { mutate: getContent } = api.loan.getContent.useMutation();

  useEffect(() => {
    requestStatus();
    requestDan();
  }, []);

  useRequireAuth();
  if (status == "loading") {
    return <Loaderr />;
  }

  function buttonClick() {
    window.open(dan?.https_redirect, "_blank");
  }

  const toggleChecked = () => {
    setChecked(!checked);
  };

  const handleOk = async () => {
    await form.validateFields();
    toggleChecked();
    setIsModalOpen(false);
    setOpen(true);
  };

  useEffect(() => {
    getContent(
      {
        code: "term_of_services",
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            setHtml(sanitizeHtml(data?.page_html));
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  }, []);

  return (
    <Layout>
      <ApiWrapper>
        <PopupModal
          modalWidth={"70%"}
          open={statusData?.stat?.valid_dan == 0 && isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          buttonText={null}
          iconPath={null}
          customIconWidth={null}
          customDiv={
            <div className="border-b border-black font-beau text-[16px] font-normal text-black">
              ҮЙЛЧИЛГЭЭНИЙ ЕРӨНХИЙ НӨХЦӨЛ
            </div>
          }
          closableM={"true"}
          textAlign={"start"}
          buttonClick={buttonClick}
          text={
            <>
              {html && html}
              <Form form={form}>
                <Row justify="center">
                  <Col span={24}>
                    <Form.Item
                      name="agreement"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error(
                                    "Та үйлчилгээний нөхцөл зөвшөөрөөгүй байна."
                                  )
                                ),
                        },
                      ]}
                    >
                      <Checkbox>
                        <div className={styles["foundation-checkbox-text"]}>
                          Зээлийн үйлчилгээний нөхцөл
                        </div>
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col flex="none">
                        <Button
                          className={styles["foundation-button-back"]}
                          onClick={() => setIsModalOpen(false)}
                        >
                          <div
                            className={styles["foundation-button-back-text"]}
                          >
                            Буцах
                          </div>
                        </Button>
                      </Col>
                      <Col flex="none">
                        <Form.Item>
                          <Button
                            type="primary"
                            className={`${styles["foundation-button-contiune"]} bg-primary`}
                            onClick={handleOk}
                            htmlType="submit"
                          >
                            Үргэлжлүүлэх
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </>
          }
        />
        {!isModalOpen && (
          <PopupModal
            modalWidth={null}
            textAlign={null}
            open={open}
            closeModal={() => setOpen(false)}
            buttonText={"Үргэлжлүүлэх"}
            iconPath={"/images/e-mongolia"}
            customIconWidth={278}
            customDiv={null}
            closableM={"true"}
            buttonClick={buttonClick}
            text={
              "Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах салбар нэгжид хандан нээлгэнэ үү."
            }
          />
        )}
        <SidebarLeftComponent />
        <Layout>
          <Content>{children}</Content>
        </Layout>
        <SidebarRightComponent statusData={statusData} />
      </ApiWrapper>
    </Layout>
  );
};
