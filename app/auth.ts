import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

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

            //set cookie for the user to store the access token
            cookies().set({
              name: "Authorization",
              value: result.access_token,
              httpOnly: true,
              path: "/",
              maxAge: 60 * 10, // 10 minutes
            });

            return { ...result, ...result.user };
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
      session.user = { ...token.user, ...token };
      return session;
    },

    async jwt({ token, user }) {
      // If a new user logs in, set token properties including expiration
      if (user) {
        token.accessToken = user.access_token;
        token.refreshToken = user.refresh_token;
        token.userId = user.id;
        token.username = user.username;
        token.expiresAt = Math.floor(
          Date.now() / 1000 + (user.expires_in || 540)
        );
      }

      // Log the token's expiry time if it's already set
      if (token.expiresAt) {
        // If the token has expired, refresh it
        if (Date.now() >= token.expiresAt * 1000) {
          console.log("Token expired, refreshing token...", token.accessToken);

          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token.accessToken}`,
                },
              }
            );

            const refreshedTokens = await response.json();

            if (!response.ok) {
              throw refreshedTokens;
            }

            // Set the new token expiry time
            const newExpiresAt = Math.floor(
              Date.now() / 1000 + (refreshedTokens.expires_in || 540)
            );

            return {
              ...token,
              accessToken: refreshedTokens.access_token,
              refreshToken: refreshedTokens.refresh_token || token.refreshToken,
              expiresAt: newExpiresAt,
            };
          } catch (error) {
            console.error("Error refreshing access token:", error);
            return { ...token, error: "RefreshAccessTokenError" };
          }
        }
      }

      return token;
    },

    async signIn({ user }) {
      const isAuthorized = false;
      if (user?.access_token) {
        return true;
      }
      return isAuthorized;
    },
  },
  session: {
    maxAge: 540, // 9 minutes
  },
  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
