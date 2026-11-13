import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // اللغات المدعومة في النظام
  locales: ['ar', 'en'],
  // اللغة الافتراضية عند الدخول للرابط الأساسي
  defaultLocale: 'ar'
});

export const config = {
  // تفعيل التوجيه على جميع المسارات ما عدا مسارات الـ API وملفات النظام والصور
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
