import { Col, Row } from "antd";
import styles from "../../styles/loan.module.css";
import stylesHome from "../../styles/Home.module.css";
import { useSession } from "next-auth/react";
import { Loaderr } from "app/components/Loader";

export const Loan = () => {
  const { data } = useSession();
  if (data) {
    return <Loaderr />;
  } else {
    return (
      <Row
        className={styles["loan-background-image"]}
        justify="center"
        align={"middle"}
      >
        <div className={stylesHome["filter-image"]} />
        <Col span={20} className={styles["loan-col-padding"]}>
          <Row justify="start" gutter={[0, 54]}>
            <Col span={24}>
              <div className={styles["loan-title-text"]}>Зээл авах</div>
            </Col>
            <Col span={24}>
              <div className={styles["loan-text"]}>
                Эрхэм харилцагч та зээлийн судалгаанд хамрагдаж, өөрийн
                санхүүгийн чадамжинд тохирох зээлийн эрхийг нэг жилийн
                хугацаатайгаар гэрээ байгуулж баталгаажуулснаар зээл авах
                боломжтой болно.
              </div>
            </Col>
            <Col span={24}>
              <div className={styles["loan-text"]}>Бүрдүүлэх материал:</div>
              <ul className={`${styles["loan-paragraph"]} list-disc`}>
                <li>ААН гэрчилгээ дүрэм</li>
                <li>Гүйцэтгэх захиралын иргэний үнэмлэх</li>
                <li>Сүүлийн 1 жилийн дансны хуулга</li>
                <li>Сүүлийн 2 жилийн санхүүгийн тайлан</li>
                <li>
                  Бизнесийн үйл ажиллагаатай холбоотой гэрээ хэлцэл, тусгай
                  зөвшөөрөл, түрээсийн гэрээ
                </li>
                <li>Барьцаа хөрөнгийг гэрчлэх баримт</li>
                <li>Зээл хүссэн албан тоот</li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
};

export default Loan;
