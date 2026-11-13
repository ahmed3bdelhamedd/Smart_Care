import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { authenticateOdooUser } from '@/lib/odoo';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Odoo',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const login = credentials?.email?.trim();
        const password = credentials?.password;
        if (!login || !password || login.length > 254 || password.length > 256) return null;
        try {
          const user = await authenticateOdooUser(login, password);
          if (!user) return null;
          return {
            id: String(user.uid),
            name: user.name,
            email: user.email,
            odooUid: user.uid,
            partnerId: user.partnerId,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const account = user as typeof user & {
          odooUid: number;
          partnerId: number | null;
          role: 'patient' | 'admin';
        };
        token.odooUid = account.odooUid;
        token.partnerId = account.partnerId;
        token.role = account.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.odooUid = Number(token.odooUid);
        session.user.partnerId = token.partnerId ? Number(token.partnerId) : null;
        session.user.role = token.role === 'admin' ? 'admin' : 'patient';
      }
      return session;
    },
  },
};
