import { Row, Col, Tabs, Table, Image, Button } from "antd";
import styles from "../../../styles/fund.module.css";
import stylesDL from "../../../styles/dloan.module.css";
import stylesFD from "../../../styles/foundation.module.css";
import stylesList from "../../../styles/dashboard.module.css";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { useRequireAuth } from "app/utils/auth";
import { Loaderr } from "app/components/Loader";
import { useApiContext } from "app/context/dashboardApiContext";
import { useState } from "react";

export const FundHistory = () => {
  const { data, mySavingOrders, myLoanOrders, sumMyLoan, sumMySaving, orders } =
    useApiContext();
  useRequireAuth();
  const [activeClass, setSelectedId] = useState<any>();

  const columns = [
    {
      title: "№",
      dataIndex: "is_status",
      key: "is_status",
      width: "6%",
      // @ts-ignore
      render: (id) => (
        <div className={styles["fund-tabs-content-table-number"]}>{id}</div>
      ),
    },
    {
      title: "Зээлийн хэмжээ",
      dataIndex: "loan_amount",
      key: "loan_amount",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (loan_amount) => (
        <div className={styles["fund-tabs-content-table-number"]}>
          {numberToCurrency(loan_amount)}
        </div>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "product_type_code",
      key: "type",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (type) =>
        type == "saving" ? (
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
      key: "rate",
      align: "center",
      width: "15%",
      // @ts-ignore
      render: (rate) => (
        <div className={styles["fund-tabs-content-table-number"]}>{rate} %</div>
      ),
    },
    {
      title: "Санхүүжилт өгсөн өдөр",
      dataIndex: "create_date",
      key: "day",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (day) => (
        <div className={styles["fund-tabs-content-table-number"]}>
          {day.slice(0, 10)}
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
          onClick={() => {
            setSelectedId(request_id);
          }}
          src={"/images/info-icon.png"}
          preview={false}
          className="cursor-pointer"
          alt="Information"
        />
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Өгсөн санхүүжилт",
      children: (
        <Row gutter={[0, 30]} justify="center">
          <Col span={24}>
            <Row
              justify="space-between"
              className={styles["fund-tabs-content-border"]}
            >
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Нийт зээлийн хэмжээ
                </div>
                <div className={styles["fund-tabs-1-content-money"]}>
                  {numberToCurrency(sumMySaving)}
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Дундаж хүү
                </div>
                <div className={styles["fund-tabs-content-rate"]}>
                  {mySavingOrders && mySavingOrders[0]?.loan_rate_month} %
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Санхүүжилтын тоо
                </div>
                <div className={styles["fund-tabs-content-rate"]}>
                  {mySavingOrders && mySavingOrders.length}
                </div>
              </Col>
            </Row>
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
      ),
    },
    {
      key: "2",
      label: "Авсан зээл",
      children: (
        <Row gutter={[0, 30]} justify="center">
          <Col span={24}>
            <Row
              justify="space-between"
              className={styles["fund-tabs-content-border"]}
            >
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Нийт зээлийн хэмжээ
                </div>
                <div className={styles["fund-tabs-2-content-money"]}>
                  {numberToCurrency(sumMyLoan)}
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Дундаж хүү
                </div>
                <div className={styles["fund-tabs-content-rate"]}>
                  {myLoanOrders && myLoanOrders[0]?.loan_rate_month} %
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Зээлийн тоо
                </div>
                <div className={styles["fund-tabs-content-rate"]}>
                  {myLoanOrders && myLoanOrders.length}
                </div>
              </Col>
            </Row>
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
      ),
    },
  ];

  if (!data) {
    return <Loaderr />;
  } else {
    return (
      <Row justify="center" className={styles["fund-main-row"]}>
        <Col span={22}>
          {!activeClass && (
            <Row gutter={[0, 20]}>
              <HeaderDashboard
                title={"Миний санхүүжилт"}
                subTitle={
                  " Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
                }
              />

              <Col span={24}>
                <Tabs defaultActiveKey="1" items={items} tabBarGutter={0} />
              </Col>
            </Row>
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
              style={{ marginTop: "15px" }}
            >
              <Col flex={"auto"}>
                <div className={styles["dloan-change-button-text"]}>Хаах</div>
              </Col>
            </Button>
          )}
        </Col>
      </Row>
    );
  }
};

export default FundHistory;
