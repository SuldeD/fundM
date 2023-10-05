import { Col, Row, Button, Image, Table } from "antd";
import styles from "app/styles/dashboard.module.css";
import { RightOutlined } from "@ant-design/icons";
import { HeaderDashboard } from "app/components/header";
import { numberToCurrency } from "app/utils/number.helpers";
import { useRouter } from "next/router";
import { api } from "app/utils/api";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { Loaderr } from "app/components/Loader";
import { ProtectedLayout } from "app/cmsLayout";

export const Dashboard = () => {
  const { data, status } = useSession();
  const router = useRouter();

  const { data: loan } = api.loan.loanList.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { data: loans } = api.loan.reguestSearch.useQuery(
    {
      order: "date",
      order_up: "1",
      page: "1",
      page_size: "30",
      filter_type: "done",
    },
    { refetchOnWindowFocus: false }
  );

  const { data: loanActive } = api.loan.reguestSearch.useQuery(
    {
      order: "date",
      order_up: "1",
      page: "1",
      page_size: "30",
      filter_type: "active",
    },
    { refetchOnWindowFocus: false }
  );

  const dataTable = useMemo(() => {
    return loans?.requests;
  }, [loans]);

  const sumLoan = useMemo(() => {
    return loanActive?.loan_request_amount;
  }, [loanActive]);

  const sumSaving = useMemo(() => {
    return loanActive?.saving_request_amount;
  }, [loanActive]);

  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "request_id",
      align: "center",
      width: "6%",
      render: (id: string, data: any) => (
        <div className={styles["dashboard-list-item-text"]}>
          {data?.is_my_request == "1" ? (
            <div className={styles["loanReq-start"]}>
              <Image width={23} src="/images/star.svg" preview={false} />
            </div>
          ) : (
            id
          )}
        </div>
      ),
    },
    {
      title: "Захиалгын хэмжээ",
      dataIndex: "loan_amount",
      key: "filled_amount",

      width: "20%",
      render: (price: any) => (
        <div className={styles["dashboard-list-item-text"]}>
          {numberToCurrency(price)}
        </div>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "request_type",
      key: "type",
      align: "center",
      width: "20%",
      // @ts-ignore
      render: (type) =>
        type == "wallet" ? (
          <div className={styles["dashboard-list-item-type-1"]}>
            Авах хүсэлт
          </div>
        ) : (
          <div className={styles["dashboard-list-item-type-2"]}>
            Өгөх хүсэлт
          </div>
        ),
    },
    {
      title: "Хүү",
      dataIndex: "rate_month",
      key: "rate",
      width: "20%",
      align: "center",
      // @ts-ignore
      render: (rate) => (
        <div className={styles["dashboard-list-item-text"]}>{rate} %</div>
      ),
    },
    {
      title: "Хугацаа",
      dataIndex: "duration",
      key: "day",
      width: "20%",
      align: "center",
      // @ts-ignore
      render: (day) => (
        <div className={styles["dashboard-list-item-text"]}>{day} хоног</div>
      ),
    },
    {
      title: "Огноо",
      dataIndex: "create_date",
      align: "right",
      key: "date",
      width: "20%",
      // @ts-ignore
      render: (date) => (
        <div className={styles["dashboard-list-item-text"]}>
          {date.slice(10, 19)}
        </div>
      ),
    },
  ];

  if (status == "loading") {
    <Loaderr />;
  } else {
    return (
      <ProtectedLayout>
        <Row justify="center" className={styles["dashboard-main-row"]}>
          <Col span={22}>
            <Row justify="center" align="middle" gutter={[0, 30]}>
              <HeaderDashboard title={"Цахим бирж"} subTitle={undefined} />
              <Col span={24}>
                <Row justify="space-between" gutter={20}>
                  <Col xs={24} lg={12}>
                    <Row
                      className={styles["dashboard-loan-intro-div"]}
                      gutter={[0, 10]}
                    >
                      <Col span={24}>
                        <div className={styles["dashboard-loan-intro-title"]}>
                          {sumSaving > sumLoan
                            ? "Санхүүжилт өгөх хүсэлт"
                            : "Зээл авах хүсэлт"}
                        </div>
                      </Col>
                      <Col span={24}>
                        <div
                          className={styles["dashboard-loan-price-title-text"]}
                        >
                          Нийт хэмжээ
                        </div>
                      </Col>
                      <Col span={24}>
                        <div
                          className={
                            sumSaving > sumLoan
                              ? styles["dashboard-loan-price-text"]
                              : styles["dashboard-loan-price1-text"]
                          }
                        >
                          {sumSaving > sumLoan
                            ? numberToCurrency(sumSaving)
                            : numberToCurrency(sumLoan)}
                        </div>
                      </Col>
                      <Col span={24}>
                        <Button
                          className={styles["dashboard-loan-finance-button"]}
                          type="primary"
                          onClick={() => {
                            sumSaving > sumLoan
                              ? router.push("/dashboard/loan/")
                              : router.push("/dashboard/foundation/");
                          }}
                        >
                          {sumSaving > sumLoan
                            ? "Зээл авах"
                            : "Санхүүжилт өгөх"}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} lg={12} className="mt-[20px] lg:mt-0">
                    <Row className={styles["dashboard-loan-intro-div"]}>
                      <Col span={10}>
                        <Row gutter={[0, 42]}>
                          <Col span={24}>
                            <div
                              className={styles["dashboard-loan-intro-title"]}
                            >
                              Зарласан хүү
                            </div>
                          </Col>
                          <Col span={24}>
                            <div
                              className={`${styles["dashboard-loan-son-number"]} flex`}
                            >
                              {data?.user &&
                                loan?.product_list[0]?.loan_rate_month}
                              <p className="h-[15px] w-[15px]">%</p>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={14}>
                        <Image
                          height="100%"
                          src={"./images/loan-image.svg"}
                          preview={false}
                          alt="teller"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={24} className={styles["dashboard-bg-image"]}>
                <Row justify="end" align="bottom" style={{ height: "100%" }}>
                  <Button
                    className={`${styles["dashboard-bg-image-button"]} bg-primary`}
                    type="primary"
                  >
                    Дэлгэрэнгүй {<RightOutlined />}
                  </Button>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[0, 20]} justify="start">
                  <Col flex="none">
                    <div className={styles["dashboard-complete-order-title"]}>
                      Биелсэн захиалгууд
                    </div>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={24}>
                        <Table
                          scroll={{ x: 430 }}
                          // @ts-ignore
                          columns={columns}
                          pagination={{
                            pageSize: 8,
                            position: ["bottomCenter"],
                          }}
                          dataSource={dataTable?.reverse()}
                          rowKey={"create_date"}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </ProtectedLayout>
    );
  }
};

export default Dashboard;
