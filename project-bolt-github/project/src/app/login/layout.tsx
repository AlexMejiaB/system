// app/login/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | IMPRO ERP",
  description: "Acceso al sistema ERP",
  icons: {
    icon: "/favicon.png",
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      {children}
    </div>
  )
}
