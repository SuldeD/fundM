import { Row, Col, Select, DatePicker, Button, Image, Table } from "antd";
import styles from "../../../styles/history.module.css";
import stylesList from "../../../styles/dashboard.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { HeaderDashboard } from "../../../components/header";
import { useEffect, useState } from "react";
import { numberToCurrency } from "../../../utils/number.helpers";
import { Loaderr } from "app/components/Loader";
import { useApiContext } from "app/context/dashboardApiContext";
import { useRequireAuth } from "app/utils/auth";
const { RangePicker } = DatePicker;

const History = () => {
  const { data, orders: dataTable } = useApiContext();
  const [filterData, setFilterData] = useState<any>();
  useRequireAuth();

  const [type, setType] = useState(null);
  // @ts-ignore
  const onChange = (type) => {
    setType(type);
  };

  const [dates, setDates] = useState(null);
  const [value, setValue] = useState(null);
  // @ts-ignore
  const onOpenChange = (open) => {
    if (open) {
      // @ts-ignore
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  const print = () => {
    setFilterData([]);

    dataTable?.forEach((dt: any) => {
      if (
        // @ts-ignore
        dt?.create_date.slice(0, 10) >= value?.[0].format("YYYY-MM-DD") &&
        // @ts-ignore
        dt?.create_date.slice(0, 10) <= value?.[1].format("YYYY-MM-DD") &&
        dt?.product_type_code == type
      ) {
        dt && setFilterData((prev: any) => [...prev, dt]);
        // @ts-ignore
      } else if (type && value?.[0].format("YYYY-MM-DD") == undefined) {
        dt?.product_type_code == type &&
          dt &&
          setFilterData((prev: any) => [...prev, dt]);
      } else if (
        type == undefined && // @ts-ignore
        dt?.create_date.slice(0, 10) >= value?.[0].format("YYYY-MM-DD") &&
        // @ts-ignore
        dt?.create_date.slice(0, 10) <= value?.[1].format("YYYY-MM-DD")
      ) {
        dt && setFilterData((prev: any) => [...prev, dt]);
      } else if (
        type == undefined && // @ts-ignore
        value?.[0].format("YYYY-MM-DD") == undefined
      ) {
        setFilterData(dataTable);
      }
    });
  };

  const columns = [
    {
      title: "№",
      dataIndex: "is_status",
      key: "is_status",
      width: "6%",
      // @ts-ignore
      render: (is_status) => (
        <div className={styles["history-table-number"]}>{is_status}</div>
      ),
    },
    {
      title: "Зээлийн хэмжээ",
      dataIndex: "loan_amount",
      key: "loanTotal",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (loanTotal) => (
        <div className={styles["history-table-number"]}>
          {numberToCurrency(loanTotal)}
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
            Өгсөн санхүүжилт
          </div>
        ) : (
          <div className={stylesList["dashboard-list-item-type-1"]}>
            Авсан зээл
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
        <div className={styles["history-table-number"]}>
          {rate?.slice(0, 4)} %
        </div>
      ),
    },
    {
      title: "Хаасан огноо",
      dataIndex: "create_date",
      key: "date",
      align: "center",
      width: "23%",
      // @ts-ignore
      render: (date) => (
        <div className={styles["history-table-number"]}>
          {date?.slice(0, 10)}
        </div>
      ),
    },
  ];

  if (!data) {
    return <Loaderr />;
  } else {
    return (
      <Row
        justify="center"
        className={styles["history-main-row"]}
        gutter={[0, 20]}
      >
        <Col span={22}>
          <Row gutter={[0, 30]}>
            <HeaderDashboard
              title={"Санхүүжилтын түүх"}
              subTitle={
                "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
              }
            />
            <Col xs={24} xl={18}>
              <Row justify="space-between" align="middle" gutter={20}>
                <Col span={6}>
                  <Select
                    allowClear={true}
                    style={{
                      width: "100%",
                    }}
                    placeholder="Төрөл"
                    onChange={onChange}
                    options={[
                      {
                        value: "saving",
                        label: "Өгсөн санхүүжилт",
                      },
                      {
                        value: "loan",
                        label: "Авсан зээл",
                      },
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <RangePicker
                    style={{ width: "100%" }}
                    suffixIcon={null}
                    bordered={false}
                    value={dates || value}
                    // @ts-ignore
                    onCalendarChange={(val) => setDates(val)}
                    // @ts-ignore
                    onChange={(val) => setValue(val)}
                    onOpenChange={onOpenChange}
                  />
                </Col>
                <Col span={6}>
                  <Button
                    onClick={print}
                    type="primary"
                    className={styles["history-search-button"]}
                  >
                    <Row justify="center" gutter={10} align="middle">
                      <Col flex="none">
                        <SearchOutlined
                          style={{
                            fontSize: 16,
                            color: "#FFF",
                          }}
                        />
                      </Col>
                      <Col flex="none">
                        <div className={styles["history-search-button-text"]}>
                          Хайх
                        </div>
                      </Col>
                    </Row>
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Table
                scroll={{ x: 430 }}
                // @ts-ignore
                columns={columns}
                key={"request_id"}
                pagination={{
                  pageSize: 10,
                  position: ["bottomCenter"],
                }}
                dataSource={filterData ? filterData : dataTable}
                rowKey={"request_id"}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
};

export default History;
