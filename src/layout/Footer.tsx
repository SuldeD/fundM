import { Layout, Col, Row, Image } from "antd";
const { Footer } = Layout;
import style from "../styles/Footer.module.css";
import Link from "next/link";

export const FooterComponent = () => {
  return (
    <Footer className={style["footer-style"]}>
      <Row justify="center" id="contact">
        <Col span={18} className={style["padding-div"]}>
          <Row justify="space-between" gutter={[0, 55]}>
            <Col span={24}>
              <Image width={180} src={"/logo.svg"} preview={false} alt="Logo" />
            </Col>
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <div className={style["title-text"]}>FundMe</div>
                <ul className={`${style["paragraph-text"]} list-disc`}>
                  <Link href="/finance">
                    <li>Санхүүжилт өгөх</li>
                  </Link>
                  <Link href="/loan">
                    <li>Зээл авах</li>
                  </Link>
                </ul>
              </Col>
            </Row>
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <div className={style["title-text"]}>Холбоо барих</div>
                <div className={style["footer-text"]}>info@fundme.mn</div>
                <div className={style["footer-text"]}>72229911</div>
                <div className={style["footer-text"]}>Даваа-Баасан :</div>
                <div className={style["footer-text"]}>
                  Өглөө 9:30 - Орой 17:30
                </div>
                <div className={style["footer-text"]}>Бямба-Ням : Амарна</div>
              </Col>
            </Row>
            <Row gutter={[0, 24]}>
              <Col>
                <div className={style["title-text"]}>Байрлал</div>
                <div className={style["footer-text"]}>
                Улаанбаатар хот, Сүхбаатар дүүрэг,
                </div>
                <div className={style["footer-text"]}>
                8-р хороо Бага тойруу /14200/,
                </div>
                
                <div className={style["footer-text"]}>
                Б. Алтангэрэлийн гудамж-5,
                </div>
                <div className={style["footer-text"]}>
                Сити центр 7 давхар 701 тоот
                </div>
                <Image
                  width={232}
                  src="/images/footer-map.jpg"
                  preview={false}
                  style={{ paddingTop: 14 }}
                  alt="Mongolian Location"
                />
              </Col>
            </Row>
          </Row>
        </Col>

        <Col span={24}>
          <Row
            justify="center"
            align="middle"
            className={style["footer-copyright"]}
          >
            Bichil Globus © 2024 by Infinity Solutions
          </Row>
        </Col>
      </Row>
    </Footer>
  );
};

export default FooterComponent;
