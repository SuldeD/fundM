import { Row, Col, Table, Image, Button } from "antd";
import styles from "../../../../styles/myfund-list.module.css";
import stylesList from "../../../../styles/dashboard.module.css";
import stylesDL from "../../../../styles/dloan.module.css";
import stylesFD from "../../../../styles/foundation.module.css";
import { numberToCurrency } from "../../../../utils/number.helpers";
import { HeaderDashboard } from "../../../../components/header";
import { useAppContext } from "../../../../context/appContext";
import { useRouter } from "next/router";
import { useRequireAuth } from "app/utils/auth";
import { useApiContext } from "app/context/dashboardApiContext";
import { useState } from "react";

export const List = () => {
  const router = useRouter();
  useRequireAuth();
  const { myFundTabKey } = useAppContext();
  const { myLoanOrders, mySavingOrders, orders } = useApiContext();
  const [activeClass, setSelectedId] = useState<string>();
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

  const dataFoundataionAll = [
    {
      id: 1,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "80 %",
      icon: " ",
      take: true,
    },
    {
      id: 2,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 3,
      loanTotal: 50000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
      take: true,
    },
    {
      id: 4,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 5,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 6,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 7,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 8,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 9,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 10,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 11,
      loanTotal: 100000000,
      type: "Санхүүжилт өгөх",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
  ];

  const dataLoanAll = [
    {
      id: 1,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "80 %",
      icon: " ",
    },
    {
      id: 2,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 3,
      loanTotal: 50000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 4,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 5,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 6,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 7,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 8,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 9,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 10,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
    {
      id: 11,
      loanTotal: 100000000,
      type: "Зээлийн хүсэлт",
      rate: "2.5 %",
      completion: "0 %",
      icon: " ",
    },
  ];
  return (
    <Row
      justify="center"
      className={styles["myfund-main-row"]}
      gutter={[0, 30]}
    >
      {!activeClass && (
        <Col span={22}>
          <Row
            gutter={[0, 20]}
            className={styles[myFundTabKey === "2" ? "myfund-list" : ""]}
          >
            <HeaderDashboard
              title={"Зээл авах хүсэлтүүд"}
              subTitle={
                "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
              }
            />
            <Col span={24}>
              <Table
                scroll={{ x: 430 }}
                // @ts-ignore
                columns={columns}
                pagination={false}
                dataSource={myLoanOrders}
                rowKey={"id"}
              />
            </Col>
          </Row>
          <Row
            gutter={[0, 20]}
            className={styles[myFundTabKey === "1" ? "myfund-list" : ""]}
          >
            <HeaderDashboard
              title={"Санхүүжилт өгөх хүсэлтүүд"}
              subTitle={
                "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
              }
            />
            <Col span={24}>
              <Table
                scroll={{ x: 430 }}
                // @ts-ignore
                columns={columns}
                pagination={false}
                dataSource={mySavingOrders}
                rowKey={"id"}
              />
            </Col>
          </Row>
        </Col>
      )}
      {!activeClass && (
        <Col span={22}>
          <Row style={{ height: "100%" }} align="bottom">
            <Col flex="auto">
              <Button
                className={styles["myfund-list-back-button"]}
                onClick={() => router.back()}
              >
                Буцах
              </Button>
            </Col>
          </Row>
        </Col>
      )}

      {activeClass &&
        orders.map(
          (o: any) =>
            o.request_id == activeClass && (
              <Col span={22}>
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
                    <Row className={stylesDL["dloan-detail"]} gutter={[0, 22]}>
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
                            <div className={stylesDL["dloan-detail-maxValue"]}>
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
                            <div className={stylesDL["dloan-detail-maxValue"]}>
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
                            <div className={stylesDL["dloan-detail-maxValue"]}>
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
                            <div className={stylesDL["dloan-detail-maxValue"]}>
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
                            <div className={stylesDL["dloan-detail-maxValue"]}>
                              {o.create_date.slice(0, 10)}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
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
  );
};

export default List;
