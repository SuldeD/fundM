"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const antd_1 = require("antd");
const history_module_css_1 = __importDefault(require("../../../styles/history.module.css"));
const icons_1 = require("@ant-design/icons");
const header_1 = require("../../../components/header");
const react_1 = require("react");
const number_helpers_1 = require("../../../utils/number.helpers");
const Loader_1 = require("app/components/Loader");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const auth_1 = require("app/utils/auth");
const { RangePicker } = antd_1.DatePicker;
const History = () => {
    const { data, orders: dataTable } = (0, dashboardApiContext_1.useApiContext)();
    (0, auth_1.useRequireAuth)();
    const [type, setType] = (0, react_1.useState)(null);
    // @ts-ignore
    const onChange = (type) => {
        setType(type);
    };
    const [dates, setDates] = (0, react_1.useState)(null);
    const [value, setValue] = (0, react_1.useState)(null);
    // @ts-ignore
    const onOpenChange = (open) => {
        if (open) {
            // @ts-ignore
            setDates([null, null]);
        }
        else {
            setDates(null);
        }
    };
    const print = () => {
        // @ts-ignore
        console.log(type, value === null || value === void 0 ? void 0 : value[0].format("YYYY-MM-DD"));
    };
    const columns = [
        {
            title: "№",
            dataIndex: "CheckMbAccount",
            key: "CheckMbAccount",
            width: "6%",
            // @ts-ignore
            render: (product_id) => (<div className={history_module_css_1.default["history-table-number"]}>{product_id}</div>),
        },
        {
            title: "Зээлийн хэмжээ",
            dataIndex: "loan_amount",
            key: "loanTotal",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (loanTotal) => (<div className={history_module_css_1.default["history-table-number"]}>
          {(0, number_helpers_1.numberToCurrency)(loanTotal)}
        </div>),
        },
        {
            title: "Төрөл",
            dataIndex: "product_type_code",
            key: "type",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (type) => type === "saving" ? (<div className={history_module_css_1.default["history-table-type-1"]}>{type}</div>) : (<div className={history_module_css_1.default["history-table-type-2"]}>{type}</div>),
        },
        {
            title: "Хүү",
            dataIndex: "loan_rate_day",
            key: "rate",
            align: "center",
            width: "15%",
            // @ts-ignore
            render: (rate) => (<div className={history_module_css_1.default["history-table-number"]}>
          {rate.slice(0, 4)}%
        </div>),
        },
        {
            title: "Хаасан огноо",
            dataIndex: "create_date",
            key: "date",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (date) => (<div className={history_module_css_1.default["history-table-number"]}>
          {date.slice(0, 10)}
        </div>),
        },
        {
            title: " ",
            dataIndex: "icon",
            key: "icon",
            width: "10%",
            align: "center",
            render: () => (<antd_1.Image width={25} src={"/images/info-icon.png"} preview={false} alt="Information"/>),
        },
    ];
    if (!data) {
        return <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row justify="center" className={history_module_css_1.default["history-main-row"]} gutter={[0, 20]}>
        <antd_1.Col span={22}>
          <antd_1.Row gutter={[0, 30]}>
            <header_1.HeaderDashboard title={"Санхүүжилтын түүх"} subTitle={"Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."}/>
            <antd_1.Col xs={24} xl={18}>
              <antd_1.Row justify="space-between" align="middle" gutter={20}>
                <antd_1.Col span={6}>
                  <antd_1.Select allowClear={true} style={{
                width: "100%",
            }} placeholder="Төрөл" onChange={onChange} options={[
                {
                    value: "1",
                    label: "Өгсөн санхүүжилт",
                },
                {
                    value: "2",
                    label: "Авсан зээл",
                },
            ]}/>
                </antd_1.Col>
                <antd_1.Col span={12}>
                  <RangePicker style={{ width: "100%" }} suffixIcon={null} bordered={false} value={dates || value} 
        // @ts-ignore
        onCalendarChange={(val) => setDates(val)} 
        // @ts-ignore
        onChange={(val) => setValue(val)} onOpenChange={onOpenChange}/>
                </antd_1.Col>
                <antd_1.Col span={6}>
                  <antd_1.Button onClick={print} type="primary" className={history_module_css_1.default["history-search-button"]}>
                    <antd_1.Row justify="center" gutter={10} align="middle">
                      <antd_1.Col flex="none">
                        <icons_1.SearchOutlined style={{
                fontSize: 16,
                color: "#FFF",
            }}/>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={history_module_css_1.default["history-search-button-text"]}>
                          Хайх
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Button>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Table scroll={{ x: 430 }} 
        // @ts-ignore
        columns={columns} key={"request_id"} pagination={{
                pageSize: 10,
                position: ["bottomCenter"],
            }} dataSource={dataTable} rowKey={"CheckMbAccount"}/>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>);
    }
};
exports.default = History;
