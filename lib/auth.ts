/** biome-ignore-all lint/style/noNonNullAssertion: if the env is not provided, the error will throw */
import { db } from "@/lib/db";
import {
  accountsTable,
  authenticatorsTable,
  sessionsTable,
  usersTable,
  verificationTokensTable,
} from "@/lib/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { type NextRequest, NextResponse } from "next/server";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
    authenticatorsTable,
  }),
  providers: [GoogleProvider],
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user?.id) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

type RouteHandler = (
  request: NextRequest,
  ...args: unknown[]
) => Promise<Response> | Response;

type AuthenticatedRouteHandler = (
  request: NextRequest,
  session: Session,
  ...args: unknown[]
) => Promise<Response> | Response;

export function withAuth(handler: AuthenticatedRouteHandler): RouteHandler {
  return async (request, ...rest) => {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    return handler(request, session as Session, ...rest);
  };
}
