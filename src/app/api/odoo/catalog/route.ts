import { NextResponse } from 'next/server';
import { getPublicAppointmentTypes } from '@/lib/odoo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const appointments = await getPublicAppointmentTypes();
    return NextResponse.json(
      { appointments },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'تعذر الاتصال بخدمات Odoo حاليًا.' },
      { status: 503 },
    );
  }
}
