import { Col, Row } from "antd";
import { Loaderr } from "app/components/Loader";
import { useSession } from "next-auth/react";
import styles from "../../styles/about-us.module.css";
import stylesHome from "../../styles/Home.module.css";
import SimpleLayout from "app/layout";

export const AboutUS = () => {
  const { data } = useSession();
  if (data) {
    return null;
  } else {
    return (
      <SimpleLayout>
        <Row
          className={styles["about-us-background-image"]}
          justify="center"
          align={"middle"}
        >
          <div className={stylesHome["filter-image"]} />
          <Col span={20} className={styles["about-us-col-padding"]}>
            <Row justify="start" gutter={[0, 54]}>
              <Col span={24}>
                <div className={styles["about-us-title-text"]}>
                  Бидний тухай
                </div>
              </Col>
              <Col span={24}>
                <div className={styles["about-us-text"]}>
                  “ФАНД МИ БИРЖ” ХК нь Монгол улсын зах зээлд анх удаа
                  технологийн дэвшлийг санхүүгийн үйлчилгээтэй хамтатгасан
                  Финтек бизнес моделийг Fundme аппликейшн болон веб сайтаар
                  дамжуулан амжилттай нэвтрүүлж буй цахим мөнгөний биржийн
                  үйлчилгээ үзүүлэгч байгууллага юм.
                </div>
              </Col>
              <Col span={24}>
                <div className={styles["about-us-text"]}>
                  Бидны зорилго нь аж ахуй нэгжүүдийн богино хугацаат санхүүгийн
                  хэрэгцээ болон илүүдэл мөнгөн хөрөнгийг харилцан ашигтайгаар
                  технологийн шийдлийг ашиглан холбоход оршино.
                </div>
              </Col>
              <Col span={24}>
                <div className={styles["about-us-text"]}>Бидний давуу тал:</div>
                <ul className={`${styles["about-us-paragraph"]} list-disc`}>
                  <li>Хэрэглэхэд хялбар</li>
                  <li>Хүү бага</li>
                  <li>Найдвартай</li>
                  <li>Мэдээллийн аюулгүй байдлыг бүрэн хангасан</li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </SimpleLayout>
    );
  }
};

export default AboutUS;
