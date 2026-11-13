'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

export default function BookingWidget() {
  const t = useTranslations('Booking'); // استدعاء الترجمة (عربي/إنجليزي)
  const { data: session } = useSession(); // استدعاء بيانات المستخدم المسجل
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/odoo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'calendar.event',
        method: 'create',
        args: [[{
          name: `موعد طبي - ${session?.user?.name}`,
          start: new Date().toISOString(),
          description: "طلب حجز من بوابة SmartCare"
        }]]
      })
    });

    if (res.ok) {
      setMessage(t('success_message'));
    } else {
      setMessage(t('error_message'));
    }
    setLoading(false);
  };

  if (!session) {
    return <div className="text-center p-4">{t('login_required')}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        {t('title')} {/* "احجز كشفك الآن" أو "Book Your Appointment" */}
      </h2>
      
      <form onSubmit={submitBooking} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('hospital_label')}
          </label>
          <select className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="1">{t('hospital_1')}</option>
            <option value="2">{t('hospital_2')}</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? t('loading') : t('submit_btn')}
        </button>
      </form>
      
      {message && (
        <p className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
