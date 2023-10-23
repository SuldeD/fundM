import { Col, Row, Image, Button, Empty } from "antd";
import styles from "../styles/loan-take-req.module.css";
import { numberToCurrency } from "../utils/number.helpers";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { useAppContext } from "app/context/appContext";

export const LoanTakeReqComponent = ({ activeLoanOrders: data }: any) => {
  const router = useRouter();
  const { setMyFundTabKey } = useAppContext();

  return (
    <Row gutter={[0, 25]} justify="center">
      <Col span={24}>
        <div className={styles["loanReq-title"]}>Зээл авах хүсэлт</div>
      </Col>
      <Col span={24}>
        <div className={styles["loanReq-description"]}>
          Та манай платиниум болон даймонд харилцагч болсноор давуу эрхтэйгээр
          зээл авах боломжтой. Дэлгэрэнгүйг тусламж цэсний харилцагчийн
          үйлчилгээний хэсгээс харна уу.
        </div>
      </Col>
      <Col span={24}>
        {data ? (
          data?.map((el: any, indx: number) => (
            <Fragment key={`id-${indx}`}>
              {indx === 0 ? (
                <Row
                  align="middle"
                  justify="end"
                  className={clsx({
                    // @ts-ignore
                    [styles["loanReq-row-div"]]: true,
                    // @ts-ignore
                    [styles["loanReq-row-div-end"]]: data.length - 1 === indx,
                  })}
                >
                  <Col span={22}>
                    <Row align="middle">
                      <Col span={5}>
                        <div className={styles["loanReq-list-number"]}>
                          {el.is_my_request == "1" ? (
                            <div className={styles["loanReq-start"]}>
                              <Image
                                width={23}
                                src="/images/star.svg"
                                preview={false}
                              />
                            </div>
                          ) : (
                            indx + 1
                          )}
                        </div>
                      </Col>
                      <Col span={19}>
                        <Row justify="center" align="middle" gutter={[0, 10]}>
                          <Col span={12}>
                            <Row justify="center">
                              <Col span={24}>
                                <div className={styles["loanReq-list-title"]}>
                                  Зээлийн хэмжээ
                                </div>
                              </Col>
                              <Col span={24}>
                                <div
                                  className={styles["loanReq-list-currency-1"]}
                                >
                                  {numberToCurrency(el.loan_amount)}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={12}>
                            <div
                              className={styles["loanReq-list-percent-title"]}
                            >
                              Биелэлт
                            </div>

                            <div className={styles["loanReq-list-percent"]}>
                              {Math.round(Number(el.filled_percent))} %
                            </div>
                          </Col>
                          <Col span={24}>
                            <Row justify="space-between" align="middle">
                              <Col flex="none">
                                <div
                                  className={
                                    styles["loanReq-list-rate-title-1"]
                                  }
                                >
                                  Хүү
                                </div>
                                <div
                                  className={styles["loanReq-list-currency-1"]}
                                >
                                  {el.rate_month}
                                </div>
                              </Col>
                              <Col span={12}>
                                <Row justify="center">
                                  <Col span={24}>
                                    <div
                                      className={
                                        styles["loanReq-list-rate-title-2"]
                                      }
                                    >
                                      Хоног
                                    </div>
                                  </Col>
                                  <Col span={24}>
                                    <div
                                      className={
                                        styles["loanReq-list-currency-2"]
                                      }
                                    >
                                      {el.duration}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                          <Col className="mt-2 w-full">
                            <Button
                              type="primary"
                              className={styles["loanReq-list-button"]}
                              onClick={() => router.push("/dashboard/loan")}
                            >
                              Зээл авах
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ) : (
                <Row
                  align="middle"
                  justify="end"
                  className={clsx({
                    // @ts-ignore
                    [styles["loanReq-row-div"]]: true,
                    // @ts-ignore
                    [styles["loanReq-row-div-end"]]: data.length - 1 === indx,
                  })}
                >
                  <Col span={22}>
                    <Row align="middle">
                      <Col span={5}>
                        <div className={styles["loanReq-list-number"]}>
                          {el.is_my_request == "1" ? (
                            <div className={styles["loanReq-start"]}>
                              <Image
                                width={23}
                                src="/images/star.svg"
                                preview={false}
                              />
                            </div>
                          ) : (
                            indx + 1
                          )}
                        </div>
                      </Col>
                      <Col span={19}>
                        <Row justify="center" align="middle">
                          <Col span={12}>
                            <Row justify="center">
                              <Col span={24}>
                                <div className={styles["loanReq-list-title"]}>
                                  Зээлийн хэмжээ
                                </div>
                              </Col>
                              <Col span={24}>
                                <div
                                  className={styles["loanReq-list-currency-1"]}
                                >
                                  {numberToCurrency(el.loan_amount)}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={5}>
                            <Row justify="center">
                              <Col span={24}>
                                <div
                                  className={
                                    styles["loanReq-list-rate-title-2"]
                                  }
                                >
                                  Хүү
                                </div>
                              </Col>
                              <Col span={24}>
                                <div
                                  className={styles["loanReq-list-currency-2"]}
                                >
                                  {el.rate_month}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={5}>
                            <Row justify="center">
                              <Col span={24}>
                                <div
                                  className={
                                    styles["loanReq-list-rate-title-2"]
                                  }
                                >
                                  Хоног
                                </div>
                              </Col>
                              <Col span={24}>
                                <div
                                  className={styles["loanReq-list-currency-2"]}
                                >
                                  {el.duration}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Fragment>
          ))
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          className={styles["loanReq-button"]}
          onClick={() => {
            router.push("/dashboard/myfund/list");
            setMyFundTabKey("1");
          }}
        >
          Бүгдийг харах
        </Button>
      </Col>
    </Row>
  );
};
