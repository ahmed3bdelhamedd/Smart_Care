'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { signOut, useSession } from 'next-auth/react';
import { CalendarDays, HeartPulse, LayoutDashboard, LogIn, LogOut, Search } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function SiteHeader() {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const { data: session, status } = useSession();
  const home = `/${locale}`;

  return <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-xl">
    <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6" aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}>
      <Link href={home} className="flex items-center gap-2.5" aria-label="SmartCare — home">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-brand text-white"><HeartPulse size={22} aria-hidden="true" /></span>
        <span className="text-lg font-extrabold tracking-tight text-ink">Smart<span className="text-brand">Care</span></span>
      </Link>
      <div className="hidden items-center gap-1 md:flex">
        <Link href={home} className="rounded-xl px-3 py-2 text-sm font-semibold text-muted transition hover:bg-soft hover:text-ink">{isArabic ? 'الرئيسية' : 'Home'}</Link>
        <Link href={`/${locale}/hospitals`} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted transition hover:bg-soft hover:text-ink"><Search size={16} aria-hidden="true" />{isArabic ? 'العيادات والمواعيد' : 'Clinics & visits'}</Link>
        {session && <Link href={`/${locale}/${session.user.role === 'admin' ? 'admin' : 'dashboard'}`} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted transition hover:bg-soft hover:text-ink"><LayoutDashboard size={16} aria-hidden="true" />{isArabic ? 'لوحة التحكم' : 'Dashboard'}</Link>}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href={locale === 'ar' ? '/en' : '/ar'} className="hidden rounded-xl px-2.5 py-2 text-xs font-bold text-muted hover:bg-soft sm:inline-flex">{isArabic ? 'EN' : 'عربي'}</Link>
        {status === 'loading' ? <span className="size-10 rounded-xl bg-soft" aria-hidden="true" /> : session ? <button onClick={() => signOut({ callbackUrl: home })} className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-bold text-ink hover:bg-soft" aria-label={isArabic ? 'تسجيل الخروج' : 'Sign out'}><LogOut size={16} aria-hidden="true" /><span className="hidden sm:inline">{isArabic ? 'خروج' : 'Sign out'}</span></button> : <Link href={`/${locale}/login`} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"><LogIn size={16} aria-hidden="true" /><span>{isArabic ? 'دخول' : 'Sign in'}</span></Link>}
        <Link href={`/${locale}/hospitals`} className="flex size-10 items-center justify-center rounded-xl bg-soft text-brand md:hidden" aria-label={isArabic ? 'استكشف العيادات' : 'Browse clinics'}><CalendarDays size={18} aria-hidden="true" /></Link>
      </div>
    </nav>
  </header>;
}
