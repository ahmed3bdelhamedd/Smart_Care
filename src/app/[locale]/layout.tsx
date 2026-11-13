import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import Providers from '@/components/Providers';
import '@/app/globals.css';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // جلب نصوص الترجمة بناءً على اللغة الحالية
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            
            {/* شريط التنقل الرئيسي (Navbar) */}
            <nav className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex space-x-4 rtl:space-x-reverse items-center">
                    <Link href={`/${locale}`} className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      SmartCare
                    </Link>
                    <div className="hidden md:flex space-x-4 rtl:space-x-reverse">
                      <Link href={`/${locale}`} className="hover:text-blue-500 px-3 py-2">الرئيسية</Link>
                      <Link href={`/${locale}/dashboard`} className="hover:text-blue-500 px-3 py-2">لوحة التحكم</Link>
                      <Link href={`/${locale}/hospitals`} className="hover:text-blue-500 px-3 py-2">المستشفيات</Link>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <ThemeToggle />
                    {/* زر تغيير اللغة */}
                    <Link href={locale === 'ar' ? '/en' : '/ar'} className="text-sm font-medium">
                      {locale === 'ar' ? 'English' : 'العربية'}
                    </Link>
                    <Link href={`/${locale}/login`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      تسجيل الدخول
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* محتوى الصفحة الرئيسية أو الفرعية سيتم عرضه هنا */}
            <main className="max-w-7xl mx-auto px-4 py-8">
              {children}
            </main>

          </ThemeProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
