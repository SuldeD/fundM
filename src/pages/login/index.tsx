import { getCsrfToken, useSession } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Loaderr } from "app/components/Loader";
import { Button, Col, Input, Row } from "antd";
import { useState } from "react";
import styles from "app/styles/login.module.css";
import SimpleLayout from "app/layout";

export default function Login({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const { error } = router.query;
  const { data } = useSession();

  const [status, setStatus] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  if (data) {
    return <Loaderr />;
  } else {
    return (
      <SimpleLayout>
        <div className="bg-black bg-[url('/images/about.png')] bg-cover bg-top bg-no-repeat py-[80px]">
          <Row justify="center">
            <Col span={22}>
              <div className="container mx-auto md:px-[80px]">
                <div className="inter text-[40px] font-bold leading-[48px] text-[#fff]">
                  Fund Me нэвтрэх
                </div>
                {error && <p className="mt-2 max-w-md text-red-500">{error}</p>}
                <form
                  method="post"
                  action="/api/auth/callback/credentials"
                  className="max-w-[396px]"
                >
                  <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />
                  <label>
                    <p className="mt-[25px] pb-[13px] font-inter text-[14px] font-normal leading-[14px] text-[#fff]">
                      Гар утасны дугаар оруулах
                    </p>
                    <input
                      className="w-full rounded-[21px] border border-white bg-[#fff] px-5 py-3 text-[14px] focus:outline-none"
                      name="username"
                      type="tel"
                      pattern="[6789][0-9]{7}"
                      title="Утасны дугаар oruulna uu"
                      autoFocus
                      onChange={(e) => {
                        setPhone(e.target.value);
                        return e;
                      }}
                    />
                  </label>
                  <label>
                    <p className="mt-[25px] pb-[13px] font-inter text-[14px] font-normal leading-[14px] text-[#fff]">
                      Нууц үг оруулах
                    </p>
                    <Input.Password
                      className="w-full rounded-[21px] border border-white bg-[#fff] px-5 py-3 text-[14px] focus:outline-none"
                      name="password"
                      type="password"
                      onChange={(e) => {
                        setPass(e.target.value);
                        return e;
                      }}
                    />
                    {pass.length < 8 ? (
                      <p className="mt-3 h-[30px] max-w-md text-red-500 duration-700">
                        Таны нууц үг багадаа 8 оронтой байна
                      </p>
                    ) : (
                      <p className="mt-3 h-[30px] max-w-md text-red-500 duration-700"></p>
                    )}
                  </label>
                  <p
                    className=" cursor-pointer  text-end font-inter text-[14px] font-normal leading-[14px] text-[#fff]"
                    onClick={() => router.push("/forgot")}
                  >
                    Нууц үгээ мартсан уу ?
                  </p>
                  <div className="mt-[42px] flex justify-between">
                    <Col span={24}>
                      <Row justify="space-between" gutter={25}>
                        <Col span={12}>
                          <Button
                            className={styles["signup-button"]}
                            type="dashed"
                            disabled={status == "loading"}
                          >
                            Бүртгүүлэх
                          </Button>
                        </Col>
                        <Col span={12}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className={styles["login-button"]}
                            loading={status == "loading"}
                            onClick={() => {
                              data
                                ? router.push("/dashboard")
                                : setStatus("loading");
                            }}
                            disabled={pass.length < 8 || phone.length < 8}
                          >
                            Нэвтрэх
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </div>
      </SimpleLayout>
    );
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
