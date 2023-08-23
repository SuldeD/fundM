import { Row, Col, Select, DatePicker, Button, Table } from "antd";
import styles from "../../../styles/history.module.css";
import stylesList from "../../../styles/dashboard.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { HeaderDashboard } from "../../../components/header";
import { useMemo, useState } from "react";
import { numberToCurrency } from "../../../utils/number.helpers";
import { Loaderr } from "app/components/Loader";
import { useRequireAuth } from "app/utils/auth";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";
const { RangePicker } = DatePicker;

const History = () => {
  const { data } = useSession();
  useRequireAuth();

  //query
  const { data: requestSearch } = api.loan.reguestSearch.useQuery(
    {
      order: "date",
      order_up: "1",
      page: "1",
      page_size: "30",
      filter_type: "done",
    },
    { refetchOnWindowFocus: false }
  );

  //state
  const [filterData, setFilterData] = useState<any>();
  const [type, setType] = useState<any>(null);
  const [dates, setDates] = useState<any>(null);
  const [value, setValue] = useState<any>(null);

  const dataTable = useMemo(() => {
    return requestSearch?.requests;
  }, [requestSearch]);

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
        dt?.create_date.slice(0, 10) >= value?.[0].format("YYYY-MM-DD") &&
        dt?.create_date.slice(0, 10) <= value?.[1].format("YYYY-MM-DD") &&
        dt?.request_type == type
      ) {
        dt && setFilterData((prev: any) => [...prev, dt]);
      } else if (type && value?.[0].format("YYYY-MM-DD") == undefined) {
        dt?.request_type == type &&
          dt &&
          setFilterData((prev: any) => [...prev, dt]);
      } else if (
        type == undefined &&
        dt?.create_date.slice(0, 10) >= value?.[0].format("YYYY-MM-DD") &&
        dt?.create_date.slice(0, 10) <= value?.[1].format("YYYY-MM-DD")
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
      dataIndex: "id",
      key: "request_id",
      width: "6%",
      render: (request_id: string) => (
        <div className={styles["history-table-number"]}>{request_id}</div>
      ),
    },
    {
      title: "Зээлийн хэмжээ",
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
      title: "Төрөл",
      dataIndex: "request_type",
      key: "type",
      align: "center",
      width: "23%",
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
      dataIndex: "rate_month",
      key: "rate",
      align: "center",
      width: "15%",
      render: (rate: string) => (
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
      render: (date: string) => (
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
                    onChange={(e) => setType(e)}
                    options={[
                      {
                        value: "saving",
                        label: "Өгсөн санхүүжилт",
                      },
                      {
                        value: "wallet",
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
                      <Col flex="none">
                        <SearchOutlined
                          style={{
                            fontSize: 16,
                            color: "#FFF",
                          }}
                        />
                      </Col>
                      <Col flex="none" className="hidden lg:flex">
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
