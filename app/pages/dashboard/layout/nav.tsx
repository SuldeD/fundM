import Link from "next/link";
import React from "react";
import { cn } from "../../../../lib/utils";
import { buttonVariants } from "../../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    link: string;
    icon?: any;
    image?: any;
    variant: "default" | "ghost";
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group mt-4 flex flex-col gap-6 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-3 px-5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-4">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.link}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-12 w-12",
                    link.variant === "default" &&
                      "border-2 border-primary bg-muted text-primary dark:border-white dark:bg-gray-900 dark:text-white",
                    "hover:bg-muted dark:hover:bg-gray-900"
                  )}
                >
                  {link.image ? (
                    <div className="h-8 w-8">{link.image}</div>
                  ) : (
                    <link.icon className="h-6 w-6" />
                  )}
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.link}
              className={cn(
                buttonVariants({ variant: link.variant, size: "md" }),
                link.variant === "default" &&
                  "border-primary bg-muted text-primary dark:border-white dark:bg-gray-900 dark:text-white",
                link.variant === "ghost" &&
                  "border-white dark:border-transparent",
                "justify-start border-2 hover:bg-muted dark:hover:bg-gray-900"
              )}
            >
              {link.image ? (
                <div className="mr-4 h-6 w-6">{link.image}</div>
              ) : (
                <link.icon className="mr-4 h-6 w-6" />
              )}
              <p className="text-sm font-medium">{link.title}</p>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
