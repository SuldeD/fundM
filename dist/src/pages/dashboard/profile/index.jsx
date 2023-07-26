"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const icons_1 = require("@ant-design/icons");
const antd_1 = require("antd");
const profile_module_css_1 = __importDefault(require("../../../styles/profile.module.css"));
const header_1 = require("../../../components/header");
const react_1 = require("react");
const Loader_1 = require("app/components/Loader");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const auth_1 = require("app/utils/auth");
const router_1 = require("next/router");
const { Panel } = antd_1.Collapse;
const { Paragraph } = antd_1.Typography;
const Profile = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { accountInfo, data } = (0, dashboardApiContext_1.useApiContext)();
    const router = (0, router_1.useRouter)();
    const { error } = antd_1.Modal;
    (0, auth_1.useRequireAuth)();
    const [editNumber, seteditNumber] = (0, react_1.useState)((_a = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.account) === null || _a === void 0 ? void 0 : _a.phone);
    const [editEmail, setEditEmail] = (0, react_1.useState)(`${(_b = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.account) === null || _b === void 0 ? void 0 : _b.email}`);
    // @ts-ignore
    const onChange = (key) => { };
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [imageUrl, setImageUrl] = (0, react_1.useState)();
    // @ts-ignore
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            // @ts-ignore
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            // @ts-ignore
            message.error("Image must smaller than 2MB!");
        }
        return isJpgOrPng && isLt2M;
    };
    // @ts-ignore
    const handleChange = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            // Get this url from response in real world.
            // @ts-ignore
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    const uploadButton = (<div>
      {loading ? <icons_1.LoadingOutlined /> : <icons_1.PlusOutlined />}
      <div style={{
            marginTop: 8,
        }}>
        Upload
      </div>
    </div>);
    const items = [
        {
            key: "1",
            label: "Миний мэдээлэл",
            children: (<antd_1.Col span={24}>
          <antd_1.Row gutter={[0, 20]}>
            <antd_1.Col span={18}>
              <antd_1.Row justify="space-between" align="middle" gutter={[0, 20]}>
                <antd_1.Col flex="none">
                  <antd_1.Upload name="avatar" listType="picture-circle" className="avatar-uploader" showUploadList={false} action="https://www.mocky.io/v2/5cc8019d300000980a055e76" beforeUpload={beforeUpload} onChange={handleChange}>
                    {imageUrl ? (<img src={imageUrl} alt="avatar" style={{
                        width: "100%",
                    }}/>) : (uploadButton)}
                  </antd_1.Upload>
                </antd_1.Col>
                <antd_1.Col flex="none">
                  <antd_1.Row gutter={[0, 4]}>
                    <antd_1.Col span={24}>
                      <div className={profile_module_css_1.default["profile-bankaccount-title"]}>
                        Овог
                      </div>
                    </antd_1.Col>
                    <antd_1.Col span={24}>
                      <div className={profile_module_css_1.default["profile-information-name"]}>
                        {((_c = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.account) === null || _c === void 0 ? void 0 : _c.last_name)
                    ? (_d = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.account) === null || _d === void 0 ? void 0 : _d.last_name
                    : "."}
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col flex="none">
                  <antd_1.Row gutter={[0, 4]}>
                    <antd_1.Col span={24}>
                      <div className={profile_module_css_1.default["profile-bankaccount-title"]}>
                        Нэр
                      </div>
                    </antd_1.Col>
                    <antd_1.Col span={24}>
                      <div className={profile_module_css_1.default["profile-information-name"]}>
                        {((_e = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.account) === null || _e === void 0 ? void 0 : _e.first_name)
                    ? (_f = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.account) === null || _f === void 0 ? void 0 : _f.first_name
                    : "."}
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col flex="none">
                  <antd_1.Row gutter={[0, 4]}>
                    <antd_1.Col span={24}>
                      <div className={profile_module_css_1.default["profile-bankaccount-title"]}>
                        Регисирын дугаар
                      </div>
                    </antd_1.Col>
                    <antd_1.Row gutter={5}>
                      <antd_1.Col flex="none">
                        <div className={profile_module_css_1.default["profile-information-name"]}>
                          АХ
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={profile_module_css_1.default["profile-information-register"]}>
                          82043023
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Row>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={20}>
              <antd_1.Row justify="space-between">
                <antd_1.Col span={8}>
                  <antd_1.Row gutter={[0, 20]}>
                    <antd_1.Col span={24}>
                      <div className={profile_module_css_1.default["profile-typography-title"]}>
                        Утасны дугаар
                      </div>
                    </antd_1.Col>
                    <antd_1.Col span={24}>
                      <Paragraph editable={{
                    // @ts-ignore
                    onChange: seteditNumber,
                    icon: (<antd_1.Image width="100%" src={"/images/edit-text.svg"} preview={false} alt="edit-text"/>),
                }} style={{
                    borderBottom: "1px solid rgba(26, 33, 85, 0.2)",
                    width: "100%",
                }}>
                        <span className={profile_module_css_1.default["profile-typography-phone-number"]}>
                          {editNumber}
                        </span>
                      </Paragraph>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col span={12}>
                  <antd_1.Row gutter={[0, 20]}>
                    <antd_1.Col span={24}>
                      <div className={profile_module_css_1.default["profile-typography-title"]}>
                        Имэйл хаяг
                      </div>
                    </antd_1.Col>
                    <antd_1.Col span={24}>
                      <Paragraph editable={{
                    onChange: setEditEmail,
                    icon: (<antd_1.Image width="100%" src={"/images/edit-text.svg"} preview={false} alt="edit-text"/>),
                    // @ts-ignore
                    text: { editEmail },
                }} style={{
                    borderBottom: "1px solid rgba(26, 33, 85, 0.2)",
                }}>
                        <span className={profile_module_css_1.default["profile-typography-email"]}>
                          {editEmail}
                        </span>
                      </Paragraph>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Row gutter={[0, 13]}>
                <antd_1.Col flex="auto">
                  <div className={profile_module_css_1.default["profile-bankaccount-title"]}>
                    Дансны мэдээлэл
                  </div>
                </antd_1.Col>
                <antd_1.Col flex="right">
                  <div className="cursor-pointer font-lato text-[12px] font-normal text-primary hover:text-[#524ffd]" onClick={() => {
                    !accountInfo.bank_account
                        ? router.push("/dashboard/profile/bank")
                        : error({
                            title: "Амжилтгүй",
                            content: (<div>
                                Ta dans solih bol manai salbar deer ochij
                                soliulna uu!!!
                              </div>),
                        });
                }}>
                    Данс холбох +
                  </div>
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <antd_1.Row justify="space-between" className={profile_module_css_1.default["profile-bankaccount-div"]}>
                    <antd_1.Col flex="none">
                      <antd_1.Row gutter={10} align="middle">
                        <antd_1.Col flex="none">
                          <div className={profile_module_css_1.default["profile-bankaccount-title"]}>
                            Банк:
                          </div>
                        </antd_1.Col>
                        <antd_1.Col flex="none">
                          <div className={profile_module_css_1.default["profile-backaccount-value"]}>
                            {(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.bank_account) &&
                    ((_g = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.bank_account) === null || _g === void 0 ? void 0 : _g.bank_name)}
                          </div>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <antd_1.Row gutter={10} align="middle">
                        <antd_1.Col flex="none">
                          <div className={profile_module_css_1.default["profile-bankaccount-title"]}>
                            Дансны дугаар:
                          </div>
                        </antd_1.Col>
                        <antd_1.Col flex="none">
                          <div className={profile_module_css_1.default["profile-backaccount-value"]}>
                            {(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.bank_account) &&
                    ((_h = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.bank_account) === null || _h === void 0 ? void 0 : _h.account_num)}
                          </div>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <antd_1.Row gutter={10} align="middle">
                        <antd_1.Col flex="none">
                          <div className={profile_module_css_1.default["profile-bankaccount-title"]}>
                            Дансны нэр:
                          </div>
                        </antd_1.Col>
                        <antd_1.Col flex="none">
                          <div className={profile_module_css_1.default["profile-backaccount-value"]}>
                            Бичил Глобус ХХК
                          </div>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>),
        },
        {
            key: "2",
            label: "Нууцлал",
            children: (<antd_1.Col span={24}>
          <antd_1.Collapse onChange={onChange} bordered={false} expandIconPosition="end">
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Нэвтрэх нууц үг солих
                </div>} key="1">
              <p>adasd</p>
            </Panel>
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Fund me код солих
                </div>} key="2">
              <p>asdasd</p>
            </Panel>
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Fund me код сэргээх
                </div>} key="3">
              <p>asdasd</p>
            </Panel>
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Fund Me нууцлалын горим
                </div>} key="4">
              <p>asdasd</p>
            </Panel>
          </antd_1.Collapse>
        </antd_1.Col>),
        },
        {
            key: "3",
            label: "Тусламж",
            children: (<antd_1.Col span={24}>
          <antd_1.Collapse onChange={onChange} bordered={false} expandIconPosition="end">
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Fund me биржийг хэрхэн ашиглаж эхлэх вэ?
                </div>} key="1">
              <p>adasd</p>
            </Panel>
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Хэрхэн зээл авах вэ?
                </div>} key="2">
              <p>asdasd</p>
            </Panel>
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Хэрхэн санхүүжилт авах вэ?
                </div>} key="3">
              <antd_1.Col span={24}>
                <antd_1.Row justify="end" gutter={[0, 10]}>
                  <antd_1.Col span={22} className={profile_module_css_1.default["profile-collapse-content-border"]}>
                    <div className={profile_module_css_1.default["profile-collapse-content-text"]}>
                      Зээлийн эрх хэрхэн тогтоолгох вэ?
                    </div>
                  </antd_1.Col>
                  <antd_1.Col span={22} className={profile_module_css_1.default["profile-collapse-content-border"]}>
                    <div className={profile_module_css_1.default["profile-collapse-content-text"]}>
                      Зээл авах заавар
                    </div>
                  </antd_1.Col>
                  <antd_1.Col span={22} className={profile_module_css_1.default["profile-collapse-content-border"]}>
                    <div className={profile_module_css_1.default["profile-collapse-content-text"]}>
                      Авсан зээлээ хэрхэн эргэн төлөх вэ?
                    </div>
                  </antd_1.Col>
                  <antd_1.Col span={22} className={profile_module_css_1.default["profile-collapse-content-border"]}>
                    <div className={profile_module_css_1.default["profile-collapse-content-text"]}>
                      Авсан санхүүжилтээ сунгах заавар
                    </div>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Col>
            </Panel>
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Хувийн мэдээллээ хэрхэн шинэчлэх вэ?
                </div>} key="4">
              <p>asdasd</p>
            </Panel>
          </antd_1.Collapse>
        </antd_1.Col>),
        },
        {
            key: "4",
            label: "Үйлчилгээний нөхцөл",
            children: (<antd_1.Col span={24}>
          <antd_1.Collapse onChange={onChange} bordered={false} expandIconPosition="end" background-color="#FFF">
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Нэвтрэх нууц үг солих
                </div>} key="1">
              <p>adasd</p>
            </Panel>
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Fund me код солих
                </div>} key="2">
              <p>asdasd</p>
            </Panel>
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Fund me код сэргээх
                </div>} key="3">
              <p>asdasd</p>
            </Panel>
            <Panel header={<div className={profile_module_css_1.default["profile-tabs-2-collapse-title"]}>
                  Fund Me нууцлалын горим
                </div>} key="4">
              <p>asdasd</p>
            </Panel>
          </antd_1.Collapse>
        </antd_1.Col>),
        },
    ];
    if (!data) {
        return <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row justify="center" className={profile_module_css_1.default["profile-main-row"]}>
        <antd_1.Col span={22}>
          <antd_1.Row gutter={[0, 20]}>
            <header_1.HeaderDashboard title={"Миний мэдээлэл"} subTitle={"Та банкны мэдээллээ өөрчлөх бол манай байгууллагын таньд ойрхон салбарт хандана уу."}/>
            <antd_1.Col span={24}>
              <antd_1.Tabs defaultActiveKey="1" items={items} tabBarGutter={0}/>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>);
    }
};
exports.Profile = Profile;
exports.default = exports.Profile;
