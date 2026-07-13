// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";

const MAPPINGS = {
  "ophixor.localhost:3000": {
    code: "ophixor",
  },
};

export async function proxy(request) {
  const url = request.nextUrl;

  const pathname = url.pathname;

  if (pathname !== "/robots.txt" && pathname !== "/sitemap.xml" && pathname !== "/android-chrome-192x192.png" && pathname !== "/android-chrome-512x512.png" && pathname !== "/apple-touch-icon.png" && pathname !== "/favicon.ico" && pathname !== "/favicon-16x16.png" && pathname !== "/favicon-32x32.png" && !pathname.startsWith("/api/") && !pathname.startsWith("/images/") && !pathname.startsWith("/_next") && !pathname.startsWith("/.well-known")) {
    const hostname = request.headers.get("host");

    const mapping = MAPPINGS[hostname];

    if (mapping?.code) {
      const code = mapping.code;

      const searchParams = request.nextUrl.searchParams.toString();

      const newPathname = pathname === "/admin" || pathname.startsWith("/admin/") ? pathname.replace("/admin", "/website-admin/" + code) + (searchParams.length > 0 ? `?${searchParams}` : "") : `/website/${code}` + pathname + (searchParams.length > 0 ? `?${searchParams}` : "");

      const requestHeaders = new Headers(request.headers);

      requestHeaders.set("x-content-code", code);
      requestHeaders.set("x-content-host", hostname);

      requestHeaders.set("x-pathname", newPathname);
      requestHeaders.set("x-pathname-original", pathname);

      return NextResponse.rewrite(new URL(newPathname, request.url), {
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-pathname", pathname);

  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    const hostname = request.headers.get("host");

    const mapping = MAPPINGS[hostname];

    if (mapping?.code) {
      requestHeaders.set("x-content-code", mapping.code);
      requestHeaders.set("x-content-host", hostname);
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
