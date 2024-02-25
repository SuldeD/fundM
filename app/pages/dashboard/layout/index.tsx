// import { Icons } from "app/ui/icons";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../../ui/resizable";
import { TooltipProvider } from "../../../ui/tooltip";
import { useState } from "react";
import { Nav } from "./nav";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";
import { Icons } from "../../../ui/icons";
import Logo from "../../../../src/components/logo";
import MobileLogo from "../../../../src/components/logo/mobile";
import { Separator } from "../../../ui/separator";
import { cn } from "../../../../lib/utils";
import { ThemeToggle } from "../../../../src/components/theme-toggle";

interface DashProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: any;
}

function DashLayout({
  defaultLayout = [300, 440],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: DashProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const router = useRouter();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={20}
          maxSize={26}
          onResize={(e) => {
            e > 12 ? setIsCollapsed(false) : setIsCollapsed(true);
            e > 12
              ? (document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                  false
                )}`)
              : (document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                  true
                )}`);
          }}
          className={cn(
            isCollapsed && "transition-all duration-300 ease-in-out",
            "hidden min-w-[80px] md:block"
          )}
        >
          <div>
            {isCollapsed ? (
              <div className="mx-5 ms-5">
                <MobileLogo />
              </div>
            ) : (
              <div className="mx-5 my-4">
                <Logo />
              </div>
            )}
          </div>

          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Дашбоард",
                link: "/dashboard",
                icon: Icons.dash,
                variant: router.asPath === "/dashboard" ? "default" : "ghost",
              },
              {
                title: "Миний санхүүжилт",
                link: "/dashboard/foundation",
                icon: Icons.found,
                variant:
                  router.asPath === "/dashboard/foundation"
                    ? "default"
                    : "ghost",
              },
              {
                title: "Зээл авах",
                link: "/dashboard/loan",
                icon: Icons.loan,
                variant:
                  router.asPath === "/dashboard/loan" ? "default" : "ghost",
              },
              {
                title: "Миний санхүү",
                link: "/dashboard/myfund",
                icon: Icons.myfund,
                variant:
                  router.asPath === "/dashboard/myfund" ? "default" : "ghost",
              },
              {
                title: "Миний захиалгууд",
                link: "/dashboard/fund",
                icon: Icons.fund,
                variant:
                  router.asPath === "/dashboard/fund" ? "default" : "ghost",
              },
              {
                title: "Миний мэдээлэл",
                link: "/dashboard/profile",
                image: (
                  <Image
                    alt="gender"
                    className={"rounded-[50%] bg-blue-300"}
                    width={500}
                    height={500}
                    src={"https://www.svgrepo.com/show/31050/man.svg"}
                  />
                ),
                variant:
                  router.asPath === "/dashboard/profile" ? "default" : "ghost",
              },
            ]}
          />
          <ThemeToggle />
          <div onClick={() => signOut()}>sign out</div>
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {children}
        </ResizablePanel>

        <div className="hidden w-[350px] border-l border-zinc-200  dark:border-zinc-800 dark:bg-zinc-800 lg:flex">
          main
        </div>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

export default DashLayout;
