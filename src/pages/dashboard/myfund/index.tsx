import { Row, Col, Tabs, Table, Image, Button } from "antd";
import styles from "../../../styles/my-fund.module.css";
import stylesList from "../../../styles/dashboard.module.css";
import stylesDL from "../../../styles/dloan.module.css";
import stylesFD from "../../../styles/foundation.module.css";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { useAppContext } from "../../../context/appContext";
import { useRequireAuth } from "app/utils/auth";
import { useApiContext } from "app/context/dashboardApiContext";
import { useState } from "react";

export const MyFund = () => {
  const { myFundTabKey, setMyFundTabKey } = useAppContext();
  const { myLoanOrders, mySavingOrders, sumMyLoan, sumMySaving, orders } =
    useApiContext();
  useRequireAuth();
  const [activeClass, setSelectedId] = useState<any>();

  const columns = [
    {
      title: "Дараалал",
      dataIndex: "IsActive",
      key: "IsActive",
      align: "center",
      width: "6%",
      // @ts-ignore
      render: (id) => (
        <div className={styles["myfund-tabs-content-table-id"]}>{id}</div>
      ),
    },
    {
      title: "Зээлийн хэмжээ",
      dataIndex: "loan_amount",
      key: "loan_amount",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (loanTotal) => (
        <div className={styles["myfund-tabs-content-table-number"]}>
          {numberToCurrency(loanTotal)}
        </div>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "product_type_code",
      key: "product_type_code",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (product_type_code) =>
        product_type_code == "saving" ? (
          <div className={stylesList["dashboard-list-item-type-2"]}>
            Өгөх хүсэлт
          </div>
        ) : (
          <div className={stylesList["dashboard-list-item-type-1"]}>
            Авах хүсэлт
          </div>
        ),
    },
    {
      title: "Хүү",
      dataIndex: "loan_rate_month",
      key: "loan_rate_month",
      align: "center",
      width: "15%",
      // @ts-ignore
      render: (rate) => (
        <div className={styles["myfund-tabs-content-table-number"]}>{rate}</div>
      ),
    },
    {
      title: "Биелэлт",
      dataIndex: "completion",
      key: "completion",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (completion) => (
        <div className={styles["myfund-tabs-content-table-number"]}>
          {completion}
        </div>
      ),
    },
    {
      title: " ",
      dataIndex: "request_id",
      key: "request_id",
      width: "10%",
      align: "center",
      // @ts-ignore
      render: (request_id) => (
        <Image
          width={25}
          src={"/images/info-icon.png"}
          preview={false}
          alt="Information"
          className="cursor-pointer"
          onClick={() => {
            setSelectedId(request_id);
          }}
        />
      ),
    },
  ];
  const data = [
    {
      id: 5,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "1.5 %",
      completion: "0 %",
      icon: " ",
    },
  ];

  const items = [
    {
      key: "1",
      label: "Зээл авах хүсэлт",
      children: (
        <Col span={24}>
          <Row
            gutter={[0, 30]}
            justify="space-between"
            className={styles["myfund-tabs-content-border"]}
          >
            <Col flex="none">
              <div className={styles["myfund-tabs-content-title"]}>
                Оруулсан хүсэлтийн хэмжээ
              </div>
              <div className={styles["myfund-tabs-1-content-money"]}>
                {numberToCurrency(sumMyLoan)}
              </div>
            </Col>
            <Col flex="none">
              <div className={styles["myfund-tabs-content-title"]}>
                Биржийн хүү
              </div>
              <div className={styles["myfund-tabs-content-rate"]}>
                {myLoanOrders && myLoanOrders[0]?.loan_rate_month} %
              </div>
            </Col>
            <Col flex="none">
              <div className={styles["myfund-tabs-content-title"]}>Биелэлт</div>
              <div className={styles["myfund-tabs-content-rate"]}>80 %</div>
            </Col>
            <Col flex="none">
              <div className={styles["myfund-tabs-content-title"]}>
                Биелээгүй мөнгөн дүн
              </div>
              <div className={styles["myfund-tabs-content-rate"]}>
                {numberToCurrency(0)}
              </div>
            </Col>
            <Col span={24}>
              <Table
                scroll={{ x: 430 }}
                // @ts-ignore
                columns={columns}
                pagination={{
                  pageSize: 10,
                  position: ["bottomCenter"],
                }}
                dataSource={myLoanOrders}
                rowKey={"request_id"}
              />
            </Col>
          </Row>
        </Col>
      ),
    },
    {
      key: "2",
      label: "Санхүүжилт өгөх хүсэлт",
      children: (
        <Row gutter={[0, 30]} justify="center">
          <Col span={24}>
            <Row
              justify="space-between"
              gutter={[0, 30]}
              className={styles["myfund-tabs-content-border"]}
            >
              <Col flex="none">
                <div className={styles["myfund-tabs-content-title"]}>
                  Оруулсан хүсэлтийн хэмжээ
                </div>
                <div className={styles["myfund-tabs-2-content-money"]}>
                  {numberToCurrency(sumMySaving)}
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["myfund-tabs-content-title"]}>
                  Биржийн хүү
                </div>
                <div className={styles["myfund-tabs-content-rate"]}>1.50 %</div>
              </Col>
              <Col flex="none">
                <div className={styles["myfund-tabs-content-title"]}>
                  Нийт биелэлт
                </div>
                <div className={styles["myfund-tabs-content-rate"]}>40 %</div>
              </Col>
              <Col flex="none">
                <div className={styles["myfund-tabs-content-title"]}>
                  Биелээгүй мөнгөн дүн
                </div>
                <div className={styles["myfund-tabs-content-rate"]}>
                  {numberToCurrency(0)}
                </div>
              </Col>
              <Col span={24}>
                <Table
                  scroll={{ x: 430 }}
                  // @ts-ignore
                  columns={columns}
                  pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                  }}
                  dataSource={mySavingOrders}
                  rowKey={"request_id"}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      ),
    },
  ];
  return (
    <Row justify="center" className={styles["myfund-main-row"]}>
      <Col span={22}>
        <Row gutter={[0, 20]}>
          {!activeClass && (
            <HeaderDashboard
              title={"Миний хүсэлтүүд"}
              subTitle={
                "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
              }
            />
          )}
          {!activeClass && (
            <Col span={24}>
              <Tabs
                activeKey={myFundTabKey}
                onChange={(key) => setMyFundTabKey(key)}
                items={items}
                tabBarGutter={0}
              />
            </Col>
          )}
          {activeClass &&
            orders.map(
              (o: any) =>
                o.request_id == activeClass && (
                  <Row
                    className={stylesDL[activeClass ? "" : "dloan-change-div"]}
                  >
                    <HeaderDashboard
                      title={
                        o.product_type_code == "saving"
                          ? "Санхүүжилт өгөх хүсэлт"
                          : "Зээлийн авах хүсэлт"
                      }
                      subTitle={
                        "Харилцагч та миний санхүүжилт цэсээс нийт жагсаалтаа харах боломжтой."
                      }
                    />
                    <Col className="mt-[20px]">
                      <Row
                        className={stylesDL["dloan-detail"]}
                        gutter={[0, 22]}
                      >
                        <Col span={24}>
                          <Row justify="space-between" align="middle">
                            <Col flex="none">
                              <div
                                className={
                                  o.product_type_code == "saving"
                                    ? stylesFD["foundation-detail-text"]
                                    : stylesDL["dloan-detail-text"]
                                }
                              >
                                Үндсэн зээлийн хэмжээ
                              </div>
                            </Col>
                            <Col flex="none">
                              <div
                                className={stylesDL["dloan-detail-maxValue"]}
                              >
                                {o.loan_amount}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between" align="middle">
                            <Col flex="none">
                              <div className={stylesDL["dloan-detail-text"]}>
                                Хүүгийн хэмжээ
                              </div>
                            </Col>
                            <Col flex="none">
                              <div
                                className={
                                  o.product_type_code == "saving"
                                    ? stylesFD["foundation-rate-profit"]
                                    : stylesDL["dloan-rate-profit"]
                                }
                              >
                                {o.loan_rate_month}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between" align="middle">
                            <Col flex="none">
                              <div className={stylesDL["dloan-detail-text"]}>
                                Зээл олголтын шимтгэл
                              </div>
                            </Col>
                            <Col flex="none">
                              <div
                                className={
                                  o.product_type_code == "saving"
                                    ? stylesFD["foundation-rate-profit"]
                                    : stylesDL["dloan-rate-profit"]
                                }
                              >
                                {" "}
                                {o.loan_rate_month}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between" align="middle">
                            <Col flex="none">
                              <div className={stylesDL["dloan-detail-text"]}>
                                Нийт төлөх зээлийн хэмжээ
                              </div>
                            </Col>
                            <Col flex="none">
                              <div
                                className={stylesDL["dloan-detail-maxValue"]}
                              >
                                {" "}
                                {o.loan_rate_month}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between" align="middle">
                            <Col flex="none">
                              <div className={stylesDL["dloan-detail-text"]}>
                                Хүүгийн хэмжээ (хоногоор)
                              </div>
                            </Col>
                            <Col flex="none">
                              <div
                                className={stylesDL["dloan-detail-maxValue"]}
                              >
                                {o.loan_rate_month} %
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between" align="middle">
                            <Col flex="none">
                              <div className={stylesDL["dloan-detail-text"]}>
                                Хугацаа
                              </div>
                            </Col>
                            <Col flex="none">
                              <div
                                className={stylesDL["dloan-detail-maxValue"]}
                              >
                                {o.loan_day} хоног
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between" align="middle">
                            <Col flex="none">
                              <div className={stylesDL["dloan-detail-text"]}>
                                Эргэн төлөгдөх хугацаа
                              </div>
                            </Col>
                            <Col flex="none">
                              <div
                                className={stylesDL["dloan-detail-maxValue"]}
                              >
                                {o.create_date.slice(0, 10)}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )
            )}

          {activeClass && (
            <Button
              className={stylesDL["dloan-button-back"]}
              onClick={() => setSelectedId("")}
            >
              <Col flex={"auto"}>
                <div className={styles["dloan-change-button-text"]}>Хаах</div>
              </Col>
            </Button>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default MyFund;
