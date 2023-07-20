import { Row, Col, Statistic, Tabs, Table, Image } from "antd";
import styles from "../../../styles/fund.module.css";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { useSession } from "next-auth/react";
import { useRequireAuth } from "app/utils/auth";
import { Loaderr } from "app/components/Loader";

export const FundHistory = () => {
  const { data } = useSession();

  // @ts-ignore
  const { Countdown } = Statistic;
  // @ts-ignore
  const deadline = Date.now() + 1000 * 10 * 24 * 2 + 1000 * 30;
  const totalFundMoney = 345200000;
  const totalLoanMoney = 100000000;
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      width: "6%",
      // @ts-ignore
      render: (id) => (
        <div className={styles["fund-tabs-content-table-number"]}>{id}</div>
      ),
    },
    {
      title: "Зээлийн хэмжээ",
      dataIndex: "loanTotal",
      key: "loanTotal",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (loanTotal) => (
        <div className={styles["fund-tabs-content-table-number"]}>
          {numberToCurrency(loanTotal)}
        </div>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (type) =>
        type === "Өгсөн санхүүжилт" ? (
          <div className={styles["fund-tabs-1-content-table-type-text"]}>
            {type}
          </div>
        ) : (
          <div className={styles["fund-tabs-2-content-table-type-text"]}>
            {type}
          </div>
        ),
    },
    {
      title: "Хүү",
      dataIndex: "rate",
      key: "rate",
      align: "center",
      width: "15%",
      // @ts-ignore
      render: (rate) => (
        <div className={styles["fund-tabs-content-table-number"]}>{rate}</div>
      ),
    },
    {
      title: "Санхүүжилт өгсөн өдөр",
      dataIndex: "day",
      key: "day",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (day) => (
        <div className={styles["fund-tabs-content-table-number"]}>{day}</div>
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
  const dataTable = [
    {
      id: 1,
      loanTotal: 100000000,
      type: "Өгсөн санхүүжилт",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 2,
      loanTotal: 15000000,
      type: "Өгсөн санхүүжилт",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 3,
      loanTotal: 4500000,
      type: "Өгсөн санхүүжилт",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 4,
      loanTotal: 1000000,
      type: "Өгсөн санхүүжилт",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 5,
      loanTotal: 300000000,
      type: "Өгсөн санхүүжилт",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 6,
      loanTotal: 200000000,
      type: "Өгсөн санхүүжилт",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 7,
      loanTotal: 150000000,
      type: "Өгсөн санхүүжилт",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 8,
      loanTotal: 120000000,
      type: "Өгсөн санхүүжилт",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
  ];
  const data1 = [
    {
      id: 1,
      loanTotal: 100000000,
      type: "Авсан зээл",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 2,
      loanTotal: 15000000,
      type: "Авсан зээл",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 3,
      loanTotal: 4500000,
      type: "Авсан зээл",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 4,
      loanTotal: 1000000,
      type: "Авсан зээл",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 5,
      loanTotal: 300000000,
      type: "Авсан зээл",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 6,
      loanTotal: 200000000,
      type: "Авсан зээл",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 7,
      loanTotal: 150000000,
      type: "Авсан зээл",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
    },
    {
      id: 8,
      loanTotal: 120000000,
      type: "Авсан зээл",
      rate: "2.5 %",
      day: "12/07/23",
      icon: "asd",
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
                  {numberToCurrency(totalFundMoney)}
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Дундаж хүү
                </div>
                <div className={styles["fund-tabs-content-rate"]}>1.53 %</div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Санхүүжилтын тоо
                </div>
                <div className={styles["fund-tabs-content-rate"]}>8</div>
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
              dataSource={dataTable}
              rowKey={"id"}
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
                  {numberToCurrency(totalLoanMoney)}
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Дундаж хүү
                </div>
                <div className={styles["fund-tabs-content-rate"]}>1.83 %</div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Зээлийн тоо
                </div>
                <div className={styles["fund-tabs-content-rate"]}>8</div>
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
              dataSource={data1}
              rowKey={"id"}
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
        </Col>
      </Row>
    );
  }
};

export default FundHistory;
