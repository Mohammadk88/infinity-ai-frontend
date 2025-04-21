import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('jwt');
  const { pathname } = request.nextUrl;
  console.log('isLoggedIn:', isLoggedIn);
  console.log('pathname:', pathname);
  // ✅ إذا المستخدم مو داخل (ما عنده توكن) وعم يحاول يدخل على /dashboard أو أي مسار بعده
  // 🔐 نحمي فقط /dashboard وما بعده
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // ✅ إذا المستخدم داخل وعم يحاول يدخل على login/register يرجع للداشبورد
  const isAuthPage = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register');
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'], // نحط بس المسارات يلي بهمنا
};
