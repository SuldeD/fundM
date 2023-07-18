import { Button, Col, Image, Modal, Row } from "antd";
import styles from "../styles/modal.module.css";

export default function PopupModal({
  // @ts-ignore
  open,
  // @ts-ignore
  closeModal,
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
  closableM,
  // @ts-ignore
  buttonClick,
}) {
  return (
    <Modal
      centered
      width={378}
      title={null}
      onCancel={closeModal}
      open={open}
      footer={null}
      closable={closableM ? false : true}
    >
      <Row justify="center" gutter={[0, 30]} style={{ padding: "30px 0" }}>
        <Col span={24}>
          <Row justify="center">
            {iconPath && (
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

        <Col span={18}>
          {text && <p className={styles["modal-body-text"]}>{text}</p>}
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
