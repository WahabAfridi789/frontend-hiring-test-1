import { NextResponse } from "next/server";
import { auth } from "./app/auth";

const apiAuthPrefix = "/api";
const DEFAULT_LOGIN_REDIRECT = "/";
const AUTH_ROUTES = ["/login"];
const RESTRICTED_ROUTES = ["/"];
const PUBLIC_ROUTES = [""];

export default auth((req, res) => {
  const session = req.auth;

  const { nextUrl } = req;
  const url = req.nextUrl;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isRestrictedRoute = RESTRICTED_ROUTES.includes(nextUrl.pathname);
  const isLoggedIn = !!session?.user;
  const path = `${url.pathname}`;

  if (isLoggedIn) {
    // Add Authorization header for API routes
    const headers = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${session.user.access_token}`);
    const response = NextResponse.next({ request: { headers } });
    return;
  }

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && isPublicRoute) {
    return;
  }

  if (isRestrictedRoute && !isLoggedIn)
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
