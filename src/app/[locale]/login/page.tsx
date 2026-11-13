'use client';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth');

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800">
      <h1 className="text-2xl font-bold text-center mb-6">{t('login_title')}</h1>
      
      <div className="space-y-4">
        {/* سيتم ربط هذا الزر بمزود المصادقة (NextAuth) سواء كان إيميل/باسوورد أو Google */}
        <button 
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <span>🌐</span>
          {t('login_with_google')}
        </button>
        
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400">{t('or')}</span>
          <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
        </div>

        <form className="space-y-4">
          <input 
            type="email" 
            placeholder={t('email_placeholder')} 
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder={t('password_placeholder')} 
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700">
            {t('login_btn')}
          </button>
        </form>
      </div>
    </div>
  );
}
