import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import AuthService from "@/server/services/auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "otp", type: "string" },
      },
      authorize: AuthService.authenticateUser,
    }),
  ],
  callbacks: {
    signIn: AuthService.handleSignIn,
    session: AuthService.handleSession,
    jwt: AuthService.handleJwt,
  },
  pages: {
    signIn: "/auth/login", // Custom sign-in page,
  },
};