import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../../app/ui/navigation-menu";
import { Button } from "../../app/ui/button";
import MobileDrawer from "../components/mobile-drawer";
import { ThemeToggle } from "../components/theme-toggle";
import Logo from "../components/logo";
import { Toggle } from "../../app/ui/toggle";
import { navigationMenu } from "../contants";
import { Separator } from "../../app/ui/separator";
import React from "react";

export const HeaderComponent = () => {
  return (
    <div className="flex w-full items-center justify-between px-8 py-5">
      <Logo />
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {navigationMenu.map((item) => {
            return (
              <NavigationMenuItem key={item.key}>
                <Link href={item.link} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="hidden items-center gap-2 md:flex">
        <Link href="/signup" className="flex items-center">
          <Toggle>Бүртгүүлэх</Toggle>
        </Link>
        <Link href="/login">
          <Button variant="primary">Нэвтрэх</Button>
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex items-center md:hidden">
        <ThemeToggle />
        <Separator orientation="vertical" className="h-5" />
        <MobileDrawer />
      </div>
    </div>
  );
};

export default HeaderComponent;
