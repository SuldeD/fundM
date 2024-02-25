import { Metadata } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import { AppType } from "next/app";
import { ThemeProvider } from "../components/theme-provider";
import { AppWrapper } from "../context/appContext";

import "../styles/globals.css";
import { siteConfig } from "../../config/site";
import { cn } from "../../lib/utils";
import MainLayout from "../components/main-layout";
import { fontLato } from "../../lib/fonts";

import React from "react";
import { Toaster as Sonner } from "../../app/ui/sonner";
import { Toaster } from "../../app/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/logo.svg",
  },
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <AppWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div
              className={cn("bg-background antialiased", fontLato.className)}
            >
              <MainLayout>
                <div className="relative flex flex-col">
                  <div className="flex-1">
                    <Component {...pageProps} />
                    <Toaster />
                    <Sonner />
                  </div>
                </div>
              </MainLayout>
            </div>
          </ThemeProvider>
        </AppWrapper>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
