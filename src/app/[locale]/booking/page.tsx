import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ArrowUpLeft, CalendarCheck2, Clock3, MapPin, ShieldCheck, Stethoscope } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getPublicAppointmentTypes } from '@/lib/odoo';

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const [{ locale }, query, session] = await Promise.all([
    params,
    searchParams,
    getServerSession(authOptions),
  ]);
  if (!session?.user?.odooUid) redirect(`/${locale}/login`);
  const id = Number(query.type);
  if (!Number.isInteger(id) || id < 1) notFound();
  const appointments = await getPublicAppointmentTypes().catch(() => []);
  const appointment = appointments.find((item) => item.id === id);
  if (!appointment) notFound();
  const isArabic = locale === 'ar';

  return <div className="mx-auto max-w-3xl py-6 sm:py-12">
    <Link href={`/${locale}/hospitals`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand"><ArrowUpLeft size={17} aria-hidden="true" />{isArabic ? 'العودة إلى العيادات' : 'Back to clinics'}</Link>
    <section className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card">
      <div className="bg-hero p-7 text-white sm:p-9"><span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand text-white"><Stethoscope size={23} aria-hidden="true" /></span><p className="mt-5 text-xs font-bold text-teal-200">{isArabic ? 'تأكيد نوع الزيارة' : 'Confirm visit type'}</p><h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{appointment.name}</h1></div>
      <div className="p-6 sm:p-9">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-soft p-4"><Clock3 className="text-brand" size={19} aria-hidden="true" /><div><p className="text-xs text-muted">{isArabic ? 'مدة الكشف' : 'Visit duration'}</p><p className="mt-1 text-sm font-bold text-ink">{appointment.durationMinutes} {isArabic ? 'دقيقة' : 'minutes'}</p></div></div>
          <div className="flex items-center gap-3 rounded-2xl bg-soft p-4"><MapPin className="text-brand" size={19} aria-hidden="true" /><div><p className="text-xs text-muted">{isArabic ? 'موقع العيادة' : 'Clinic location'}</p><p className="mt-1 text-sm font-bold text-ink">{appointment.location ?? (isArabic ? 'يحدد الموقع في Odoo عند الحجز' : 'Set in Odoo during booking')}</p></div></div>
        </div>
        {appointment.doctors.length > 0 && <p className="mt-5 text-sm text-muted">{isArabic ? 'مقدم الخدمة' : 'Provider'}: <span className="font-bold text-ink">{appointment.doctors.join('، ')}</span></p>}
        <div className="mt-7 rounded-2xl border border-brand/15 bg-brand/5 p-4 text-sm leading-7 text-muted"><ShieldCheck className="me-2 inline text-brand" size={17} aria-hidden="true" />{isArabic ? 'سيتم إتمام اختيار الموعد وتأكيده داخل Odoo، مع تطبيق أوقات التوفر الفعلية وسياسات المستشفى.' : 'Choose and confirm your appointment in Odoo, where live availability and hospital policies are applied.'}</div>
        <a href={appointment.bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"><CalendarCheck2 size={18} aria-hidden="true" />{isArabic ? 'المتابعة إلى الحجز الآمن' : 'Continue to secure booking'}</a>
        <p className="mt-3 text-center text-xs leading-6 text-muted">{isArabic ? 'قد يطلب منك Odoo تسجيل الدخول مرة أخرى إذا لم تكن جلستك نشطة هناك.' : 'Odoo may ask you to sign in again if you do not have an active session there.'}</p>
      </div>
    </section>
  </div>;
}
