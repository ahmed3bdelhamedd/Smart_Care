import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    // التحقق من أن المستخدم مسجل دخول بالفعل
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { model, method, args } = body;

    const ODOO_URL = process.env.ODOO_URL; // https://edu-smartcare.odoo.com
    const ODOO_KEY = process.env.ODOO_MCP_KEY; // 38644346a9384662cb6ec16b3285bbc6549f305f_oak

    const response = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ODOO_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            process.env.ODOO_DB, 
            2, // User ID (عادة 2 للمدير عبر API)
            ODOO_KEY,
            model, // مثال: 'calendar.event' أو 'crm.lead'
            method, // مثال: 'create' أو 'search_read'
            args
          ]
        }
      })
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
