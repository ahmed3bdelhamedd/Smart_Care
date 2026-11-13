import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ArrowUpLeft, CalendarDays, HeartPulse } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import AppointmentsPanel from '@/components/AppointmentsPanel';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.odooUid) redirect(`/${locale}/login`);
  if (session.user.role === 'admin') redirect(`/${locale}/admin`);
  const isArabic = locale === 'ar';

  return <div className="mx-auto max-w-5xl py-5 sm:py-10">
    <Link href={`/${locale}/hospitals`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand"><ArrowUpLeft size={17} aria-hidden="true" />{isArabic ? 'حجز موعد جديد' : 'Book a new visit'}</Link>
    <section className="mt-5 rounded-[2rem] bg-hero p-6 text-white sm:p-9"><div className="flex items-center gap-4"><span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-teal-100"><HeartPulse aria-hidden="true" /></span><div><p className="text-xs text-teal-200">{isArabic ? 'لوحة المريض' : 'Patient portal'}</p><h1 className="mt-1 text-2xl font-extrabold">{isArabic ? `أهلًا، ${session.user.name ?? ''}` : `Welcome, ${session.user.name ?? ''}`}</h1></div></div><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{isArabic ? 'تابع مواعيدك المرتبطة بحساب Odoo، واستكشف مواعيد جديدة عند الحاجة.' : 'View appointments linked to your Odoo account and browse available visits.'}</p></section>
    <section className="mt-8"><div className="mb-4 flex items-center gap-2"><CalendarDays className="text-brand" size={19} aria-hidden="true" /><h2 className="text-xl font-extrabold text-ink">{isArabic ? 'مواعيدي' : 'My appointments'}</h2></div><AppointmentsPanel /></section>
  </div>;
}
