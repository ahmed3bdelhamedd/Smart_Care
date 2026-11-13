import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getAppointmentsForPartner, isOdooHospitalAdmin } from '@/lib/odoo';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.odooUid) {
    return NextResponse.json({ error: 'يلزم تسجيل الدخول.' }, { status: 401 });
  }

  try {
    const isAdmin = session.user.role === 'admin'
      && await isOdooHospitalAdmin(session.user.odooUid);
    if (!isAdmin && !session.user.partnerId) {
      return NextResponse.json({ appointments: [] });
    }

    const appointments = await getAppointmentsForPartner(
      session.user.partnerId ?? 0,
      isAdmin,
    );
    return NextResponse.json({ appointments });
  } catch {
    return NextResponse.json(
      { error: 'تعذر تحميل المواعيد من Odoo.' },
      { status: 503 },
    );
  }
}
