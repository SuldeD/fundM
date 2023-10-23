import { Row, Col, Select, DatePicker, Button, Table } from "antd";
import styles from "app/styles/history.module.css";
import stylesList from "app/styles/dashboard.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { HeaderDashboard } from "app/components/header";
import { useMemo, useState } from "react";
import { numberToCurrency } from "app/utils/number.helpers";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";
const { RangePicker } = DatePicker;

const History = () => {
  const { status } = useSession();

  //query
  const { data: loanSearch } = api.loan.loanSearch.useQuery(
    {
      order: "date",
      order_up: "1",
      page: "1",
      page_size: "50",
      filter_type: "current",
    },
    { refetchOnWindowFocus: false }
  );

  //state
  const [filterData, setFilterData] = useState<any>();
  const [type, setType] = useState<any>(null);
  const [dates, setDates] = useState<any>(null);
  const [value, setValue] = useState<any>(null);

  const dataTable = useMemo(() => {
    return loanSearch?.loan_requests;
  }, [loanSearch]);

  const onOpenChange = (open: any) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  const print = () => {
    setFilterData([]);

    dataTable?.forEach((dt: any) => {
      if (
        dt?.close_date?.slice(0, 10) >= value?.[0].format("YYYY-MM-DD") &&
        dt?.close_date?.slice(0, 10) <= value?.[1].format("YYYY-MM-DD") &&
        dt?.product_type_code == type
      ) {
        dt && setFilterData((prev: any) => [...prev, dt]);
      } else if (type && value?.[0].format("YYYY-MM-DD") == undefined) {
        dt?.product_type_code == type &&
          dt &&
          setFilterData((prev: any) => [...prev, dt]);
      } else if (
        type == undefined &&
        dt?.close_date?.slice(0, 10) >= value?.[0].format("YYYY-MM-DD") &&
        dt?.close_date?.slice(0, 10) <= value?.[1].format("YYYY-MM-DD")
      ) {
        dt && setFilterData((prev: any) => [...prev, dt]);
      } else if (
        type == undefined &&
        value?.[0].format("YYYY-MM-DD") == undefined
      ) {
        setFilterData(dataTable);
      }
    });
  };

  const columns: any[] = [
    {
      title: "№",
      dataIndex: "request_id",
      key: "request_id",
      width: "6%",
      render: (request_id: string) => (
        <div className={styles["history-table-number"]}>{request_id}</div>
      ),
    },
    {
      title: "Захиалгын хэмжээ",
      dataIndex: "loan_amount",
      key: "loanTotal",
      align: "center",
      width: "23%",
      render: (loanTotal: string) => (
        <div className={styles["history-table-number"]}>
          {numberToCurrency(loanTotal)}
        </div>
      ),
    },

    {
      title: "Нийт хэмжээ",
      dataIndex: "total_paid_amount",
      key: "loanTotal",
      align: "center",
      width: "20%",
      render: (loanTotal: string, data: any) => (
        <div className={styles["history-table-number"]}>
          {data?.product_type_code == "saving"
            ? numberToCurrency(data?.saving_paid_amount)
            : numberToCurrency(loanTotal)}
        </div>
      ),
    },

    {
      title: "Төрөл",
      dataIndex: "product_type_code",
      key: "type",
      align: "center",
      width: "20%",
      render: (type: string) =>
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
      render: (rate: string) => (
        <div className={styles["history-table-number"]}>
          {Math.round(Number(rate) * 10) / 10}0 %
        </div>
      ),
    },
    {
      title: "Хаасан огноо",
      dataIndex: "close_date",
      key: "date",
      align: "center",
      width: "23%",
      render: (date: string) => (
        <div className={styles["history-table-number"]}>
          {date?.slice(0, 10)}
        </div>
      ),
    },
  ];

  if (status == "loading") {
    return null;
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
                "Харилцагч та өөрийн хаагдсан өгсөн санхүүжилт болон авсан зээлийн мэдээллээ доорх цэсээр харна уу"
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
                    onChange={(e) => setType(e)}
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
                    onCalendarChange={(val) => setDates(val)}
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
                      <Col flex="none" className="mt-1">
                        <SearchOutlined
                          style={{
                            fontSize: 16,
                            color: "#FFF",
                          }}
                        />
                      </Col>
                      <Col flex="none" className="hidden md:flex">
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
                columns={columns}
                key={"request_id"}
                pagination={{
                  pageSize: 8,
                  position: ["bottomCenter"],
                }}
                dataSource={
                  filterData ? filterData?.reverse() : dataTable?.reverse()
                }
                rowKey={"create_date"}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
};

export default History;
