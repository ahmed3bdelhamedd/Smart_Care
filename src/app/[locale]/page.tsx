import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowUpLeft, BadgeCheck, CalendarDays, HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react';
import AppointmentCatalog from '@/components/AppointmentCatalog';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { title: t('homeTitle'), description: t('homeDescription') };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'Home' });
  const Arrow = isArabic ? ArrowLeft : ArrowUpLeft;

  return <div className="pb-16">
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-hero px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
      <div className="pointer-events-none absolute -left-28 -top-36 size-96 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-36 right-1/3 size-80 rounded-full bg-teal-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-teal-100"><span className="size-2 rounded-full bg-teal-300" />{t('eyebrow')}</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl">{t('title')} <span className="text-teal-300">{t('titleAccent')}</span></h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">{t('description')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/hospitals`} className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{t('findAppointment')}<Arrow size={17} aria-hidden="true" /></Link>
            <Link href={`/${locale}/login`} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"><ShieldCheck size={17} aria-hidden="true" />{t('patientLogin')}</Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-teal-300" aria-hidden="true" />{t('odooSync')}</span>
            <span className="inline-flex items-center gap-2"><HeartPulse size={15} className="text-teal-300" aria-hidden="true" />{t('secureBooking')}</span>
          </div>
        </div>
        <div className="mx-auto w-full max-w-sm lg:justify-self-end">
          <div className="rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div><p className="text-xs text-slate-300">{t('careCardLabel')}</p><p className="mt-1 text-lg font-bold">{t('careCardTitle')}</p></div>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-300/15 text-teal-200"><Stethoscope size={23} aria-hidden="true" /></span>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {[t('careStepOne'), t('careStepTwo'), t('careStepThree')].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-300/15 text-xs font-bold text-teal-200">0{index + 1}</span><span className="text-sm font-medium text-slate-100">{step}</span><span className="ms-auto size-2 rounded-full bg-teal-300" /></div>)}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-brand/30 p-4"><CalendarDays size={19} className="text-teal-200" aria-hidden="true" /><p className="text-xs leading-6 text-slate-100">{t('careCardNote')}</p></div>
          </div>
        </div>
      </div>
    </section>

    <section className="pt-14 sm:pt-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{t('catalogEyebrow')}</p><h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{t('catalogTitle')}</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{t('catalogDescription')}</p></div>
        <Link href={`/${locale}/hospitals`} className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-soft">{t('allAppointments')}<Arrow size={16} aria-hidden="true" /></Link>
      </div>
      <AppointmentCatalog compact />
    </section>

    <section className="mt-14 grid gap-4 sm:grid-cols-3">
      {[{ icon: SearchIcon, title: t('benefitSearchTitle'), text: t('benefitSearchText') }, { icon: CalendarDays, title: t('benefitBookTitle'), text: t('benefitBookText') }, { icon: ShieldCheck, title: t('benefitSecureTitle'), text: t('benefitSecureText') }].map(({ icon: Icon, title, text }, index) => <article key={title} className="rounded-3xl border border-line bg-surface p-5 sm:p-6"><span className="flex size-11 items-center justify-center rounded-2xl bg-soft text-brand"><Icon size={20} aria-hidden="true" /></span><p className="mt-5 text-xs font-bold text-brand">0{index + 1}</p><h3 className="mt-1 text-base font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-7 text-muted">{text}</p></article>)}
    </section>
  </div>;
}

function SearchIcon({ size = 20, ...props }: React.ComponentProps<typeof Stethoscope>) {
  return <Stethoscope size={size} {...props} />;
}
