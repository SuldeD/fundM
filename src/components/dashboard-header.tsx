import { Col, Statistic, Row } from "antd";
import { api } from "../utils/api";
import styles from "../styles/dashboard-header.module.css";
import React from "react";

export const HeaderDashboard = ({ title, subTitle }: any) => {
  const { Countdown } = Statistic;
  const { data } = api.account.accountInfo.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const targetDate: any = new Date();
  targetDate.setHours(
    data?.market_close_time?.slice(0, 2)
      ? data?.market_close_time?.slice(0, 2)
      : 14,
    0,
    0,
    0
  );

  return (
    <Col span={24}>
      <Row justify="space-between" align="middle">
        <Col xs={24} lg={12}>
          <div className={styles["header-title-name"]}>{title}</div>
        </Col>
        <Col xs={0} lg={12}>
          <Row gutter={10} justify="end" align="middle">
            <Col flex="none">
              <div className={styles["header-exchange-title"]}>
                Хаагдах хугацаа:
              </div>
            </Col>

            <Col flex="none">
              <Countdown
                value={targetDate}
                format="HH:mm:ss"
                valueStyle={{
                  fontFamily: "Raleway",
                  fontWeight: 500,
                  fontSize: 22,
                  color: "#FF0000",
                  fontStyle: "normal",
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Col xs={24} sm={24} lg={18} xl={14} style={{ paddingTop: 10 }}>
        <div className={styles["header-subtitle"]}>{subTitle}</div>
      </Col>
    </Col>
  );
};
