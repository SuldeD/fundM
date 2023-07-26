import { Row, Col, Tabs, Table, Image } from "antd";
import styles from "../../../styles/my-fund.module.css";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { useAppContext } from "../../../context/appContext";
import { useRequireAuth } from "app/utils/auth";
import { useApiContext } from "app/context/dashboardApiContext";

export const MyFund = () => {
  const { myFundTabKey, setMyFundTabKey } = useAppContext();
  const { myLoanOrders, mySavingOrders, sumMyLoan, sumMySaving } =
    useApiContext();
  useRequireAuth();

  const columns = [
    {
      title: "Дараалал",
      dataIndex: "CheckMbAccount",
      key: "CheckMbAccount",
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
        product_type_code === "saving" ? (
          <div className={styles["myfund-tabs-2-content-table-type-text"]}>
            {product_type_code}
          </div>
        ) : (
          <div className={styles["myfund-tabs-1-content-table-type-text"]}>
            {product_type_code}
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
      dataIndex: "icon",
      key: "icon",
      width: "10%",
      align: "center",
      // @ts-ignore
      render: (icon) => (
        <Image
          width={25}
          src={"/images/info-icon.png"}
          preview={false}
          alt="Information"
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
                {myLoanOrders[0]?.loan_rate_month} %
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
                rowKey={"CheckMbAccount"}
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
                  {numberToCurrency(120000000)}
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
                  rowKey={"CheckMbAccount"}
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
          <HeaderDashboard
            title={"Миний хүсэлтүүд"}
            subTitle={
              "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
            }
          />

          <Col span={24}>
            <Tabs
              activeKey={myFundTabKey}
              onChange={(key) => setMyFundTabKey(key)}
              items={items}
              tabBarGutter={0}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default MyFund;