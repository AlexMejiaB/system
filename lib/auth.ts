// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const users = [
  {
    id: "1",
    name: "Admin",
    email: "admin@company.com",
    password: "admin123",
    role: "ADMIN",
  },
  {
    id: "2",
    name: "HR User",
    email: "hr@company.com",
    password: "hr123",
    role: "HR",
  },
  {
    id: "3",
    name: "Payroll User",
    email: "payroll@company.com",
    password: "payroll123",
    role: "PAYROLL",
  },
  {
    id: "4",
    name: "Manager User",
    email: "manager@company.com",
    password: "manager123",
    role: "MANAGER",
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        )

        if (user) return user
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
