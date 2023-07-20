import { Row, Col, Table, Image, Button } from "antd";
import styles from "@/styles/myfund-list.module.css";
import { numberToCurrency } from "../../../../utils/number.helpers";
import { HeaderDashboard } from "../../../../components/header";
import { useAppContext } from "../../../../context/appContext";
import { useRouter } from "next/router";

export const List = () => {
  const router = useRouter();
  const { myFundTabKey } = useAppContext();
  const columns = [
    {
      title: "Дараалал",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "6%",
      // @ts-ignore
      render: (id) => (
        <div className={styles["myfund-tabs-content-table-id"]}>{id}</div>
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
        <div className={styles["myfund-tabs-content-table-number"]}>
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
        type === "Өгөх хүсэлт" ? (
          <div className={styles["myfund-tabs-2-content-table-type-text"]}>
            {type}
          </div>
        ) : (
          <div className={styles["myfund-tabs-1-content-table-type-text"]}>
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
      render: () => (
        <Image
          width={25}
          src={"/images/info-icon.png"}
          preview={false}
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
              dataSource={dataLoanAll}
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
              dataSource={dataFoundataionAll}
              rowKey={"id"}
            />
          </Col>
        </Row>
      </Col>
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
    </Row>
  );
};

export default List;
