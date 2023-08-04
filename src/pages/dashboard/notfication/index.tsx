import { Modal } from "antd";
import { api } from "app/utils/api";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Notfication() {
  const { mutate } = api.loan.notficationSearch.useMutation();

  const { error } = Modal;

  useEffect(() => {
    mutate(
      {
        order: "date",
        order_up: "1",
        page: "1",
        page_size: "1",
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            console.log(data);
          } else {
            signOut();
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  }, []);
  return <div></div>;
}
