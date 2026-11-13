import AppointmentCatalog from '@/components/AppointmentCatalog';


export default async function HospitalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  return <div className="py-4 sm:py-8">
    <div className="mb-8 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{isArabic ? 'دليل الرعاية' : 'Care directory'}</p>
      <h1 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">{isArabic ? 'اختر العيادة المناسبة لك' : 'Find the right clinic for you'}</h1>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{isArabic ? 'استكشف أنواع المواعيد المنشورة في Odoo. ستنتقل إلى نظام الحجز الآمن لإتمام اختيار الموعد.' : 'Browse appointment types published in Odoo. Continue to the secure booking system to choose a time.'}</p>
    </div>
    <AppointmentCatalog />
  </div>;
}
