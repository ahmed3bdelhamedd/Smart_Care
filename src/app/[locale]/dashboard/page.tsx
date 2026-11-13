import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  
  // حماية الصفحة: التأكد من أن المستخدم مسجل دخول، وإلا يتم تحويله لصفحة الدخول
  const session = await getServerSession();
  if (!session) {
    redirect(`/${locale}/login`);
  }

  // هنا يمكنك إضافة استدعاء للـ API الخاص بـ Odoo لجلب مواعيد المريض
  // const appointments = await fetchAppointmentsFromOdoo(session.user.id);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('dashboard_title')} {/* "لوحة التحكم" */}</h1>
        <p className="text-slate-500">{t('welcome')}, {session.user?.name}</p>
      </header>

      {/* كروت الإحصائيات أو المواعيد */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* كارت المواعيد القادمة */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              📅
            </div>
            <h2 className="text-xl font-semibold">{t('upcoming_appointments')}</h2>
          </div>
          <p className="text-3xl font-bold">2</p>
          <p className="text-sm text-slate-500 mt-2">موعدك القادم: غداً الساعة 4:00 م</p>
        </div>

        {/* كارت الملف الطبي */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              📁
            </div>
            <h2 className="text-xl font-semibold">{t('medical_records')}</h2>
          </div>
          <p className="text-sm text-slate-500 mt-2">عرض التقارير والروشتات السابقة من المستشفيات.</p>
          <button className="mt-4 text-blue-600 hover:underline text-sm font-medium">عرض الملف</button>
        </div>

      </div>
    </div>
  );
}
