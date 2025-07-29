# ReferralLink - Job Referral Marketplace Platform

## Overview

ReferralLink is a comprehensive job referral marketplace that connects job seekers with employees and HR professionals. The platform facilitates job referrals by allowing company employees to post opportunities, candidates to apply through referrals, and HR teams to manage their company's referral pipeline. The application is built as a full-stack web platform with a React frontend and Express.js backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Upload**: Multer for handling resume uploads (PDF/Word documents)
- **Session Management**: JWT tokens stored in localStorage

### Development Setup
- **Monorepo Structure**: Single repository with client, server, and shared code
- **Module System**: ES Modules throughout the application
- **Development Server**: Vite dev server with Express API integration
- **Hot Reload**: Vite HMR for frontend development

## Key Components

### User Roles and Authentication
- **Three User Types**: Candidates (job seekers), Referrers (employees), and HR (company admins)
- **Role-Based Access**: Different dashboard views and permissions based on user role
- **Secure Authentication**: JWT tokens with password hashing and validation

### Database Schema
- **Users Table**: Core user information with role and company association
- **Profiles Table**: Extended user profile data including skills, experience, and resume
- **Companies Table**: Company information and metadata
- **Jobs Table**: Job postings with referrer association and status tracking
- **Applications Table**: Job application tracking with status management

### UI Components
- **Design System**: Comprehensive component library using Radix UI primitives
- **Responsive Design**: Mobile-first approach with Bootstrap-inspired layout classes
- **Accessibility**: ARIA-compliant components with keyboard navigation support
- **Theme Support**: CSS custom properties for light/dark theme switching

### API Structure
- **RESTful Endpoints**: Organized by resource (auth, users, jobs, applications, companies)
- **Middleware**: Authentication middleware for protected routes
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **File Upload**: Secure file handling with type and size validation

## Data Flow

### Authentication Flow
1. User signs up with email/password and role selection
2. Password is hashed using bcrypt before storage
3. JWT token is generated upon successful login
4. Token is stored in localStorage and sent with API requests
5. Server validates JWT tokens using middleware for protected routes

### Job Application Flow
1. Referrer posts job opportunity with company association
2. Job appears in candidate job search/feed
3. Candidate applies through application modal with optional message
4. Application is stored with tracking status
5. Referrer and HR can view applications in their respective dashboards

### Data Storage
- **PostgreSQL Database**: Relational data with foreign key constraints
- **File Storage**: Resume files stored in uploads directory
- **Session Storage**: JWT tokens for authentication state
- **Query Caching**: TanStack Query handles client-side caching and synchronization

## External Dependencies

### Frontend Dependencies
- **@radix-ui/**: Complete set of unstyled, accessible UI primitives
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight client-side routing
- **zod**: TypeScript-first schema declaration and validation

### Backend Dependencies
- **@neondatabase/serverless**: Neon database driver for serverless PostgreSQL
- **drizzle-orm**: Type-safe ORM with excellent TypeScript support
- **bcrypt**: Password hashing and validation
- **jsonwebtoken**: JWT token generation and verification
- **multer**: File upload handling middleware

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API proxy
- **Database**: Neon serverless PostgreSQL for development
- **Environment Variables**: DATABASE_URL and JWT_SECRET required
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend

### Production Build
- **Frontend Build**: Vite builds optimized static assets to dist/public
- **Backend Build**: esbuild bundles server code to dist/index.js
- **Static Serving**: Express serves built frontend assets in production
- **Database Migrations**: Drizzle Kit handles schema migrations

### Hosting Requirements
- **Node.js Runtime**: ES Modules support required
- **PostgreSQL Database**: Compatible with Neon or any PostgreSQL provider
- **File Storage**: Local file system for resume uploads (uploads/ directory)
- **Environment Variables**: DATABASE_URL and JWT_SECRET must be configured

The application is designed to be platform-agnostic and can be deployed to any Node.js hosting service that supports ES Modules and PostgreSQL connectivity.