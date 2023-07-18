import { Col, Statistic, Row } from "antd";
import styles from "../styles/dashboard-header.module.css";

// @ts-ignore
export const HeaderDashboard = ({ title, subTitle }) => {
  const { Countdown } = Statistic;
  const deadline = Date.now() + 1000 * 10 * 24 * 2 + 1000 * 30;
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
                Бирж хаагдах хугацаа:
              </div>
            </Col>
            <Col flex="none">
              <Countdown
                value={deadline}
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
