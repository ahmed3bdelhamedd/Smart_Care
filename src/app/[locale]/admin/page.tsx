import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ArrowUpLeft, Building2, CalendarDays, ExternalLink, ShieldCheck, Stethoscope } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import AppointmentCatalog from '@/components/AppointmentCatalog';
import AppointmentsPanel from '@/components/AppointmentsPanel';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.odooUid) redirect(`/${locale}/login`);
  if (session.user.role !== 'admin') redirect(`/${locale}/dashboard`);
  const isArabic = locale === 'ar';

  return <div className="mx-auto max-w-6xl py-5 sm:py-10">
    <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand"><ArrowUpLeft size={17} aria-hidden="true" />{isArabic ? 'الرئيسية' : 'Home'}</Link>
    <section className="mt-5 flex flex-wrap items-end justify-between gap-5 rounded-[2rem] bg-hero p-6 text-white sm:p-9"><div><span className="inline-flex items-center gap-2 text-xs font-bold text-teal-200"><ShieldCheck size={15} aria-hidden="true" />{isArabic ? 'إدارة المستشفى' : 'Hospital administration'}</span><h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{isArabic ? `مرحبًا، ${session.user.name ?? ''}` : `Welcome, ${session.user.name ?? ''}`}</h1><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">{isArabic ? 'تابع المواعيد المنشورة والحجوزات الواردة. مصدر البيانات والصلاحيات هو Odoo.' : 'Review published appointment types and incoming bookings. Odoo remains the source of truth for data and permissions.'}</p></div><a href="https://edu-smartcare.odoo.com/web" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">{isArabic ? 'إدارة بيانات Odoo' : 'Manage Odoo data'}<ExternalLink size={16} aria-hidden="true" /></a></section>
    <section className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-line bg-surface p-5"><Building2 className="text-brand" size={20} aria-hidden="true" /><p className="mt-4 text-sm text-muted">{isArabic ? 'مصدر بيانات العيادات' : 'Clinic data source'}</p><p className="mt-1 font-bold text-ink">appointment.type</p></div><div className="rounded-2xl border border-line bg-surface p-5"><Stethoscope className="text-brand" size={20} aria-hidden="true" /><p className="mt-4 text-sm text-muted">{isArabic ? 'مقدمو الخدمة' : 'Providers'}</p><p className="mt-1 font-bold text-ink">res.users</p></div><div className="rounded-2xl border border-line bg-surface p-5"><CalendarDays className="text-brand" size={20} aria-hidden="true" /><p className="mt-4 text-sm text-muted">{isArabic ? 'مصدر المواعيد' : 'Appointment records'}</p><p className="mt-1 font-bold text-ink">calendar.event</p></div></section>
    <section className="mt-10"><div className="mb-4"><h2 className="text-xl font-extrabold text-ink">{isArabic ? 'المواعيد والحجوزات' : 'Appointments & bookings'}</h2><p className="mt-1 text-sm text-muted">{isArabic ? 'عرض الحجوزات المسجلة في Odoo.' : 'Bookings recorded in Odoo.'}</p></div><AppointmentsPanel admin /></section>
    <section className="mt-10"><div className="mb-4"><h2 className="text-xl font-extrabold text-ink">{isArabic ? 'أنواع المواعيد المنشورة' : 'Published appointment types'}</h2><p className="mt-1 text-sm text-muted">{isArabic ? 'تُدار أسماء العيادات والأطباء والمواقع من سجلات Odoo.' : 'Clinic names, providers, and locations are managed in Odoo.'}</p></div><AppointmentCatalog /></section>
  </div>;
}
