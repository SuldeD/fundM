import { Col, Row } from "antd";
import { useSession } from "next-auth/react";
import styles from "../../styles/finance.module.css";
import stylesHome from "../../styles/Home.module.css";
import SimpleLayout from "app/layout";

export const Finance = () => {
  const { data } = useSession();
  if (data) {
    return null;
  } else {
    return (
      <Row
        className={styles["finance-background-image"]}
        justify="center"
        align={"middle"}
      >
        <div className={stylesHome["filter-image"]} />
        <Col span={20} className={styles["finance-col-padding"]}>
          <Row justify="start" gutter={[0, 54]}>
            <Col span={24}>
              <div className={styles["finance-title-text"]}>
                Санхүүжилт өгөх
              </div>
            </Col>
            <Col span={24}>
              <div className={styles["finance-text"]}>
                “Хэрэв та богино хугацаанд бусад төрлийн хөрөнгө оруулалт болон
                хадгаламжийн хүүнээс илүү хүүний өгөөж хүртэхийг эрэлхийлж буй
                бол та бидэнтэй нэгдээрэй.”
              </div>
            </Col>
            <Col span={24}>
              <div className={styles["finance-text"]}>Тавигдах шаардлага:</div>
              <ul className={`${styles["finance-paragraph"]} list-disc`}>
                <li>Эцсийн өмчлөгчийг үнэн зөв тодорхойлох боломжтой байх;</li>
                <li>
                  Дампуурлын хэрэг болон татан буулгах үйл ажиллагаа эхлүүлээгүй
                  байх;
                </li>
                <li>
                  Холбогдох хууль хяналтын байгууллагаар шалгагдаж байгаа болон
                  хамтран ажилласнаар цаашид эрсдэл үүсэж болзошгүй нөхцөл
                  байдал үүсээгүй байх;
                </li>
                <li>
                  Мөнгө угаах тероризмыг санхүүжүүлэхтэй тэмцэх тухай хуулийн
                  дагуу орлогын эх үүсвэр нь тодорхой байх;
                </li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
};

export default Finance;
