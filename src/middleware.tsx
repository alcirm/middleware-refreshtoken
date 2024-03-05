import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import {
  ResponseCookies,
  RequestCookies,
} from 'next/dist/server/web/spec-extension/cookies';

/**
 * Copy cookies from the Set-Cookie header of the response to the Cookie header of the request,
 * so that it will appear to SSR/RSC as if the user already has the new cookies.
 */
function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      res.headers.set(key, value);
    }
  });
}

export async function middleware(request: NextRequest) {
  console.log('middleware', request.nextUrl.pathname);

  const response = NextResponse.next();

  if (request.nextUrl.pathname === '/') {
    //cookies().set('cookieValue', 'valor inicial');
    response.cookies.set('cookieValue', 'valor-inicial');
  }

  if (request.nextUrl.pathname === '/trocar') {
    //cookies().set('cookieValue', 'valor inicial');
    response.cookies.set('cookieValue', 'valor-modificado');
    applySetCookie(request, response);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
