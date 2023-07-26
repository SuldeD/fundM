import { Col, Row, Tabs, InputNumber, Select, Image, Button } from "antd";
import styles from "../styles/calculate.module.css";
import { numberToCurrency } from "../utils/number.helpers";
import { useState } from "react";

export const CalculateComponent = () => {
  const [inputValue, setInputValue] = useState();
  const onChange = (
    /** @type {import("react").SetStateAction<undefined>} */ value: import("react").SetStateAction<undefined>
  ) => {
    setInputValue(value);
  };

  const handleChange = (/** @type {any} */ value: any) => {
    console.log(`selected ${value}`);
  };

  const items = [
    {
      key: "1",
      label: "Өгөх",
      children: (
        <Col span={24}>
          <Row justify="center" align="middle" gutter={[0, 14]}>
            <Col span={24}>
              <InputNumber
                defaultValue={1}
                value={inputValue}
                // @ts-ignore
                onChange={onChange}
                formatter={(value) => numberToCurrency(value)}
                className={styles["calculate-inputNumber-div"]}
              />
            </Col>
            <Col span={24}>
              <div className={styles["calculate-tabs-content-title"]}>
                Санхүүжилт өгөх мөнгөн дүнгээ оруулна уу.
              </div>
            </Col>
            <Col span={24}>
              <Row gutter={16}>
                <Col span={12}>
                  <Select
                    defaultValue="7"
                    style={{
                      width: "100%",
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "7",
                        label: "7 хоног",
                      },
                      {
                        value: "14",
                        label: "14 хоног",
                      },
                      {
                        value: "21",
                        label: "21 хоног",
                      },
                      {
                        value: "28",
                        label: "28 хоног",
                      },
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <Select
                    style={{ width: "100%" }}
                    defaultValue="1"
                    onChange={handleChange}
                    options={[
                      {
                        value: "1",
                        label: "1.0 %",
                      },
                      {
                        value: "2",
                        label: "2.4 %",
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <div className={styles["calculate-tabs-content-title"]}>
                Ерөнхий мэдээлэл
              </div>
            </Col>
            <Col span={24}>
              <Row
                justify="center"
                className={styles["calculate-tabs-content-general-div"]}
                gutter={[0, 10]}
              >
                <Col span={24}>
                  <Row justify="space-between" align="middle">
                    <Col flex="none">
                      <div
                        className={
                          styles["calculate-tabs-content-general-title"]
                        }
                      >
                        Үндсэн зээлийн төлбөр:
                      </div>
                    </Col>
                    <Col flex="none">
                      <div
                        className={styles["calculate-tabs-information-number"]}
                      >
                        {numberToCurrency(inputValue)}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row justify="space-between" align="middle">
                    <Col flex="none">
                      <div
                        className={
                          styles["calculate-tabs-content-general-title"]
                        }
                      >
                        Хугацаа:
                      </div>
                    </Col>
                    <Col flex="none">
                      <div
                        className={styles["calculate-tabs-information-number"]}
                      >
                        14 хоног
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row justify="space-between" align="middle">
                    <Col flex="none">
                      <div
                        className={
                          styles["calculate-tabs-content-general-title"]
                        }
                      >
                        Шимтгэл:
                      </div>
                    </Col>
                    <Col flex="none">
                      <div
                        className={styles["calculate-tabs-information-number"]}
                      >
                        {numberToCurrency(816000)}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row justify="space-between" align="middle">
                    <Col flex="none">
                      <div
                        className={
                          styles["calculate-tabs-content-general-title"]
                        }
                      >
                        Бодогдох хүү:
                      </div>
                    </Col>
                    <Col flex="none">
                      <div
                        className={styles["calculate-tabs-information-rate"]}
                      >
                        {numberToCurrency(1169000)}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="center" wrap={false} gutter={10} align="middle">
                <Col flex="none">
                  <Image
                    width={20}
                    src={"/images/calculate-info.svg"}
                    preview={false}
                    alt="Information"
                  />
                </Col>
                <Col span={20}>
                  <div className={styles["calculate-tabs-information-text"]}>
                    Харилцагч та зээлийн авах эрхийн хэмжээгээ өөрт ойр салбарт
                    хандан нээлгэнэ үү.
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                className={styles["calculate-tabs-button"]}
              >
                <Row justify="center" align="middle" gutter={10}>
                  <Col flex="none">
                    <Image
                      width="100%"
                      src={"/images/carbon_calculator-check.svg"}
                      preview={false}
                      alt="Information"
                    />
                  </Col>
                  <Col flex="none">
                    <div className={styles["calculate-tabs-button-text"]}>
                      Тооцох
                    </div>
                  </Col>
                </Row>
              </Button>
            </Col>
          </Row>
        </Col>
      ),
    },
    {
      key: "2",
      label: "Авах",
      children: (
        <Col span={24}>
          <Row justify="center" align="middle" gutter={[0, 14]}>
            <Col span={24}>
              <InputNumber
                defaultValue={1}
                value={inputValue}
                // @ts-ignore
                onChange={onChange}
                formatter={(value) => numberToCurrency(value)}
                className={styles["calculate-inputNumber-div"]}
              />
            </Col>
            <Col span={24}>
              <div className={styles["calculate-tabs-content-title"]}>
                Санхүүжилт өгөх мөнгөн дүнгээ оруулна уу.
              </div>
            </Col>
            <Col span={24}>
              <Row gutter={16}>
                <Col span={12}>
                  <Select
                    defaultValue="7"
                    style={{
                      width: "100%",
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "7",
                        label: "7 хоног",
                      },
                      {
                        value: "14",
                        label: "7 хоног",
                      },
                      {
                        value: "30",
                        label: "30 хоног",
                      },
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <Select
                    style={{ width: "100%" }}
                    defaultValue="1"
                    onChange={handleChange}
                    options={[
                      {
                        value: "1",
                        label: "1.5 %",
                      },
                      {
                        value: "2",
                        label: "2.5 %",
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <div className={styles["calculate-tabs-content-title"]}>
                Ерөнхий мэдээлэл
              </div>
            </Col>
            <Col span={24}>
              <Row
                justify="center"
                className={styles["calculate-tabs-content-general-div"]}
                gutter={[0, 10]}
              >
                <Col span={24}>
                  <Row justify="space-between" align="middle">
                    <Col flex="none">
                      <div
                        className={
                          styles["calculate-tabs-content-general-title"]
                        }
                      >
                        Үндсэн зээлийн төлбөр:
                      </div>
                    </Col>
                    <Col flex="none">
                      <div
                        className={styles["calculate-tabs-information-number"]}
                      >
                        {numberToCurrency(inputValue)}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row justify="space-between" align="middle">
                    <Col flex="none">
                      <div
                        className={
                          styles["calculate-tabs-content-general-title"]
                        }
                      >
                        Хугацаа:
                      </div>
                    </Col>
                    <Col flex="none">
                      <div
                        className={styles["calculate-tabs-information-number"]}
                      >
                        14 хоног
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row justify="space-between" align="middle">
                    <Col flex="none">
                      <div
                        className={
                          styles["calculate-tabs-content-general-title"]
                        }
                      >
                        Шимтгэл:
                      </div>
                    </Col>
                    <Col flex="none">
                      <div
                        className={styles["calculate-tabs-information-number"]}
                      >
                        {numberToCurrency(816000)}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row justify="space-between" align="middle">
                    <Col flex="none">
                      <div
                        className={
                          styles["calculate-tabs-content-general-title"]
                        }
                      >
                        Бодогдох хүү:
                      </div>
                    </Col>
                    <Col flex="none">
                      <div
                        className={styles["calculate-tabs-information-rate"]}
                      >
                        {numberToCurrency(1169000)}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="center" wrap={false} gutter={10} align="middle">
                <Col flex="none">
                  <Image
                    width={20}
                    src={"/images/calculate-info.svg"}
                    preview={false}
                    alt="Information"
                  />
                </Col>
                <Col span={20}>
                  <div className={styles["calculate-tabs-information-text"]}>
                    Харилцагч та зээлийн авах эрхийн хэмжээгээ өөрт ойр салбарт
                    хандан нээлгэнэ үү.
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                className={styles["calculate-tabs-button"]}
              >
                <Row justify="center" align="middle" gutter={10}>
                  <Col flex="none">
                    <Image
                      width="100%"
                      src={"/images/carbon_calculator-check.svg"}
                      preview={false}
                      alt="Information"
                    />
                  </Col>
                  <Col flex="none">
                    <div className={styles["calculate-tabs-button-text"]}>
                      Тооцох
                    </div>
                  </Col>
                </Row>
              </Button>
            </Col>
          </Row>
        </Col>
      ),
    },
  ];
  return (
    <Row gutter={[0, 25]} justify="center">
      <Col flex="none">
        <div className={styles["calculate-title"]}>Тооцоолуур</div>
        <div className={styles["calculate-subtitle"]}>
          Тус тооцоолуур нь тухайн өдрийн биржийн зарлагдсан хүү нь дээр
          үндэслэн тооцогдохыг анхаарна уу!!!
        </div>
      </Col>
      <Col span={24}>
        <Tabs defaultActiveKey="1" items={items} tabBarGutter={0} />
      </Col>
    </Row>
  );
};
