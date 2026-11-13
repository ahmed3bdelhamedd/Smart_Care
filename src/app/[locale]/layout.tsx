import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import Providers from '@/components/Providers';
import SiteHeader from '@/components/SiteHeader';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: { default: 'SmartCare | رعاية صحية أقرب إليك', template: '%s | SmartCare' },
  description: 'اكتشف العيادات والمواعيد الطبية المنشورة في SmartCare واحجز عبر Odoo.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#087f75',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SiteHeader />
              <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
              <footer className="border-t border-line bg-surface">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <span className="font-bold text-ink">SmartCare</span>
                  <span>© {new Date().getFullYear()} SmartCare · {locale === 'ar' ? 'بيانات المواعيد تُدار بأمان عبر Odoo' : 'Appointment data is securely managed with Odoo'}</span>
                </div>
              </footer>
            </ThemeProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
