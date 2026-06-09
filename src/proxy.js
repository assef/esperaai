import { NextResponse } from 'next/server';

const LOCALES = ['pt-BR', 'en-US'];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`,
  );
  if (hasLocale) return;
  request.nextUrl.pathname = `/pt-BR${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)', '/'],
};
