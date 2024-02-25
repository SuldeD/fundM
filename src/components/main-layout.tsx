// import HeaderComponent from "../layout/header";
// import FooterComponent from "../layout/footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { regex, regexForgot, regexLogin, regexRegister } from "../contants";
import Cookie from "cookie-universal";
import React from "react";
import DashLayout from "../../app/pages/dashboard/layout";
import HeaderComponent from "app/layout/Header";
import FooterComponent from "app/layout/Footer";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  const cookies = Cookie();
  const layout = cookies.get("react-resizable-panels:layout");
  const collapsed = cookies.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? layout?.value : undefined;
  const defaultCollapsed = collapsed ? collapsed?.value : undefined;

  if (regex.test(router.route) || status === "authenticated") {
    return (
      <div>
        <DashLayout
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={2}
        >
          {children}
        </DashLayout>
      </div>
    );
  } else if (
    regexLogin.test(router.asPath) ||
    regexForgot.test(router.asPath) ||
    regexRegister.test(router.asPath)
  ) {
    return <div>{children}</div>;
  } else {
    return (
      <div>
        <HeaderComponent />
        {children}
        <FooterComponent />
      </div>
    );
  }
}

export default MainLayout;
