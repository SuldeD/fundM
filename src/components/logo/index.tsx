import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

export interface LogoProps {
  width?: number;
  disabled?: boolean;
  customTheme?: string;
}

function Logo({ width, disabled, customTheme }: LogoProps) {
  const [themeEf, setThemeEf] = useState("light");
  const { theme } = useTheme();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setThemeEf(storedTheme);
    }
  }, [theme]);

  return (
    <div className="h-[40px] w-[150px] overflow-hidden">
      <Link href={disabled ? "" : "/"} legacyBehavior passHref>
        <Image
          className={disabled ? "" : "cursor-pointer"}
          src={
            customTheme === "light"
              ? "logo-white.svg"
              : customTheme === "dark"
              ? "logo.svg"
              : themeEf === "dark"
              ? "logo-white.svg"
              : "logo.svg"
          }
          alt="Picture of the logo"
          width={width ?? 150}
          height={120}
        />
      </Link>
    </div>
  );
}

export default Logo;
