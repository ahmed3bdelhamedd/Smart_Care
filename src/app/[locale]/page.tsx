import BookingWidget from '@/components/BookingWidget';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// دعم تحسين محركات البحث (SEO)
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { title: t('home_title'), description: t('home_description') };
}

export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <div className="space-y-12">
      {/* قسم الترحيب (Hero Section) */}
      <section className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
          {t('hero_title')} {/* "رعايتك الصحية أصبحت أسهل" */}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          {t('hero_subtitle')} {/* "احجز كشفك الطبي في أفضل المستشفيات وأدر ملفك الصحي بسهولة عبر SmartCare." */}
        </p>
      </section>

      {/* قسم الحجز المرتبط بـ Odoo API */}
      <section id="booking-section">
        <BookingWidget />
      </section>
    </div>
  );
}
