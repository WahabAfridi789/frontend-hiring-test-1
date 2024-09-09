import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: DefaultUser & {
      id: string;
    };
  }
  interface User extends DefaultUser {
    username: string;
    access_token: string;
    refresh_token: string;
    refreshToken: string;
    accessToken: string;
    expires_in;
    number;
  }
}
