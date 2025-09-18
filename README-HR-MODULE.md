# HR Management Module Documentation

## Overview
The HR Management module has been successfully integrated into the Combined Payroll Management System, providing comprehensive applicant tracking and onboarding functionalities.

## Features Added

### 1. Applicant Tracking System
- **Applicant Management**: Complete CRUD operations for job applicants
- **Application Status Tracking**: Monitor application progress through various stages
- **Position-based Applications**: Link applicants to specific job positions
- **Document Management**: Handle applicant documents and attachments

### 2. Interview Management
- **Interview Scheduling**: Schedule interviews with applicants
- **Interview Types**: Support for various interview types (Phone, Video, In-Person, Technical, Behavioral, Panel)
- **Interview Status Tracking**: Monitor interview progress and outcomes
- **Feedback Collection**: Capture interview feedback and ratings
- **Calendar Integration**: Due date and scheduling management

### 3. Onboarding Management
- **Task-based Onboarding**: Create and manage onboarding tasks
- **Template System**: Reusable onboarding templates for different positions
- **Progress Tracking**: Monitor onboarding completion status
- **Category Organization**: Organize tasks by categories (Documentation, Training, Equipment, etc.)
- **Assignment Management**: Assign tasks to specific team members

### 4. Document Management
- **Document Types**: Support for various document types (Resume, ID, Certificates, etc.)
- **File Management**: Upload and manage applicant and employee documents
- **Required Documents**: Mark documents as required for compliance
- **Document Tracking**: Monitor document submission and approval status

## Database Schema

### New Models Added
- **Applicant**: Job applicant information and status
- **Interview**: Interview scheduling and management
- **OnboardingTask**: Individual onboarding tasks
- **OnboardingTemplate**: Reusable onboarding templates
- **OnboardingTemplateTask**: Template task definitions
- **Document**: Document management for applicants and employees

### Enums Added
- **ApplicationStatus**: NEW, UNDER_REVIEW, INTERVIEW_SCHEDULED, INTERVIEWED, HIRED, REJECTED, WITHDRAWN
- **InterviewType**: PHONE, VIDEO, IN_PERSON, TECHNICAL, BEHAVIORAL, PANEL
- **InterviewStatus**: SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED, NO_SHOW
- **OnboardingTaskStatus**: PENDING, IN_PROGRESS, COMPLETED, OVERDUE, CANCELLED
- **OnboardingTaskCategory**: DOCUMENTATION, TRAINING, EQUIPMENT, SYSTEM_ACCESS, ORIENTATION, COMPLIANCE
- **DocumentType**: RESUME, COVER_LETTER, ID_DOCUMENT, DIPLOMA, CERTIFICATE, CONTRACT, TAX_FORM, BANK_INFO, EMERGENCY_CONTACT, PHOTO, OTHER

## API Endpoints

### HR Module APIs
- `GET/POST /api/hr/onboarding` - Onboarding task management
- `GET/PUT/DELETE /api/hr/onboarding/[id]` - Individual task operations
- `GET/POST /api/hr/interviews` - Interview management
- `GET/PUT/DELETE /api/hr/interviews/[id]` - Individual interview operations
- `GET/POST /api/hr/templates` - Onboarding template management
- `GET/POST /api/hr/documents` - Document management
- `POST /api/hr/applicants/[id]/onboard` - Start onboarding process

## Frontend Components

### Pages
- `/hr` - HR Dashboard with statistics and quick actions
- `/hr/onboarding` - Onboarding task management
- `/hr/interviews` - Interview scheduling and management
- `/hr/templates` - Onboarding template management
- `/hr/documents` - Document management

### Components
- `HRSidebar` - Navigation sidebar for HR module
- `OnboardingTaskForm` - Form for creating/editing onboarding tasks
- `OnboardingTaskList` - List view for onboarding tasks
- Additional forms and components for interviews and documents

## Integration Points

### Main Application
- Added HR module card to main homepage
- Integrated HR quick access links
- Updated middleware to protect HR routes
- Added HR navigation to main menu

### Authentication
- HR module is protected by NextAuth.js authentication
- Role-based access control (Admin, HR, Manager roles can access)
- Middleware protection for all HR routes

### Database
- Unified SQLite database with better-sqlite3
- Prisma ORM for type-safe database operations
- Shared database models with existing payroll and employee systems

## Usage Instructions

### Accessing the HR Module
1. Navigate to the main dashboard
2. Click "Access HR System" or use the quick access "Onboarding" button
3. Login with appropriate credentials (Admin, HR, or Manager role)

### Managing Onboarding Tasks
1. Go to `/hr/onboarding`
2. Use filters to find specific tasks
3. Click "Add Task" to create new onboarding tasks
4. Edit tasks by clicking the edit button
5. Update task status using the dropdown

### Scheduling Interviews
1. Navigate to `/hr/interviews`
2. Create new interviews for applicants
3. Track interview status and outcomes
4. Add feedback and ratings after completion

### Using Templates
1. Access `/hr/templates`
2. Create reusable onboarding templates
3. Associate templates with specific positions
4. Use templates when starting onboarding for new hires

## Technical Implementation

### Technology Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite with better-sqlite3
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui, Lucide React icons

### File Structure
```
app/hr/                     # HR module pages
├── layout.tsx             # HR layout with sidebar
├── page.tsx               # HR dashboard
├── onboarding/            # Onboarding management
├── interviews/            # Interview management
├── templates/             # Template management
└── documents/             # Document management

components/hr/              # HR-specific components
├── sidebar.tsx            # HR navigation sidebar
├── onboarding-task-form.tsx
├── onboarding-task-list.tsx
└── [other HR components]

app/api/hr/                # HR API routes
├── onboarding/            # Onboarding APIs
├── interviews/            # Interview APIs
├── templates/             # Template APIs
├── documents/             # Document APIs
└── applicants/            # Applicant APIs
```

## Future Enhancements

### Potential Improvements
1. **Email Notifications**: Automated emails for interview reminders and task assignments
2. **Calendar Integration**: Sync with external calendar systems
3. **Advanced Reporting**: Analytics and reports for HR metrics
4. **Bulk Operations**: Bulk task creation and management
5. **Mobile Optimization**: Enhanced mobile experience
6. **File Upload**: Direct file upload functionality for documents
7. **Workflow Automation**: Automated task creation based on triggers

### Scalability Considerations
- Database indexing for performance optimization
- Caching strategies for frequently accessed data
- API rate limiting and pagination
- Background job processing for heavy operations

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Ensure user has appropriate role permissions
2. **Database Errors**: Check Prisma schema and database connection
3. **Build Errors**: Some dynamic routes may need configuration for static generation
4. **Missing Components**: Ensure all shadcn/ui components are properly installed

### Development Setup
1. Install dependencies: `npm install`
2. Generate Prisma client: `npx prisma generate`
3. Push database schema: `npx prisma db push`
4. Start development server: `npm run dev`

## Conclusion

The HR Management module successfully extends the Combined Payroll Management System with comprehensive applicant tracking and onboarding capabilities. The module is fully integrated with the existing authentication system, database, and UI framework, providing a seamless user experience across all three systems (Payroll Dashboard, Bolt Time & Payroll, and HR Management).

