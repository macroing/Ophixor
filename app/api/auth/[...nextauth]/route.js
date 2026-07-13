// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import connect from "@/lib/database";
import PlatformUser from "@/models/PlatformUser";

import api from "@/definitions/api.json" with { type: "json" };

export const runtime = "nodejs";

export const NextAuthOptions = {
  callbacks: {
    async jwt({ token, trigger, user }) {
      if (user) {
        token.platformUser = user;
      }

      if (trigger === "update" && token?.platformUser) {
        await connect();

        const platformUser = await PlatformUser.findById(token.platformUser._id).select("-passwordHash").lean(true).exec();

        if (platformUser) {
          token.platformUser = {
            ...platformUser,
            _id: platformUser._id.toString(),
          };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.platformUser) {
        session.platformUser = token.platformUser;
      }

      return session;
    },
  },
  pages: {
    error: "/",
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const email = credentials.email;
        const emailTrimmed = typeof email === "string" ? email.trim() : "";
        const emailNormalized = emailTrimmed.toLowerCase();

        const providedLanguage = credentials.language || "en";

        const password = credentials.password;
        const passwordTrimmed = typeof password === "string" ? password.trim() : "";

        const language = api.languages.includes(providedLanguage) ? providedLanguage : "en";

        await connect();

        const platformUser = await PlatformUser.findOne({ emailNormalized }).lean(true).exec();

        if (platformUser && (await compare(passwordTrimmed, platformUser.passwordHash))) {
          if (platformUser.activatedAt !== null && platformUser.activatedAt !== undefined) {
            const { activationToken, passwordHash, passwordResetToken, ...safePlatformUser } = platformUser;

            return {
              ...safePlatformUser,
              _id: platformUser._id.toString(),
            };
          } else {
            throw new Error(api.auth.activateAccount[language]);
          }
        } else {
          throw new Error(api.auth.invalidCredentials[language]);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

function getNextAuthOptions(req) {
  const host = req.headers.get("host") || "";
  const protocol = req.headers.get("x-forwarded-proto") || (new URL(req.url).protocol === "https:" ? "https" : "http");

  const dynamicUrl = `${protocol}://${host}`;

  return {
    ...NextAuthOptions,
    callbacks: {
      ...NextAuthOptions.callbacks,
      async redirect({ url }) {
        return url.startsWith(dynamicUrl) ? url : dynamicUrl + (url.startsWith("/") ? url : "");
      },
    },
  };
}

export async function GET(req, res) {
  const nextAuthOptions = getNextAuthOptions(req);

  return NextAuth(nextAuthOptions)(req, res);
}

export async function POST(req, res) {
  const nextAuthOptions = getNextAuthOptions(req);

  return NextAuth(nextAuthOptions)(req, res);
}
