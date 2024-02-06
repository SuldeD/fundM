import { Button, Col, Image, Modal, Row } from "antd";
import styles from "../styles/modal.module.css";
import LottiePlayer from "lottie-react";
import animation from "../../public/check.json";
import animation2 from "../../public/warn.json";
import { MouseEventHandler } from "react";

export default function PopupModal({
  open,
  closeModal,
  modalWidth,
  text,
  buttonText,
  iconPath,
  customIconWidth,
  customDiv,
  closableM,
  buttonClick,
  textAlign,
}: {
  open: boolean;
  closeModal: any;
  modalWidth: any;
  text: any;
  buttonText: string;
  iconPath: string;
  customIconWidth: any;
  customDiv: any;
  closableM: any;
  buttonClick: MouseEventHandler<HTMLElement>;
  textAlign: string;
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
            ) : iconPath === "json2" ? (
              <div className="w-[160px]">
                <LottiePlayer animationData={animation2} loop={false} />
              </div>
            ) : (
              iconPath?.length > 0 && (
                <Image
                  width={customIconWidth ? customIconWidth : 180}
                  height={44}
                  src={`${iconPath}.svg`}
                  preview={false}
                  alt="Header Logo"
                />
              )
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
