import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        try {
          const { username, password } = credentials || {};

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ username, password }),
            }
          );

          if (response.status === 201) {
            const result = await response.json();
            return result;
          }

          if (response.status === 401) {
            const errorData = await response.json();
            return {
              error: true,
              message: errorData.meta.message,
            };
          }
        } catch (error: any) {
          throw new Error(error.message || "Authorization error");
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      session.user = { ...token.user };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          // @ts-ignore
          access_token: user.access_token,
          id: user.id,
          // @ts-ignore
          username: user.user?.username,
          // @ts-ignore
          refresh_token: user.refresh_token,
        };
        return token;
      }

      return token;
    },
    async signIn({ user }) {
      const isAuthorized = false;
      //@ts-ignore
      if (user?.access_token) {
        return true;
      }
      return isAuthorized;
    },
  },
  session: {
    maxAge: 1 * 24 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
