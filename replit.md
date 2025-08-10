# SafeViewShield - AI Content Protection Platform

## Overview

SafeViewShield is a full-stack web application designed to protect children from AI-generated inappropriate content across digital platforms. The system uses advanced AI detection technology to identify and block harmful synthetic videos in real-time before they reach users. It provides comprehensive parental controls, detailed reporting dashboards, and multi-tier subscription plans for families and educational institutions.

The application is built as a modern React SPA with an Express.js backend, featuring real-time content analysis, device management, and subscription handling capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod schema validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with JSON responses
- **Request Logging**: Custom middleware for API request/response logging
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot module replacement via Vite integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Schema**: Drizzle schema definitions with Zod validation integration
- **Migrations**: Drizzle Kit for database migration management
- **Development Storage**: In-memory storage implementation for rapid prototyping

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Model**: Email-based user identification with subscription tiers
- **Authorization**: Role-based access control through subscription tiers (family, school_basic, school_enterprise)

### Core Business Logic
- **Content Analysis Engine**: Mock AI detection service simulating real-time content analysis
- **Risk Assessment**: Three-tier risk classification (safe, medium, high)
- **Device Management**: Multi-device tracking and protection status monitoring
- **Subscription System**: Tiered pricing with feature restrictions based on subscription level

### External Dependencies

- **Database**: Neon PostgreSQL serverless database
- **Development Tools**: Replit integration with cartographer and runtime error overlay
- **UI Framework**: Radix UI primitives for accessible components
- **Validation**: Zod for runtime type checking and schema validation
- **Build System**: Vite with React plugin and development tooling
- **Styling**: Tailwind CSS with PostCSS processing
- **Package Management**: NPM with lockfile for dependency management