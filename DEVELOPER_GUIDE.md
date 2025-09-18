# IMPRO - HR Information System: Developer Guide

This guide provides a comprehensive, step-by-step walkthrough for developers to understand, replicate, and extend the IMPRO HR Information System. It covers the project's architecture, setup, and key functionalities, with explanations of syntax and component logic.

## Table of Contents
1.  [Project Overview](#1-project-overview)
2.  [Prerequisites](#2-prerequisites)
3.  [Local Development Setup](#3-local-development-setup)
4.  [Project Structure](#4-project-structure)
5.  [Database Management (Prisma & SQLite)](#5-database-management-prisma--sqlite)
6.  [Authentication (NextAuth.js)](#6-authentication-nextauthjs)
7.  [Frontend Development (Next.js, React, Tailwind CSS)](#7-frontend-development-nextjs-react-tailwind-css)
8.  [Backend Development (Next.js API Routes)](#8-backend-development-nextjs-api-routes)
9.  [Key Modules & Components Logic](#9-key-modules--components-logic)
    - [Employee Management](#employee-management)
    - [HR Module](#hr-module)
    - [Incident Management](#incident-management)
    - [Labor Calculations (Mexican Law)](#labor-calculations-mexican-law)
    - [Reporting](#reporting)
10. [Testing](#10-testing)
11. [Troubleshooting](#11-troubleshooting)

## 1. Project Overview

IMPRO is a comprehensive Human Resources Information System (HRIS) built with Next.js, Prisma, and SQLite. It integrates functionalities for payroll management, time tracking, and extensive HR operations, including applicant tracking, onboarding, performance management, benefits, training, and incident reporting, all tailored to Mexican labor law.

## 2. Prerequisites

Before you begin, ensure you have the following installed on your development machine:

-   **Node.js (v18.x or higher):** A JavaScript runtime environment. You can download it from [nodejs.org](https://nodejs.org/).
-   **npm (v8.x or higher) or Yarn (v1.x or higher):** Package managers for Node.js. npm is usually bundled with Node.js.
-   **Git:** For version control. Download from [git-scm.com](https://git-scm.com/).
-   **Text Editor:** Visual Studio Code is recommended for its excellent TypeScript and React support.

## 3. Local Development Setup

Follow these steps to get the project running on your local machine:

### 3.1. Clone the Repository

First, clone the project repository to your local machine. If you received a zip file, extract it to your desired directory.

```bash
git clone <repository-url> # Replace with actual repository URL if available
cd combined-payroll-project # Or the name of your extracted folder
```

### 3.2. Install Dependencies

Navigate into the project directory and install all necessary Node.js packages.

```bash
npm install
# or
yarn install
```

### 3.3. Configure Environment Variables

Create a `.env.local` file in the root of your project. This file will store sensitive information and configuration specific to your local environment. It is ignored by Git for security reasons.

```bash
cp .env.example .env.local
```

Open `.env.local` and update the following variables:

-   `NEXTAUTH_SECRET`: A long, random string used to encrypt NextAuth.js sessions. Generate a strong one, e.g., using `openssl rand -base64 32`.
-   `NEXTAUTH_URL`: The URL where your application is running. For local development, this is typically `http://localhost:3000`.
-   `DATABASE_URL`: The connection string for your database. For SQLite, it should be `file:./database.sqlite`.

Example `.env.local`:

```env
NEXTAUTH_SECRET="your_super_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="file:./database.sqlite"
```

### 3.4. Database Setup

This project uses Prisma as an ORM (Object-Relational Mapper) with SQLite as the database. Prisma simplifies database interactions by allowing you to define your database schema in a human-readable format and then generating a type-safe client for your application.

**What is an ORM?**
An ORM (Object-Relational Mapper) is a programming technique that converts data between incompatible type systems using object-oriented programming languages. It allows developers to interact with a database using objects instead of raw SQL queries, making database operations more intuitive and less error-prone.

**What is SQLite?**
SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. It is the most used database engine in the world. SQLite is serverless, meaning it doesn't require a separate server process to operate.

First, generate the Prisma client based on your `prisma/schema.prisma` file. This creates the necessary TypeScript types for your database models.

```bash
npm run db:generate
# or
yarn db:generate
```

Next, push the schema to your SQLite database. This command creates the `database.sqlite` file and sets up all the tables defined in your Prisma schema.

```bash
npm run db:push
# or
yarn db:push
```

### 3.5. Seed the Database (Optional but Recommended)

To populate your database with example data (including employees, departments, positions, and HR-related data tailored to Mexican labor law), run the seeding script.

```bash
npm run db:seed
# or
yarn db:seed
```

### 3.6. Start the Development Server

Finally, start the Next.js development server.

```bash
npm run dev
# or
yarn dev
```

The application will be accessible at `http://localhost:3000` (or another port if 3000 is in use).

## 4. Project Structure

The project follows a standard Next.js App Router structure, organized for modularity and scalability:

```
combined-payroll-project/
├── app/                      # Next.js App Router pages, layouts, and API routes
│   ├── api/                  # API routes for various modules (e.g., /api/hr, /api/payroll)
│   ├── bolt/                 # Pages and components specific to the Bolt Time & Payroll system
│   ├── dashboard/            # Pages and components specific to the Payroll Dashboard
│   ├── hr/                   # Pages and components for the HR Management System
│   ├── incidents/            # Pages and components for Incident Management
│   ├── labor-calculations/   # Pages and components for Mexican Labor Law calculations
│   ├── reports/              # Pages and components for Report Generation
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout for the entire application
│   ├── page.tsx              # Main homepage
│   └── globals.css           # Global styles (Tailwind CSS)
├── components/               # Reusable React components (UI, shared logic)
│   ├── ui/                   # shadcn/ui components (buttons, cards, forms, etc.)
│   ├── hr/                   # HR-specific reusable components
│   ├── incidents/            # Incident-specific reusable components
│   └── ...                   # Other module-specific components
├── lib/                      # Utility functions, helpers, and configurations
│   ├── auth.ts               # NextAuth.js configuration
│   ├── database.ts           # Database connection (better-sqlite3)
│   ├── prisma.ts             # Prisma client instance
│   └── utils.ts              # General utility functions
├── prisma/                   # Prisma schema and migrations
│   └── schema.prisma         # Database schema definition
├── public/                   # Static assets (images, fonts, etc.)
├── scripts/                  # Utility scripts (e.g., database seeding, testing)
├── types/                    # Custom TypeScript type definitions
├── .env.local                # Environment variables (local)
├── .env.example              # Example environment variables
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── README.md                 # Project README
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 5. Database Management (Prisma & SQLite)

### 5.1. Prisma Schema (`prisma/schema.prisma`)

This file defines your database models, their fields, relationships, and data types. Prisma uses this schema to generate the database tables and the Prisma Client.

**Example Model Definition:**

```prisma
model Employee {
  id              Int             @id @default(autoincrement())
  employeeId      String          @unique
  name            String
  payrollNumber   Int             @unique
  email           String?         @unique
  phone           String?
  hireDate        DateTime
  dailySalary     Float
  monthlySalary   Float?          // For Mexican labor law calculations
  shift           String?
  transportType   String?
  collarType      CollarType
  isActive        Boolean         @default(true)
  plantId         Int
  departmentId    Int
  positionId      Int?
  
  // Mexican Labor Law Fields
  rfc             String?         // Registro Federal de Contribuyentes
  curp            String?         // Clave Única de Registro de Población
  nss             String?         // Número de Seguridad Social
  bankAccount     String?         // Bank account for deposits
  emergencyContact String?        // Emergency contact information
  
  // Relations
  plant       Plant       @relation(fields: [plantId], references: [id])
  department  Department  @relation(fields: [departmentId], references: [id])
  position    Position?   @relation(fields: [positionId], references: [id])
  timeEntries TimeEntry[]
  payrollEntries PayrollEntry[]
  incidents   Incident[]
  laborCalculations LaborCalculation[]
  benefitEnrollments BenefitEnrollment[]
  trainingEnrollments TrainingEnrollment[]
  assetAssignments AssetAssignment[]
  performanceReviews PerformanceReview[]
  recognitions Recognition[]
  onboardingTasks OnboardingTask[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Explanation of Syntax:**

-   `model Employee { ... }`: Defines a database table named `Employee`.
-   `id Int @id @default(autoincrement())`: Defines an integer field `id` that is the primary key (`@id`) and automatically increments (`@default(autoincrement())`).
-   `employeeId String @unique`: Defines a string field `employeeId` that must be unique across all records.
-   `name String`: A simple string field for the employee's name.
-   `email String? @unique`: A nullable string field (`String?`) that must be unique.
-   `DateTime`: Represents a date and time value.
-   `Float`: Represents a floating-point number.
-   `Boolean`: Represents a true/false value.
-   `CollarType`: An enum type (defined elsewhere in `schema.prisma`) representing a specific set of allowed string values.
-   `plantId Int`: An integer field that serves as a foreign key.
-   `plant Plant @relation(fields: [plantId], references: [id])`: Defines a one-to-many relationship. An `Employee` belongs to one `Plant`, and a `Plant` can have many `Employees`. `fields` specifies the foreign key in the `Employee` model, and `references` specifies the primary key in the `Plant` model.
-   `TimeEntry[]`: Defines a one-to-many relationship where an `Employee` can have multiple `TimeEntry` records.
-   `@default(now())`: Sets the default value of `createdAt` to the current timestamp when a record is created.
-   `@updatedAt`: Automatically updates the `updatedAt` field to the current timestamp whenever the record is modified.

### 5.2. Prisma Client (`lib/prisma.ts`)

This file initializes and exports the Prisma Client, which is used to interact with your database from your application code.

```typescript
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Explanation of Logic:**

This code implements a singleton pattern for the Prisma Client. This is crucial in Next.js development to prevent multiple instances of Prisma Client from being created during hot-reloading, which can lead to performance issues or unexpected behavior. It ensures that only one instance of `PrismaClient` is active throughout the application's lifecycle.

### 5.3. Database Seeding (`scripts/enhanced-seed-database.ts`)

This script populates the database with initial data, useful for development and testing. It includes comprehensive examples for all modules, adhering to Mexican labor law for calculations.

**Key Logic:**

-   **Clearing Data:** Starts by deleting existing data to ensure a clean slate for seeding.
-   **Creating Core Data:** Populates `User`, `Department`, `Plant`, and `Position` models first, as these are foundational for other models.
-   **Employee Creation:** Generates a diverse set of employees with realistic data, including Mexican-specific fields (RFC, CURP, NSS) and assigns them to departments, plants, and positions.
-   **Mexican Labor Law Calculations:** For each employee, it calculates `dailySalary` and `monthlySalary` based on typical Mexican salary ranges. It also sets up data for `LaborCalculation` to demonstrate aguinaldo, vacation, and saving fund calculations.
-   **HR Module Data:** Seeds data for `Applicant`, `Interview`, `OnboardingTask`, `BenefitPlan`, `TrainingProgram`, `Asset`, `PerformanceReview`, and `Incident` models, ensuring a rich dataset for testing the HR functionalities.
-   **Time and Payroll Data:** Creates `TimeEntry` and `PayrollEntry` records to simulate historical data for time tracking and payroll processing.
-   **Relationships:** Ensures all relationships between models are correctly established during seeding.

## 6. Authentication (NextAuth.js)

NextAuth.js is used for authentication, providing secure and flexible authentication for Next.js applications.

### 6.1. NextAuth Configuration (`lib/auth.ts`)

This file configures NextAuth.js, defining providers, callbacks, and session management.

```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "./prisma"
import { UserRole } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnBolt = nextUrl.pathname.startsWith("/bolt")
      const isOnHR = nextUrl.pathname.startsWith("/hr")
      const isOnIncidents = nextUrl.pathname.startsWith("/incidents")
      const isOnLaborCalculations = nextUrl.pathname.startsWith("/labor-calculations")
      const isOnReports = nextUrl.pathname.startsWith("/reports")
      const isLoginPage = nextUrl.pathname === "/login"

      if (isOnDashboard || isOnBolt || isOnHR || isOnIncidents || isOnLaborCalculations || isOnReports) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl)) // Redirect logged in users from login to home
        }
        return true
      }
      return true
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials
        if (typeof email !== "string" || typeof password !== "string") {
          return null
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          return null
        }

        const isPasswordValid = await compare(password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
})
```

**Explanation of Logic:**

-   `NextAuth({...})`: Initializes NextAuth.js with various options.
-   `pages: { signIn: "/login" }`: Specifies the custom login page for the application.
-   `session: { strategy: "jwt", maxAge: ... }`: Configures session management to use JSON Web Tokens (JWTs) and sets their expiration time.
-   `callbacks: { jwt, session, authorized }`: Defines functions that are called at different stages of the authentication flow:
    -   `jwt({ token, user })`: Modifies the JWT token to include the user's `id` and `role` after successful authentication.
    -   `session({ session, token })`: Populates the `session.user` object with `id` and `role` from the JWT token, making this information available throughout the frontend.
    -   `authorized({ auth, request: { nextUrl } })`: This is the authorization middleware. It checks if a user is logged in (`isLoggedIn`) and if they are trying to access a protected route (e.g., `/dashboard`, `/hr`). If an unauthenticated user tries to access a protected route, they are redirected to the login page. If a logged-in user tries to access the login page, they are redirected to the home page.
-   `providers: [Credentials({...})]`: Configures the `Credentials` provider, which allows users to log in with an email and password. The `authorize` function handles validating the credentials against the database using `bcryptjs` to compare hashed passwords.

### 6.2. Middleware (`middleware.ts`)

Next.js middleware is used for route protection, ensuring that only authenticated and authorized users can access certain parts of the application.

```typescript
import { auth } from "./lib/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname === "/login"
  const isAuthRoute = nextUrl.pathname === "/login"

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl))
    }
    return null
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return null
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*) "],
}
```

**Explanation of Logic:**

-   `export default auth((req) => { ... })`: The `auth` function from `lib/auth.ts` wraps the middleware, providing access to the authentication status (`req.auth`).
-   `isLoggedIn`: A boolean indicating if the user is authenticated.
-   `isPublicRoute`: Defines routes that are accessible to everyone (e.g., home page, login page).
-   `isAuthRoute`: Specifically identifies the login page.
-   **Login Page Redirection:** If a logged-in user tries to access the login page, they are redirected to the home page.
-   **Protected Route Redirection:** If an unauthenticated user tries to access any route that is not a public route, they are redirected to the login page.
-   `matcher`: Configures which paths the middleware should run on. The current configuration applies the middleware to all routes except API routes, Next.js static files, images, and the favicon.

## 7. Frontend Development (Next.js, React, Tailwind CSS)

### 7.1. Global Styles (`app/globals.css`)

This file defines the global styles for the application, including the professional typography, color palette, and utility classes using Tailwind CSS.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Professional Typography and Sober Design System */
@import url(\'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');

:root {
  /* Professional Color Palette - Sober and Corporate */
  --color-primary: #1e293b;        /* Slate 800 - Professional dark blue */
  --color-primary-light: #334155;  /* Slate 700 */
  --color-primary-dark: #0f172a;   /* Slate 900 */
  
  --color-secondary: #64748b;      /* Slate 500 - Professional gray */
  --color-secondary-light: #94a3b8; /* Slate 400 */
  --color-secondary-dark: #475569;  /* Slate 600 */
  
  --color-accent: #0ea5e9;         /* Sky 500 - Professional blue accent */
  --color-accent-light: #38bdf8;   /* Sky 400 */
  --color-accent-dark: #0284c7;    /* Sky 600 */
  
  --color-success: #059669;        /* Emerald 600 - Professional green */
  --color-warning: #d97706;        /* Amber 600 - Professional orange */
  --color-error: #dc2626;          /* Red 600 - Professional red */
  
  --color-background: #ffffff;     /* Pure white */
  --color-surface: #f8fafc;       /* Slate 50 - Light gray surface */
  --color-surface-dark: #f1f5f9;  /* Slate 100 */
  
  --color-border: #e2e8f0;        /* Slate 200 - Subtle borders */
  --color-border-dark: #cbd5e1;   /* Slate 300 */
  
  --color-text-primary: #0f172a;   /* Slate 900 - Primary text */
  --color-text-secondary: #475569; /* Slate 600 - Secondary text */
  --color-text-muted: #64748b;     /* Slate 500 - Muted text */
  
  /* Professional Typography Scale */
  --font-family-primary: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;
  --font-family-mono: \'JetBrains Mono\', \'Fira Code\', Consolas, monospace;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Professional Spacing Scale */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
  
  /* Professional Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Professional Border Radius */
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f172a;
    --color-surface: #1e293b;
    --color-surface-dark: #334155;
    --color-border: #334155;
    --color-border-dark: #475569;
    --color-text-primary: #f8fafc;
    --color-text-secondary: #cbd5e1;
    --color-text-muted: #94a3b8;
  }
}

/* Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Professional Typography Classes */
.text-display-1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.025em;
}

.text-display-2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.025em;
}

.text-heading-1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.025em;
}

.text-heading-2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.text-heading-3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}

.text-body-large {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
}

.text-body {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.text-body-small {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.text-caption {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.text-mono {
  font-family: var(--font-family-mono);
}

/* Professional Color Classes */
.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-muted { color: var(--color-text-muted); }
.text-accent { color: var(--color-accent); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-error { color: var(--color-error); }

.bg-primary { background-color: var(--color-primary); }
.bg-surface { background-color: var(--color-surface); }
.bg-surface-dark { background-color: var(--color-surface-dark); }
.bg-accent { background-color: var(--color-accent); }

.border-default { border-color: var(--color-border); }
.border-dark { border-color: var(--color-border-dark); }

/* Professional Component Styles */
.card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-dark);
}

.card-header {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.card-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary-light);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-text-primary);
  border-color: var(--color-border-dark);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-surface);
  border-color: var(--color-border-dark);
}

.btn-accent {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.btn-accent:hover:not(:disabled) {
  background-color: var(--color-accent-dark);
  border-color: var(--color-accent-dark);
}

.btn-success {
  background-color: var(--color-success);
  color: white;
  border-color: var(--color-success);
}

.btn-warning {
  background-color: var(--color-warning);
  color: white;
  border-color: var(--color-warning);
}

.btn-error {
  background-color: var(--color-error);
  color: white;
  border-color: var(--color-error);
}

.btn-sm {
  padding: calc(var(--spacing-xs) + 1px) var(--spacing-sm);
  font-size: var(--font-size-xs);
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
}

/* Professional Form Styles */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all 0.2s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgb(14 165 233 / 0.1);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

/* Professional Table Styles */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.table th {
  padding: var(--spacing-md);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.table tbody tr:hover {
  background-color: var(--color-surface);
}

/* Professional Badge Styles */
.badge {
  display: inline-flex;
  align-items: center;
  padding: calc(var(--spacing-xs) / 2) var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-primary { background-color: rgb(30 41 59 / 0.1); color: var(--color-primary); }
.badge-success { background-color: rgb(5 150 105 / 0.1); color: var(--color-success); }
.badge-warning { background-color: rgb(217 119 6 / 0.1); color: var(--color-warning); }
.badge-error { background-color: rgb(220 38 38 / 0.1); color: var(--color-error); }

/* Professional Layout Utilities */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

/* Professional Animation */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Professional Responsive Design */
@media (max-width: 768px) {
  :root {
    --font-size-4xl: 2rem;
    --font-size-3xl: 1.5rem;
    --font-size-2xl: 1.25rem;
  }
  
  .container {
    padding: 0 var(--spacing-sm);
  }
  
  .card {
    padding: var(--spacing-md);
  }
  
  .btn {
    padding: var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
}

/* Professional Focus Styles */
.focus-visible:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Professional Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-dark);
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-secondary);
}

/* Professional Print Styles */
@media print {
  * {
    color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  
  .no-print {
    display: none !important;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #000;
  }
}



## 6.3. Adding New Users with Specific Roles

To easily add new users with different roles (ADMIN, HR, PAYROLL, MANAGER, EMPLOYEE) for testing or development, you can use the `add-user.ts` script.

### Usage:

```bash
npx tsx scripts/add-user.ts <email> <password> <role>
```

**Example:**

To add a new HR user:

```bash
npx tsx scripts/add-user.ts new.hr@company.com newhrpass HR
```

To add a new Manager user:

```bash
npx tsx scripts/add-user.ts new.manager@company.com newmanagerpass MANAGER
```

**Available Roles:**
- `ADMIN`
- `HR`
- `PAYROLL`
- `MANAGER`
- `EMPLOYEE`

This script will hash the password and create a new user entry in your SQLite database with the specified email, password, and role.




## 6.4. Web-Based User Management (Admin Dashboard)

For a more user-friendly approach to user management, an admin dashboard is available to users with the `ADMIN` role. This interface allows for the creation, editing, and deletion of users directly through the web application.

### Accessing the Admin Dashboard

1.  **Log In as Admin:** Log in to the application using an account with the `ADMIN` role (e.g., `admin@company.com`).
2.  **Navigate to Admin Section:** After logging in, an "Admin" link will appear in the main navigation. Clicking this link will take you to the admin dashboard.

### User Management Features

The user management section of the admin dashboard (`/admin/users`) provides the following functionalities:

-   **List Users:** Displays a table of all registered users, including their name, email, role, and creation date.
-   **Add New User:** A form is available to add new users. The form requires the user's name, email, password, and role.
-   **Edit User:** Existing users can be edited by clicking the "Edit" button. This allows for updating the user's name, email, and role. The password can also be updated by providing a new one.
-   **Delete User:** Users can be deleted by clicking the "Delete" button. A confirmation prompt will appear before deletion. Note that an admin cannot delete their own account.

### API Endpoints for User Management

The user management interface is powered by the following API endpoints:

-   `GET /api/admin/users`: Retrieves a list of all users. Requires `ADMIN` role.
-   `POST /api/admin/users`: Creates a new user. Requires `ADMIN` role.
-   `GET /api/admin/users/[id]`: Retrieves a single user by their ID. Requires `ADMIN` role.
-   `PUT /api/admin/users/[id]`: Updates a user's information. Requires `ADMIN` role.
-   `DELETE /api/admin/users/[id]`: Deletes a user. Requires `ADMIN` role.

These endpoints are protected by middleware to ensure that only authenticated admin users can perform user can access them.


