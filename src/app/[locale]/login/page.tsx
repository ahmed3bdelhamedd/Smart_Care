'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowUpLeft, Eye, EyeOff, HeartPulse, LockKeyhole } from 'lucide-react';

export default function LoginPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setPending(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setError(isArabic ? 'تعذر تسجيل الدخول. تحقق من بيانات حساب Odoo وحاول مرة أخرى.' : 'Sign-in failed. Check your Odoo account details and try again.');
      setPending(false);
      return;
    }
    const session = await getSession();
    const destination = session?.user?.role === 'admin' ? `/${locale}/admin` : `/${locale}/dashboard`;
    router.replace(destination);
    router.refresh();
  }

  return <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card md:grid-cols-[0.9fr_1.1fr]">
    <aside className="hidden flex-col justify-between bg-hero p-9 text-white md:flex"><div><Link href={`/${locale}`} className="inline-flex items-center gap-2 font-extrabold"><HeartPulse className="text-teal-300" aria-hidden="true" />SmartCare</Link><h1 className="mt-14 text-3xl font-extrabold leading-tight">{isArabic ? 'رعايتك الصحية، في مكان واحد.' : 'Your care journey, in one place.'}</h1><p className="mt-4 text-sm leading-7 text-slate-300">{isArabic ? 'استخدم حسابك الحالي في Odoo للدخول كمريض أو كإدارة مستشفى.' : 'Use your existing Odoo account to sign in as a patient or hospital administrator.'}</p></div><p className="text-xs text-slate-400">{isArabic ? 'دخول آمن مرتبط بحساب Odoo' : 'Secure sign-in powered by your Odoo account'}</p></aside>
    <section className="p-6 sm:p-10 lg:p-12">
      <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand"><ArrowUpLeft size={17} aria-hidden="true" />{isArabic ? 'الرئيسية' : 'Home'}</Link>
      <div className="mt-8 flex size-12 items-center justify-center rounded-2xl bg-soft text-brand md:hidden"><HeartPulse aria-hidden="true" /></div>
      <h2 className="mt-5 text-2xl font-extrabold text-ink">{isArabic ? 'تسجيل الدخول' : 'Sign in'}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{isArabic ? 'أدخل بيانات حسابك المسجل في Odoo.' : 'Enter the credentials for your Odoo account.'}</p>
      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
        <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">{isArabic ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email or username'}</label><input id="email" name="email" type="text" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder={isArabic ? 'name@example.com' : 'name@example.com'} /></div>
        <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">{isArabic ? 'كلمة المرور' : 'Password'}</label><div className="relative"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required maxLength={256} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 pe-12 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 end-3 inline-flex items-center text-muted" aria-label={showPassword ? (isArabic ? 'إخفاء كلمة المرور' : 'Hide password') : (isArabic ? 'عرض كلمة المرور' : 'Show password')}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"><LockKeyhole size={17} aria-hidden="true" />{pending ? (isArabic ? 'جارٍ التحقق…' : 'Verifying…') : (isArabic ? 'الدخول إلى SmartCare' : 'Sign in to SmartCare')}</button>
      </form>
      <p className="mt-5 text-xs leading-6 text-muted">{isArabic ? 'حسابات المرضى وإدارة المستشفيات تُدار من خلال Odoo. تواصل مع إدارة المستشفى لإنشاء حساب جديد.' : 'Patient and hospital administrator accounts are managed in Odoo. Contact your hospital administrator to request an account.'}</p>
    </section>
  </div>;
}
