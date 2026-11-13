import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { endpoint, data } = body;

    // استدعاء بيانات Odoo من ملف .env المخفي
    const ODOO_URL = process.env.ODOO_URL || "https://edu-smartcare.odoo.com";
    const MCP_KEY = process.env.ODOO_MCP_KEY;

    // توجيه الطلب إلى Odoo
    const response = await fetch(`${ODOO_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCP_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to SmartCare database' }, { status: 500 });
  }
}
