import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "./auth.config"
import { db } from "./lib/db";
import { getAccountByUserId, getUserById } from "./modules/auth/actions";


 

 
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    /**
     * Handle user creation and account linking after a successful sign-in
     */
    async signIn({ user, account, profile }) {
      if (!user || !account) return false;

      try {
        const email = user.email || (profile as any)?.email;
        if (!email) {
          console.warn("No email found on OAuth profile");
          return true;
        }

        // Check if the user already exists
        const existingUser = await db.user.findUnique({
          where: { email },
        });

        // If user does not exist, create user and account
        if (!existingUser) {
          await db.user.create({
            data: {
              email,
              name: user.name || (profile as any)?.name || (profile as any)?.login || "User",
              image: user.image || (profile as any)?.avatar_url,
              accounts: {
                // @ts-ignore
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: String(account.providerAccountId),
                  refreshToken: account.refresh_token,
                  accessToken: account.access_token,
                  expiresAt: account.expires_at,
                  tokenType: account.token_type,
                  scope: account.scope,
                  idToken: account.id_token,
                  sessionState: account.session_state as string | undefined,
                },
              },
            },
          });
        } else {
          // Link the account if user exists
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: String(account.providerAccountId),
              },
            },
          });

          if (!existingAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: String(account.providerAccountId),
                refreshToken: account.refresh_token,
                accessToken: account.access_token,
                expiresAt: account.expires_at,
                tokenType: account.token_type,
                scope: account.scope,
                idToken: account.id_token,
                sessionState: account.session_state as string | undefined,
              },
            });
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true;
      }
    },

    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.sub = user.id;
        }

        if (!token.sub && token.email) {
          const userByEmail = await db.user.findUnique({
            where: { email: token.email },
          });
          if (userByEmail) {
            token.sub = userByEmail.id;
            token.name = userByEmail.name;
            token.role = userByEmail.role;
          }
        } else if (token.sub) {
          const existingUser = await getUserById(token.sub);
          if (existingUser) {
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
          }
        }
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as any;
      }

      return session;
    },
  },
  
  session: { strategy: "jwt" },
  ...authConfig,
})