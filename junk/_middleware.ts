// import { NextRequest, NextResponse } from "next/server";
// import { getUserCookies } from "./actions/auth.actions";
// const apiAuthPrefix = "/api";
// const DEFAULT_LOGIN_REDIRECT = "/";
// const AUTH_ROUTES = ["/login"];
// const RESTRICTED_ROUTES = ["/"];

// export async function middleware(req: NextRequest) {
//   const { nextUrl } = req;
//   const baseUrl = req.nextUrl.origin;

//   console.log(new URL("/login", req.url));

//   console.log(req.url);

//   console.log(baseUrl);

//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

//   const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
//   const isRestrictedRoute = RESTRICTED_ROUTES.includes(nextUrl.pathname);
//   const isLoggedIn = await getUserCookies();

//   if (isApiAuthRoute) {
//     return;
//   }

//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return NextResponse.redirect(baseUrl + DEFAULT_LOGIN_REDIRECT);
//     }
//     return;
//   }

//   if (isRestrictedRoute && !isLoggedIn)
//     return NextResponse.redirect(baseUrl + "/login");
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };

import { NextRequest, NextResponse } from "next/server";
import { getUserCookies } from "../actions/auth.actions";

const apiAuthPrefix = "/api";
const DEFAULT_LOGIN_REDIRECT = "/";
const AUTH_ROUTES = ["/login"];
const RESTRICTED_ROUTES = ["/"];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const origin = nextUrl.origin; // Get the full origin URL

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isRestrictedRoute = RESTRICTED_ROUTES.includes(nextUrl.pathname);
  const isLoggedIn = await getUserCookies();

  if (isApiAuthRoute) {
    return NextResponse.next(); // Allow API routes to pass through
  }

  if (isAuthRoute && isLoggedIn) {
    // Redirect to the home page if the user is logged in and visiting /login
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, origin));
  }

  if (isRestrictedRoute && !isLoggedIn) {
    // Redirect to the login page if the user is not logged in
    return NextResponse.redirect(new URL("/login", origin));
  }

  return NextResponse.next(); // Proceed with the request
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
