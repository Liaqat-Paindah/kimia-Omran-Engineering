import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((request) => {
  const isAuthenticated = Boolean(request.auth?.user);
  const isAdmin = request.auth?.user?.role === "admin";

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    loginUrl.searchParams.set("callbackUrl", callbackUrl);

    return NextResponse.redirect(loginUrl);
  }

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
