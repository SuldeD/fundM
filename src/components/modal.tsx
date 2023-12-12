import { Button, Col, Image, Modal, Row } from "antd";
import styles from "../styles/modal.module.css";
import LottiePlayer from "lottie-react";
import animation from "../../public/check1.json";

export default function PopupModal({
  // @ts-ignore
  open,
  // @ts-ignore
  closeModal,
  // @ts-ignore
  modalWidth,
  // @ts-ignore
  text,
  // @ts-ignore
  buttonText,
  // @ts-ignore
  iconPath,
  // @ts-ignore
  customIconWidth,
  // @ts-ignore
  customDiv,
  // @ts-ignore
  // @ts-ignore
  closableM,
  // @ts-ignore
  buttonClick,
  // @ts-ignore
  textAlign,
}) {
  return (
    <Modal
      centered
      width={modalWidth ? modalWidth : 378}
      title={null}
      onCancel={closeModal}
      open={open}
      footer={null}
      closable={closableM ? true : false}
    >
      <Row justify="center" gutter={[0, 30]} className="py-[20px]">
        <Col span={24}>
          <Row justify="center">
            {iconPath === "json" ? (
              <LottiePlayer
                animationData={animation}
                loop={false}
                width={customIconWidth ? customIconWidth : 180}
                height={44}
              />
            ) : (
              <Image
                width={customIconWidth ? customIconWidth : 180}
                height={44}
                src={`${iconPath}.svg`}
                preview={false}
                alt="Header Logo"
              />
            )}
          </Row>
        </Col>

        {customDiv && (
          <Col span={24}>
            <Row justify="center">{customDiv}</Row>
          </Col>
        )}

        {text && text}
        <Col span={18}>
          <Col span={20} style={{ margin: "0 auto" }}>
            {buttonText && (
              <Button
                type="primary"
                className={styles["modal-button"]}
                onClick={buttonClick}
              >
                {buttonText}
              </Button>
            )}
          </Col>
        </Col>
      </Row>
    </Modal>
  );
}
