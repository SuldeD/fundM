import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "app/utils/api";
import "app/styles/globals.css";
import Head from "next/head";
import mnMN from "antd/locale/mn_MN";
import { ConfigProvider, App as AntdApp } from "antd";
import MainLayout from "./layout";
import { AppWrapper } from "app/context/appContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>FundMe</title>
        <meta name="description" content="FundMe" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <SessionProvider session={session}>
        <AntdApp>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#0300B4",
              },
            }}
            locale={mnMN}
          >
            <AppWrapper>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </AppWrapper>
          </ConfigProvider>
        </AntdApp>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
