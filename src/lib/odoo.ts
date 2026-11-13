import type { AppointmentRecord, OdooAppointment } from '@/lib/types';

const ODOO_URL = 'https://edu-smartcare.odoo.com';
const ODOO_DATABASE = 'edu-smartcare';

type RpcError = { message?: string; data?: { message?: string } };
type RpcEnvelope<T> = { result?: T; error?: RpcError };
type OdooUser = {
  id: number;
  name: string;
  login: string;
  partner_id: [number, string] | false;
  group_ids: number[];
};

async function rpc<T>(
  service: 'common' | 'object',
  method: string,
  args: unknown[],
  apiKey?: string,
) {
  const response = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: { service, method, args },
      id: 1,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) throw new Error('Odoo service is unavailable');
  const payload = (await response.json()) as RpcEnvelope<T>;
  if (payload.error) throw new Error('Odoo request was rejected');
  return payload.result as T;
}

async function executeKw<T>(
  uid: number,
  password: string,
  model: string,
  method: string,
  methodArgs: unknown[] = [],
  options: Record<string, unknown> = {},
  apiKey?: string,
) {
  return rpc<T>(
    'object',
    'execute_kw',
    [ODOO_DATABASE, uid, password, model, method, methodArgs, options],
    apiKey,
  );
}

export async function authenticateOdooUser(login: string, password: string) {
  const uid = await rpc<number | false>('common', 'authenticate', [
    ODOO_DATABASE,
    login,
    password,
    {},
  ]);

  if (!uid) return null;

  const userRows = await executeKw<OdooUser[]>(
    uid,
    password,
    'res.users',
    'read',
    [[uid]],
    { fields: ['id', 'name', 'login', 'partner_id'] },
  );
  const user = userRows[0];
  if (!user) return null;

  return {
    uid,
    partnerId: Array.isArray(user.partner_id) ? user.partner_id[0] : null,
    name: user.name,
    email: user.login,
    role: (await isOdooHospitalAdmin(uid)) ? 'admin' : 'patient',
  } as const;
}

async function getServiceAccount() {
  const key = process.env.ODOO_MCP_KEY;
  const login = process.env.ODOO_MCP_LOGIN;
  if (!key || !login) throw new Error('Odoo service credentials are not configured');

  const uid = await rpc<number | false>(
    'common',
    'authenticate',
    [ODOO_DATABASE, login, key, {}],
    key,
  );
  if (!uid) throw new Error('Odoo service account could not authenticate');
  return { uid, key };
}

export async function isOdooHospitalAdmin(userId: number) {
  const { uid, key } = await getServiceAccount();
  const [user] = await executeKw<Array<{ group_ids: number[] }>>(
    uid,
    key,
    'res.users',
    'read',
    [[userId]],
    { fields: ['group_ids'] },
    key,
  );
  if (!user?.group_ids.length) return false;

  const groups = await executeKw<Array<{ name: string }>>(
    uid,
    key,
    'res.groups',
    'read',
    [user.group_ids],
    { fields: ['name'] },
    key,
  );
  return groups.some(({ name }) => /administrator|admin|manager|management|مدير|مسؤول|إدارة/i.test(name));
}

export async function getPublicAppointmentTypes(): Promise<AppointmentRecord[]> {
  const { uid, key } = await getServiceAccount();
  const records = await executeKw<Array<Record<string, unknown>>>(
    uid,
    key,
    'appointment.type',
    'search_read',
    [[['active', '=', true]]],
    {
      fields: [
        'name',
        'location_id',
        'staff_user_ids',
        'appointment_duration',
        'appointment_tz',
        'category',
        'website_absolute_url',
      ],
      order: 'name asc',
      limit: 100,
    },
    key,
  );

  const userIds = [...new Set(records.flatMap((record) => (record.staff_user_ids as number[]) ?? []))];
  const users = userIds.length
    ? await executeKw<Array<{ id: number; name: string }>>(
        uid,
        key,
        'res.users',
        'read',
        [userIds],
        { fields: ['name'] },
        key,
      )
    : [];
  const userNames = new Map(users.map((user) => [user.id, user.name]));

  return records.flatMap((record) => {
    const bookingUrl = typeof record.website_absolute_url === 'string'
      ? record.website_absolute_url
      : '';
    try {
      const parsed = new URL(bookingUrl, ODOO_URL);
      if (parsed.origin !== ODOO_URL) return [];
      const location = record.location_id;
      const staffIds = (record.staff_user_ids as number[]) ?? [];
      return [{
        id: Number(record.id),
        name: String(record.name ?? ''),
        location: Array.isArray(location) ? String(location[1]) : null,
        doctors: staffIds.map((id) => userNames.get(id)).filter((name): name is string => Boolean(name)),
        durationMinutes: Math.round(Number(record.appointment_duration ?? 0) * 60),
        timezone: String(record.appointment_tz ?? 'Africa/Cairo'),
        category: String(record.category ?? ''),
        bookingUrl: parsed.toString(),
      }];
    } catch {
      return [];
    }
  });
}

type AppointmentView = Omit<OdooAppointment, 'partner_ids'> & { patientNames?: string[] };

export async function getAppointmentsForPartner(partnerId: number, isAdmin: boolean): Promise<AppointmentView[]> {
  const { uid, key } = await getServiceAccount();
  const domain = isAdmin
    ? [['appointment_type_id', '!=', false]]
    : [['partner_ids', 'in', [partnerId]], ['appointment_type_id', '!=', false]];
  const events = await executeKw<OdooAppointment[]>(
    uid,
    key,
    'calendar.event',
    'search_read',
    [domain],
    {
      fields: ['name', 'start', 'stop', 'location', 'appointment_type_id', 'partner_ids'],
      order: 'start desc',
      limit: isAdmin ? 100 : 30,
    },
    key,
  );

  if (!isAdmin || events.length === 0) {
    return events.map(({ partner_ids: _partnerIds, ...event }) => event);
  }
  const partnerIds = [...new Set(events.flatMap((event) => event.partner_ids ?? []))];
  if (!partnerIds.length) return events;
  const partners = await executeKw<Array<{ id: number; name: string }>>(
    uid,
    key,
    'res.partner',
    'read',
    [partnerIds],
    { fields: ['name'] },
    key,
  );
  const names = new Map(partners.map((partner) => [partner.id, partner.name]));
  return events.map(({ partner_ids, ...event }) => ({
    ...event,
    patientNames: (partner_ids ?? []).map((id) => names.get(id)).filter((name): name is string => Boolean(name)),
  }));
}
