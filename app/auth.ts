import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
        domain_name: { type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        try {
          const { email, password, domain_name } = credentials || {};
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_USER_URL}/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ email, password, domain_name }),
            }
          );

          if (response.status === 401) {
            const errorData = await response.json();
            return {
              error: true,
              message: errorData.meta.message,
            };
          }
          const result = await response.json();
          if (result.meta.code === 1) {
            const user = result.data;
            user.domain = domain_name;
            return user;
          } else {
            throw new Error("Invalid login credentials");
          }
        } catch (error: any) {
          // console.error("Authorization error:", error);
          throw new Error(error.message || "Authorization error");
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      session.user = { ...token.user };
      return session;
    },
    async jwt({ token, user, trigger, session, account, profile }) {
      if (user) {
        token.user = { ...user };
        return token;
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      let isAuthorized = false;
      if (user.email) {
        return true;
      }
      return isAuthorized;
    },
  },
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
