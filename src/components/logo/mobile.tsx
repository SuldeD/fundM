import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function MobileLogo() {
  //   const [themeEf, setThemeEf] = useState("light");
  //   const { theme } = useTheme();

  //   useEffect(() => {
  //     const storedTheme = localStorage.getItem("theme");
  //     if (storedTheme) {
  //       setThemeEf(storedTheme);
  //     }
  //   }, [theme]);

  return (
    <div className="flex h-[70px] w-[70px] items-center justify-center ">
      <Link href={"/"} legacyBehavior passHref>
        <Image
          className={"cursor-pointer "}
          src={"mobileLogo.svg"}
          alt="Picture of the mobile logo"
          width={500}
          height={500}
        />
      </Link>
    </div>
  );
}

export default MobileLogo;
