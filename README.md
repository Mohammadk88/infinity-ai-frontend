# Infinity AI System - Frontend

## Table of Contents
- [Overview](#overview)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [Component Details](#component-details)
- [Extending the Project](#extending-the-project)
- [Contribution Guidelines](#contribution-guidelines)
- [License Information](#license-information)

## Overview

Infinity AI System is a comprehensive all-in-one AI-powered platform designed to streamline and automate digital operations. The platform integrates social media management, marketing, scheduling, analytics, CRM functionality, task management, and more through smart AI automation.

### Core Features
- **AI-Powered Tools**: Automated content generation and optimization
- **Social Media Management**: Connect and manage multiple social accounts
- **Marketing Campaign Management**: Create, schedule, and analyze marketing campaigns
- **Task & Project Management**: Kanban board and task tracking system
- **CRM & Client Management**: Track leads, clients, and business relationships
- **Company Management**: Multi-company support with team member permissions
- **Affiliate Program**: Built-in affiliate system for referral marketing
- **Internationalization**: Support for multiple languages

### Target Users
- Marketing professionals
- Social media managers
- Small to medium-sized businesses
- Freelancers and agencies
- Content creators

## Installation and Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun package manager

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/infinity-ai-frontend.git
cd infinity-ai-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

The project follows Next.js 15.x App Router architecture with TypeScript and is organized into the following main directories:

### `/src` - Main Source Code

#### `/src/app` - Next.js App Router Pages
- `layout.tsx`: Root layout component for the entire application
- `page.tsx`: Main landing page
- `/auth`: Authentication-related pages (login, registration)
- `/dashboard`: Dashboard and feature pages organized by functionality
  - `layout.tsx`: Layout specific to dashboard pages
  - `/ai-tools`: AI tools and features
  - `/campaigns`: Marketing campaign management
  - `/clients`: Client management interface
  - `/companies`: Company management and settings
  - `/kanban`: Task management with kanban boards
  - `/affiliate`: Affiliate program management

#### `/src/components` - Reusable UI Components
- `/features`: Feature-specific components
  - `affiliate-status-alert.tsx`: Alert component for affiliate status
  - `company-form.tsx`: Form for company creation/editing
  - `company-switcher.tsx`: UI for switching between companies
  - `prompt-generator.tsx`: AI prompt generation interface
- `/layout`: Core layout components
  - `header.tsx`: Main application header
  - `sidebar.tsx`: Navigation sidebar
- `/providers`: React context providers
  - `theme-provider.tsx`: Dark/light theme handling
  - `i18n-provider.tsx`: Internationalization provider
- `/ui`: General UI components using Radix UI primitives
  - Form elements (buttons, inputs, selects)
  - Feedback elements (alerts, toasts)
  - Layout elements (cards, dialogs)

#### `/src/hooks` - Custom React Hooks
- `useAuth.ts`: Authentication related functionality
- `useSessionLoader.ts`: Session loading and management

#### `/src/i18n` - Internationalization
- `/locales`: Translation files for multiple languages
- `config.ts`: i18next configuration

#### `/src/store` - Global State Management (Zustand)
- `useAffiliateStore.ts`: Affiliate program state
- `useCompanyStore.ts`: Company management state
- `useUserStore.ts`: User information and settings

#### `/src/types` - TypeScript Type Definitions
- `User.ts`: User entity types
- `Company.ts`: Company entity types
- `AffiliateStats.ts`: Affiliate program statistics

### Root Configuration Files
- `next.config.ts`: Next.js configuration
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `components.json`: Component library configuration

## Component Details

### Authentication System
**Contents:** Login and registration flows, session management
**Purpose:** Handles user authentication securely
**Extension Points:** 
- Add additional auth providers in `/src/app/auth`
- Implement additional identity verification methods

### Dashboard Layout
**Contents:** Layout structure for authenticated user experience
**Purpose:** Provides consistent navigation and UI for all dashboard features
**Extension Points:**
- Add new navigation items in `sidebar.tsx`
- Customize header actions in `header.tsx`

### Company Management
**Contents:** Company creation, settings, and member management
**Purpose:** Enables multi-company support and team collaboration
**Extension Points:**
- Extend company permissions system in `useCompanyStore.ts`
- Add company-specific settings in `/companies/settings`

### AI Tools Integration
**Contents:** AI-powered automation and content generation
**Purpose:** Provides intelligent assistance for various tasks
**Extension Points:**
- Add new AI models in `/src/app/dashboard/ai-tools`
- Extend prompt templates in `prompt-generator.tsx`

### Affiliate System
**Contents:** Referral tracking, commission management, and analytics
**Purpose:** Enables users to participate in the affiliate program
**Extension Points:**
- Add commission tiers in `/src/app/dashboard/affiliate`
- Extend analytics reporting in affiliate dashboards

### Internationalization System
**Contents:** Multi-language support with i18next
**Purpose:** Makes the application accessible to users in different languages
**Extension Points:**
- Add new language files in `/src/i18n/locales`
- Extend translation keys in existing languages

### UI Component Library
**Contents:** Reusable, accessible UI components 
**Purpose:** Provides consistent visual language and UX across the application
**Extension Points:**
- Add new UI components in `/src/components/ui`
- Customize theme variables in theme provider

## Extending the Project

### Adding New Features
1. **Create Feature Components**:
   - Add new components in `/src/components/features`
   - Follow the naming convention: `feature-name.tsx`

2. **Add Feature Pages**:
   - Create new page in appropriate section under `/src/app/dashboard`
   - Example: `/src/app/dashboard/new-feature/page.tsx`

3. **Add to Navigation**:
   - Update sidebar navigation in `/src/components/layout/sidebar.tsx`

4. **State Management**:
   - Add feature-specific state in `/src/store/useFeatureStore.ts`

### Adding New API Integrations
1. Create API service files in `/src/lib` directory
2. Follow the axios instance pattern from `src/lib/axios.ts`
3. Implement appropriate error handling and response types

### Adding New Languages
1. Create new language file in `/src/i18n/locales` (e.g. `ja.json`)
2. Update language selector in `/src/components/ui/language-selector.tsx`
3. Add translations for all existing keys from `en.json`

## Contribution Guidelines

### Code Style and Conventions
- Follow TypeScript best practices
- Use functional components with hooks
- Document complex logic with comments
- Use meaningful variable and function names

### Development Process
1. Create a feature branch from `main`
2. Implement changes following project conventions
3. Write tests for new functionality
4. Submit pull request with detailed description

### Commit Message Format
Follow conventional commits specification:
```
feat: add new feature
fix: correct bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add/update tests
chore: maintenance tasks
```

## License Information

This project is licensed under the [MIT License](LICENSE).

---

**Project Status**: Under Active Development

Last Updated: April 26, 2025
