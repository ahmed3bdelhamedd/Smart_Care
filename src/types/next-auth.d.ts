import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      odooUid: number;
      partnerId: number | null;
      role: 'patient' | 'admin';
    };
  }

  interface User {
    odooUid: number;
    partnerId: number | null;
    role: 'patient' | 'admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    odooUid?: number;
    partnerId?: number | null;
    role?: 'patient' | 'admin';
  }
}
