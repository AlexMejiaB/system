# Combined Payroll Management System

A comprehensive Next.js application that combines two powerful payroll management systems into one unified platform. This system integrates employee management, time tracking, payroll processing, and detailed reporting capabilities.

## 🚀 Features

### Payroll Dashboard System
- **Employee Management**: Complete employee records with personal information, positions, and departments
- **Position Management**: Job positions with salary information and department assignments
- **Applicant Tracking**: Manage job applications and candidate information
- **Advanced Reports**: Detailed reporting for aguinaldo, vacation, saving funds, saving box, and comedor
- **Plant & Department Management**: Organize employees by location and department

### Bolt Time & Payroll System
- **Time Tracking**: Clock in/out functionality with overtime calculation
- **Payroll Processing**: Automated payroll calculations with deductions
- **User Authentication**: Role-based access control (Admin, HR, Payroll, Manager)
- **Payroll Periods**: Manage payroll cycles and generate pay stubs
- **Reports & Analytics**: Comprehensive payroll and time tracking reports

## 🛠 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Database**: SQLite with Prisma ORM and better-sqlite3
- **Authentication**: NextAuth.js with role-based access control
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd combined-payroll-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Initialize the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Authentication

The system includes demo accounts for testing:

- **Admin**: admin@company.com / admin123 (Full access)
- **HR**: hr@company.com / hr123 (Limited payroll access)
- **Payroll**: payroll@company.com / payroll123 (No applicant management)
- **Manager**: manager@company.com / manager123 (Limited access)

## 🏗 Project Structure

```
combined-payroll-project/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   ├── bolt-*/               # Bolt system APIs
│   │   ├── employees/            # Employee management APIs
│   │   ├── positions/            # Position management APIs
│   │   └── reports/              # Reporting APIs
│   ├── bolt/                     # Bolt system pages
│   ├── dashboard/                # Payroll dashboard pages
│   ├── login/                    # Authentication pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard-specific components
│   ├── reports/                  # Report components
│   ├── bolt-*/                   # Bolt system components
│   └── *.tsx                     # Shared components
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication configuration
│   ├── database.ts               # Database connection
│   ├── prisma.ts                 # Prisma client
│   └── *.ts                      # Business logic modules
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema definition
├── schemas/                      # Validation schemas
│   ├── bolt/                     # Bolt system schemas
│   └── *.ts                      # Zod validation schemas
└── public/                       # Static assets
```

## 🗄 Database Schema

The system uses a unified SQLite database with the following main models:

- **User**: Authentication and user management
- **Employee**: Employee records with personal and job information
- **Position**: Job positions with salary and department info
- **Applicant**: Job application tracking
- **Plant/Department**: Organizational structure
- **TimeEntry**: Time tracking records
- **PayrollPeriod/PayrollEntry**: Payroll processing
- **Deduction**: Payroll deductions configuration

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Employee Management
- `GET/POST /api/employees` - List/create employees
- `GET/PUT/DELETE /api/employees/[id]` - Employee operations
- `GET/POST /api/bolt-employees` - Bolt system employees

### Payroll & Time Tracking
- `GET/POST /api/bolt-payroll/periods` - Payroll periods
- `GET/POST /api/bolt-payroll/time-entries` - Time entries
- `GET /api/bolt-payroll/deductions` - Payroll deductions

### Reports
- `GET /api/reports/aguinaldo` - Aguinaldo report
- `GET /api/reports/vacation` - Vacation report
- `GET /api/reports/saving-funds` - Saving funds report

## 🎨 UI Components

The system uses shadcn/ui components for a consistent and modern interface:

- Cards, Buttons, Forms, Tables
- Navigation, Sidebars, Dialogs
- Charts and Data Visualization
- Responsive Design for Mobile/Desktop

## 🔒 Security Features

- Role-based access control with middleware
- Secure authentication with NextAuth.js
- Input validation with Zod schemas
- SQL injection protection with Prisma
- Environment variable configuration

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes and orientations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the documentation
2. Review the demo accounts and test data
3. Examine the API endpoints and database schema
4. Test the responsive design on different devices

## 🔄 Updates and Maintenance

- Regular dependency updates
- Security patches
- Feature enhancements
- Bug fixes and improvements

---

**Note**: This is a combined system that merges two separate payroll management applications. All components, pages, API routes, and features from both original systems have been preserved and integrated into this unified platform.

