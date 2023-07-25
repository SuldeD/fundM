import { Col, Modal, Row, Input } from "antd";
import { HeaderDashboard } from "app/components/header";
import { useApiContext } from "app/context/dashboardApiContext";
import { useState } from "react";
import styles from "../../../styles/profile.module.css";
import stylesL from "../../../styles/dloan.module.css";

export default function Bank() {
  const { helpBankList, addBankMutate } = useApiContext();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { error } = Modal;

  function submit() {
    console.log(password, number, selectedBank);
    addBankMutate(
      { password, account_num: number, bank_id: selectedBank },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data.success) {
            console.log(data);
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  }

  return (
    <div className="mx-[30px] my-[40px]">
      <HeaderDashboard
        title={"Банкны данс холбох"}
        subTitle={
          "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
        }
      />

      <div className={`${styles["profile-bankaccount-title"]} pb-[8px]`}>
        Банк сонгох
      </div>
      <select
        className={`w-full rounded-[12px] border-black bg-bank p-[16px]`}
        name="bank_id"
        onChange={(e) => setSelectedBank(e.target.value)}
      >
        <option value={""}>Банк сонгон уу!</option>
        {helpBankList?.bank_list.map((list: any, idx: any) => (
          <option key={`option ${idx}`} value={`${list.bank_id}`}>
            {list.bank_name}
          </option>
        ))}
      </select>
      <div
        className={`${styles["profile-bankaccount-title"]} pb-[8px] pt-[16px]`}
      >
        Дансны дугаар оруулах
      </div>
      <input
        onChange={(e) => setNumber(e.target.value)}
        name="bank_number"
        type="number"
        className="w-full rounded-[12px] border-black bg-bank p-[16px]"
      />
      <div className="mt-[40px] text-right">
        <input
          className="w-[100%] max-w-[195px] cursor-pointer rounded-[10px] bg-primary p-[8px] px-[8px] text-[14px] font-normal text-white"
          type="button"
          onClick={() => {
            selectedBank.length > 0 && number.length > 0 && setOpen(true);
          }}
          value={"Баталгаажуулах код авах"}
        />
      </div>

      <Modal
        centered
        width={378}
        title={
          <div className="mx-auto my-[20px] w-[50%] text-center font-raleway text-[18px] font-bold">
            Баталгаажуулах код оруулах
          </div>
        }
        closable={false}
        open={isOpen}
        footer={null}
      >
        <Row justify="center">
          <Col span={20}>
            <Row justify="center" gutter={[0, 20]}>
              <Col span={24}>
                <Input.Password
                  className={stylesL["dloan-modal-verify-input"]}
                  placeholder="баталгаажуулах кодоо оруулна уу!!!"
                  name="password"
                  maxLength={4}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </Col>
              <Col span={20}>
                <div className="text-center font-raleway text-[12px] font-normal text-sub">
                  Бид таны бүртгүүлсэн банкны дансруу нэг удаагын баталгаажуулах
                  код илгэлээ.
                </div>
              </Col>
              <Col span={20}>
                <button
                  type="submit"
                  onClick={password.length > 0 ? submit : undefined}
                  className={`${stylesL["dloan-modal-verify-button"]} bg-primary text-white`}
                >
                  Баталгаажуулах
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
