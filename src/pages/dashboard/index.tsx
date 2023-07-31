import { Col, Row, Button, Image, Table, Modal } from "antd";
import styles from "../../styles/dashboard.module.css";
import { RightOutlined } from "@ant-design/icons";
import { HeaderDashboard } from "../../components/header";
import { numberToCurrency } from "../../utils/number.helpers";
import { useRouter } from "next/router";
import { Loaderr } from "app/components/Loader";
import { useApiContext } from "app/context/dashboardApiContext";
import { useRequireAuth } from "app/utils/auth";

export const Dashboard = () => {
  const router = useRouter();
  useRequireAuth();

  const { loan, orders, data, sumLoan, sumSaving } = useApiContext();

  const columns = [
    {
      title: "Зээлийн хэмжээ",
      dataIndex: "loan_amount",
      key: "loan_amount",
      width: "20%",
      render: (price: any) => (
        <div className={styles["dashboard-list-item-text"]}>
          {numberToCurrency(price)}
        </div>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: "20%",
      // @ts-ignore
      render: (type) =>
        type === "Авах хүсэлт" ? (
          <div className={styles["dashboard-list-item-type-1"]}>{type}</div>
        ) : (
          <div className={styles["dashboard-list-item-type-2"]}>{type}</div>
        ),
    },
    {
      title: "Хүү",
      dataIndex: "rate",
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
      dataIndex: "loan_day",
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
          {date.slice(0, 10)}
        </div>
      ),
    },
  ];
  const dataTable = [
    {
      id: 1,
      price: 100000000,
      type: "Авах хүсэлт",
      rate: "2.5 %",
      day: "14 хоног",
      date: "23/04/23",
    },
    {
      id: 2,
      price: 30000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "30 хоног",
      date: "23/04/23",
    },
    {
      id: 3,
      price: 20000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "60 хоног",
      date: "23/04/23",
    },
    {
      id: 4,
      price: 15000000,
      type: "Авах хүсэлт",
      rate: "2.5 %",
      day: "14 хоног",
      date: "23/04/23",
    },
    {
      id: 5,
      price: 22000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "7 хоног",
      date: "23/04/23",
    },
    {
      id: 6,
      price: 22000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "7 хоног",
      date: "23/04/23",
    },
    {
      id: 7,
      price: 22000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "7 хоног",
      date: "23/04/23",
    },
    {
      id: 8,
      price: 22000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "7 хоног",
      date: "23/04/23",
    },
    {
      id: 9,
      price: 22000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "7 хоног",
      date: "23/04/23",
    },
    {
      id: 10,
      price: 22000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "7 хоног",
      date: "23/04/23",
    },
    {
      id: 11,
      price: 22000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "7 хоног",
      date: "23/04/23",
    },
    {
      id: 12,
      price: 22000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "7 хоног",
      date: "23/04/23",
    },
    {
      id: 13,
      price: 22000000,
      type: "Өгөх хүсэлт",
      rate: "2.5 %",
      day: "7 хоног",
      date: "23/04/23",
    },
  ];

  const { data } = useSession();

  console.log(data, "session");

  if (!data) {
    router.push("/");
    return <Loaderr />;
  } else {
    return (
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
                        Зээл өгөх хүсэлт
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
                      <div className={styles["dashboard-loan-price-text"]}>
                        {numberToCurrency(45000000)}
                      </div>
                    </Col>
                    <Col span={24}>
                      <Button
                        className={`${styles["dashboard-loan-finance-button"]} bg-primary`}
                        type="primary"
                        onClick={() => router.push("/dashboard/loan/")}
                      >
                        Зээл авах
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} lg={12}>
                  <Row className={styles["dashboard-loan-intro-div"]}>
                    <Col span={10}>
                      <Row gutter={[0, 42]}>
                        <Col span={24}>
                          <div className={styles["dashboard-loan-intro-title"]}>
                            Зарласан хүү
                          </div>
                        </Col>
                        <Col span={24}>
                          <div className={styles["dashboard-loan-son-number"]}>
                            1.5 %
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
                          pageSize: 10,
                          position: ["bottomCenter"],
                        }}
                        dataSource={dataTable}
                        rowKey={"id"}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
};

export default Dashboard;
