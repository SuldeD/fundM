import { ProtectedLayout } from "app/cmsLayout";
import SimpleLayout from "app/layout";
import { useSession } from "next-auth/react";
import React from "react";
import { Loaderr } from "./Loader";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  return (
    <div>
      {status === "authenticated" ? (
        <ProtectedLayout> {children}</ProtectedLayout>
      ) : status == "loading" ? (
        <Loaderr />
      ) : (
        <SimpleLayout>{children}</SimpleLayout>
      )}
    </div>
  );
}

export default MainLayout;
