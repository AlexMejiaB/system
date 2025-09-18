import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string
    const pathname = req.nextUrl.pathname

    // Admin puede acceder a todo
    if (role === "ADMIN") return NextResponse.next()

    // HR restricciones
    if (role === "HR" && pathname.startsWith("/payroll")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    if (role === "HR" && pathname.startsWith("/time-tracking")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // Payroll restricciones
    if (role === "PAYROLL" && (pathname.startsWith("/positions") || pathname.startsWith("/applicants"))) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // Manager restricciones
    if (role === "MANAGER" && (pathname.startsWith("/payroll") || pathname.startsWith("/applicants"))) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    if (role === "MANAGER" && pathname.startsWith("/time-tracking")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bolt/:path*",
    "/hr/:path*",
    "/employees/:path*",
    "/positions/:path*",
    "/payroll/:path*",
    "/time-tracking/:path*",
    "/reports/:path*",
    "/applicants/:path*",
    "/admin/:path*",
    "/incidents/:path*",
    "/labor-calculations/:path*",
  ],
}
