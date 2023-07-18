import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "app/utils/api";
import "app/styles/globals.css";
import Head from "next/head";
import MainLayout from "./mainLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  console.log("session", session);
  return (
    <>
      <Head>
        <title>FundMe</title>
        <meta name="description" content="FundMe" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" />
      </Head>{" "}
      <SessionProvider session={session}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
