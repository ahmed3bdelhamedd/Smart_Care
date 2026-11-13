'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { CalendarClock, MapPin, UserRound } from 'lucide-react';
import useSWR from 'swr';
import type { OdooAppointment } from '@/lib/types';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('appointments');
  return (await response.json()) as { appointments: OdooAppointment[] };
};

export default function AppointmentsPanel({ admin = false }: { admin?: boolean }) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const { data, error, isLoading } = useSWR('/api/odoo/appointments', fetcher, { revalidateOnFocus: true });
  const appointments = data?.appointments ?? [];

  if (isLoading) return <div className="h-40 animate-pulse rounded-3xl bg-surface" aria-label={isArabic ? 'جاري تحميل المواعيد' : 'Loading appointments'} />;
  if (error) return <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700" role="alert">{isArabic ? 'تعذر تحميل المواعيد من Odoo.' : 'Unable to load appointments from Odoo.'}</div>;
  if (!appointments.length) return <div className="rounded-3xl border border-line bg-surface p-8 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-soft text-brand"><CalendarClock aria-hidden="true" /></span><h3 className="mt-4 font-bold text-ink">{isArabic ? 'لا توجد مواعيد بعد' : 'No appointments yet'}</h3><p className="mt-2 text-sm text-muted">{isArabic ? 'ابدأ باستكشاف المواعيد المتاحة.' : 'Start by browsing available appointment types.'}</p><Link className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white" href={`/${locale}/hospitals`}>{isArabic ? 'استكشف المواعيد' : 'Browse appointments'}</Link></div>;

  return <div className="flex flex-col gap-3">{appointments.map((appointment) => <article key={appointment.id} className="rounded-2xl border border-line bg-surface p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-ink">{appointment.appointment_type_id?.[1] ?? appointment.name}</h3><p className="mt-1 text-xs text-muted">{appointment.name}</p></div><time className="rounded-xl bg-soft px-3 py-2 text-xs font-semibold text-brand">{new Date(appointment.start).toLocaleString(isArabic ? 'ar-EG' : 'en', { dateStyle: 'medium', timeStyle: 'short' })}</time></div><div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">{appointment.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" />{appointment.location}</span>}{admin && appointment.patientNames?.map((name) => <span key={name} className="inline-flex items-center gap-1.5"><UserRound size={14} aria-hidden="true" />{name}</span>)}</div></article>)}</div>;
}
