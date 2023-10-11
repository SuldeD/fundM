import { NextResponse } from "next/server";

const protectedRoutes: any = [
  "/dashboard",
  "/dashboard/fund",
  "/dashboard/myfund",
  "/dashboard/myfund/list",
  "/dashboard/history",
  "/dashboard/loan",
  "/dashboard/foundation",
  "/dashboard/profile",
  "/dashboard/profile/bank",
];
const unprotectedRoutes: any = [
  "/login",
  "/signup",
  "/forgot",
  "/signup/verify-phone",
  "/signup/password",
  "/signup/question",
  "/signup/transaction-password",
  "/",
  "/about-us",
  "/finance",
  "/loan",
  "/#app",
  "/#contact",
];

async function middleware(req: any) {
  const sessionToken = process.env.NODE_ENV === "production" ? req?.cookies?.get("__Secure-next-auth.session-token") : req?.cookies?.get("next-auth.session-token");
  const session =  sessionToken?.value ? true :false; 

  if (!session && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  } else if (unprotectedRoutes.includes(req.nextUrl.pathname) && session) {
    const absoluteURL = new URL("/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export default middleware;
