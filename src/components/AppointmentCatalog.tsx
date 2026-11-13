'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { CalendarDays, Clock3, MapPin, Search, Stethoscope } from 'lucide-react';
import useSWR from 'swr';
import type { AppointmentRecord } from '@/lib/types';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('catalog');
  return (await response.json()) as { appointments: AppointmentRecord[] };
};

export default function AppointmentCatalog({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [query, setQuery] = useState('');
  const { data, error, isLoading } = useSWR('/api/odoo/catalog', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
  const appointments = data?.appointments ?? [];

  if (isLoading) {
    return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label={isArabic ? 'جاري تحميل المواعيد' : 'Loading appointments'}>
      {Array.from({ length: compact ? 3 : 6 }, (_, index) => <div key={index} className="h-52 animate-pulse rounded-3xl bg-surface" />)}
    </div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-800" role="alert">
      {isArabic ? 'تعذر الاتصال ببيانات المواعيد في Odoo. يرجى المحاولة مرة أخرى.' : 'Appointment data is temporarily unavailable. Please try again.'}
    </div>;
  }

  if (!appointments.length) {
    return <div className="rounded-3xl border border-line bg-surface p-8 text-center text-muted">
      {isArabic ? 'لا توجد مواعيد منشورة حاليًا. يمكن لإدارة المستشفى نشر المواعيد من Odoo.' : 'No published appointments yet. Hospital administrators can publish schedules in Odoo.'}
    </div>;
  }

  const filtered = appointments.filter((item) => `${item.name} ${item.location ?? ''} ${item.doctors.join(' ')}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)));
  const visible = compact ? filtered.slice(0, 3) : filtered;
  return <>
    {!compact && <label className="mb-5 flex max-w-xl items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-muted focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15"><Search size={18} aria-hidden="true" /><span className="sr-only">{isArabic ? 'ابحث عن عيادة أو طبيب' : 'Search clinics or providers'}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isArabic ? 'ابحث عن عيادة أو طبيب' : 'Search clinics or providers'} className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted" /></label>}
    {!compact && visible.length === 0 && <p className="rounded-3xl border border-line bg-surface p-8 text-center text-sm text-muted">{isArabic ? 'لا توجد نتائج مطابقة لبحثك.' : 'No results match your search.'}</p>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {visible.map((item) => <article key={item.id} className="group flex min-h-56 flex-col rounded-3xl border border-line bg-surface p-5 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand"><Stethoscope aria-hidden="true" /></span>
        <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-brand">{isArabic ? 'موعد طبي' : 'Medical visit'}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-7 text-ink">{item.name}</h3>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5"><Clock3 size={15} aria-hidden="true" />{item.durationMinutes} {isArabic ? 'دقيقة' : 'min'}</span>
        <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden="true" />{item.location ?? (isArabic ? 'الموقع يحدد عند الحجز' : 'Location at booking')}</span>
      </div>
      {item.doctors.length > 0 && <p className="mt-2 text-sm text-muted">{isArabic ? 'الطبيب' : 'Provider'}: {item.doctors.join('، ')}</p>}
      <Link href={`/${locale}/booking?type=${item.id}`} className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <CalendarDays size={17} aria-hidden="true" />{isArabic ? 'احجز الموعد' : 'Book appointment'}
      </Link>
    </article>)}
    </div>
  </>;
}
