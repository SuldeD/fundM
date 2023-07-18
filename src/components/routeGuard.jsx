// import { useState, useEffect, useContext } from "react";
// import { useRouter } from "next/router";
// import Cookie from "cookie-universal";
// import { AppWrapper, useAppContext } from "@/context/appContext";

// export { RouteGuard };

// function RouteGuard({ children }) {
//   const router = useRouter();
//   const [authorized, setAuthorized] = useState(false);
//   const cookies = Cookie();

//   const token = cookies.get("_su_token");

//   useEffect(() => {
//     authCheck(router.asPath);

//     const hideContent = () => setAuthorized(false);
//     router.events.on("routeChangeStart", hideContent);

//     router.events.on("routeChangeComplete", authCheck);

//     return () => {
//       router.events.off("routeChangeStart", hideContent);
//       router.events.off("routeChangeComplete", authCheck);
//     };
//   }, []);

//   function authCheck(url) {
//     const publicPaths = [
//       "/login",
//       "/signup",
//       "/signup/verify-phone",
//       "/signup/password",
//       "/signup/question",
//       "/signup/transaction-password",
//       "/",
//       "/about-us",
//       "/finance",
//       "/loan",
//       "/#app",
//       "/#contact",
//     ];
//     const privatePaths = [
//       "/dashboard",
//       "/dashboard/fund",
//       "/dashboard/myfund",
//       "/dashboard/history",
//       "/dashboard/loan",
//       "/dashboard/foundation",
//       "/dashboard/profile",
//     ];
//     const path = url.split("?")[0];
//     if (
//       (!token && publicPaths.includes(path)) ||
//       (token && privatePaths.includes(path))
//     ) {
//       setAuthorized(true);
//     } else if (!token && !publicPaths.includes(path)) {
//       router.push("/");
//     } else if (token && !privatePaths.includes(path)) {
//       router.push("/dashboard");
//     } else {
//       setAuthorized(false);
//     }
//   }

//   return authorized && children;
// }
