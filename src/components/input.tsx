import { Button, Col, Image, Modal, Row } from "antd";
import React, { useState, useRef } from "react";
import styles from "../styles/dloan.module.css";

export const InputCode = ({ setOpen, open, onFinish }: any) => {
  const length = 4;
  const { error } = Modal;
  const [code, setCode] = useState<any>([...Array(length)].map(() => ""));
  const [loadings, setLoadings] = useState<boolean>(false);

  const inputs = useRef<any>([]);
  useRef<(HTMLInputElement | null)[]>([]);

  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: any) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    if (slot !== length - 1) {
      inputs.current[slot + 1].focus();
    }
    if (newCode.every((num) => num !== "")) {
      //   onComplete(newCode.join(""));
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: any) => {
    if (e.keyCode === 8 && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = "";
      setCode(newCode);
      inputs.current[slot - 1].focus();
    }
  };

  function submit() {
    setLoadings(true);
    if (Number(code.join("")) > 1000) {
      onFinish(Number(code.join("")));
      setLoadings(false);
    } else {
      error({
        title: "Амжилтгүй",
        content: <div>FundMe кодоо оруулна уу!</div>,
      });
    }
  }

  return (
    <div className="code-input">
      <div className="flex gap-5">
        <Modal
          centered
          width={378}
          title={
            <div className={styles["dloan-modal-verify-title"]}>
              <Image
                width="50%"
                src={"/logo.svg"}
                preview={false}
                alt="Header Logo"
              />
            </div>
          }
          closable={true}
          open={open}
          footer={null}
          onCancel={() => setOpen(false)}
        >
          <Row justify="center">
            <Col span={20}>
              <Row justify="center" gutter={[0, 20]}>
                <Col span={20} className="flex justify-between">
                  {code.map(
                    (
                      num: string | number | readonly string[] | undefined,
                      idx: React.Key | null | undefined
                    ) => {
                      return (
                        <input
                          key={idx}
                          type="text"
                          inputMode="numeric"
                          className="w-[40px] rounded-[9px] border border-[#1375ED] p-2 text-center"
                          maxLength={1}
                          value={num}
                          autoFocus={!code[0].length && idx === 0}
                          onChange={(e) => processInput(e, idx)}
                          onKeyUp={(e) => onKeyUp(e, idx)}
                          ref={(ref) => inputs.current.push(ref)}
                        />
                      );
                    }
                  )}
                </Col>
                <Col span={20}>
                  <div className="mb-[10px] text-center font-raleway font-[12px] leading-[20px] text-sub">
                    Та өөрийн{" "}
                    <span className="font-semibold text-[#0300B4]">
                      FundMe код{" "}
                    </span>
                    оруулж санхүүжилт өгөх хүсэлтээ баталгаажуулна уу.
                  </div>
                </Col>
                <Col span={20}>
                  <Button
                    type="primary"
                    loading={loadings}
                    className={styles["dloan-modal-verify-button"]}
                    onClick={submit}
                  >
                    Баталгаажуулах
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>
      </div>
    </div>
  );
};

export default InputCode;
