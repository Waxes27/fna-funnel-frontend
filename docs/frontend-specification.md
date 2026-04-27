# Frontend Architecture & Specification
**Project:** AI Financial Advisor Platform (Momentum-Aligned)

This document outlines the client-side architecture, UI/UX specifications, and frontend implementation details. For server-side logic and database architecture, please refer to the `backend-specification.md`.

---

## 1. Technology Stack & Architecture

### 1.1 Client-Side Technologies
- **Framework:** Next.js (React)
- **State Management:** Zustand / React Context API
- **Styling:** Tailwind CSS + Radix UI (or similar accessible component library)
- **Data Fetching:** React Query / SWR (for caching, pagination, and sync with Backend API)
- **Charting/Visuals:** Recharts or Chart.js (for Scenario Simulation and Budget breakdown)
- **Form Management:** React Hook Form + Zod (for validation aligning with backend DTOs)

### 1.2 Frontend Architecture
- **App Router:** Utilizing Next.js App Router for layouts and Server-Side Rendering (SSR).
- **Component Structure:** Atomic design principles (Atoms, Molecules, Organisms, Templates, Pages).
- **Authentication Flow:** 
  - Token-based (JWT) managed via HttpOnly cookies (coordinated with backend).
  - Auth context provider wrapping protected routes.
  - Role-based routing (Client vs. Adviser vs. Admin).

---

## 2. UI/UX & Browser Compatibility

### 2.1 UI/UX Specifications
- **Design System:** Consistent Momentum-aligned branding (colors, typography).
- **Accessibility:** WCAG 2.1 AA compliance (ARIA labels, keyboard navigation, screen reader support).
- **Responsiveness:** Mobile-first approach. Dashboards must gracefully degrade on smaller screens.
- **Progressive Disclosure:** Complex forms (e.g., Financial Data Capture) divided into multi-step wizards to reduce cognitive load.

### 2.2 Browser Compatibility
- Evergreen browsers (Chrome, Firefox, Safari, Edge) - last 2 major versions.
- iOS Safari 14+ and Android Chrome 90+.

---

## 3. Core Modules (Frontend Implementation)

### 3.1 Authentication & User Management
- **Login/Registration:** Forms capturing First name, Last name, Email, Password, Mobile.
- **MFA:** OTP input screens integrating with backend verification endpoints.

### 3.2 Data Capture & Profiling
- **Client Profile Wizards:** Multi-step forms for Personal, Contact, Employment, and Household info.
- **Financial Data:** Dynamic forms for adding/removing Assets, Liabilities, Income sources, and Expenses.

### 3.3 Dashboards & Visualizations
- **Client Portal:** Displays Budget Health Score, Expense breakdowns (pie charts), Retirement projections (line graphs).
- **Adviser Dashboard:** Tabular data with advanced filtering/sorting, client overview cards, and "Edit Assumptions" modal.
- **Admin Panel:** Data grids for platform analytics and assumption variable controls.

### 3.4 AI Assistant Interface
- Chat UI component featuring typing indicators, message history, and suggested prompts.
- Handles Markdown rendering for AI responses and strictly routes product queries to "Consult Adviser" CTAs.

---

## 4. Integration Points & Shared Data Models

### 4.1 Communication Protocols
- **RESTful API:** Primary communication with the Spring Boot backend via JSON over HTTPS.
- **WebSockets/SSE:** Optional for real-time AI typing streams (if supported by backend AI layer).

### 4.2 Shared Data Models (TypeScript Interfaces)
To maintain parity with backend DTOs:
```typescript
interface UserProfile {
  id: string;
  role: 'CLIENT' | 'ADVISER' | 'ADMIN';
  email: string;
  firstName: string;
  lastName: string;
}

interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  assets: Asset[];
  liabilities: Liability[];
}
```

### 4.3 Authentication Flow Integration
1. Frontend posts credentials to `/api/v1/auth/login`.
2. Backend validates and sets `HttpOnly` JWT cookie.
3. Frontend redirects based on user role payload fetched from `/api/v1/users/me`.
4. API calls intercept 401 Unauthorized responses to trigger token refresh or redirect to login.

---

## 5. Performance Optimization

- **Image & Asset Optimization:** Next/Image for WebP conversion and lazy loading.
- **Code Splitting:** Dynamic imports for heavy chart libraries (`next/dynamic`).
- **Caching:** React Query caching for dashboard data to minimize redundant backend calls.
- **Debouncing:** Input fields in the AI chat and data capture forms to reduce API thrashing.

---

## 6. Testing Strategy

- **Unit Testing:** Jest and React Testing Library (RTL) for isolated component and hook logic.
- **End-to-End (E2E):** Cypress or Playwright for critical flows (Login, Complete Profile, Run FNA).
- **Visual Regression:** Chromatic (optional) to ensure UI consistency.

---

## 7. Deployment & DevOps

### 7.1 Version Control
- **Git Flow:** Feature branching (`feat/`, `fix/`, `chore/`) off the `develop` branch.
- **Code Quality:** Pre-commit hooks using Husky (ESLint, Prettier, TypeScript compilation checks).

### 7.2 Environment Variables
Required `.env.local` configuration:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.momentum-fna.com/v1
NEXT_PUBLIC_AI_ASSISTANT_ENABLED=true
NEXT_PUBLIC_ENVIRONMENT=production
```

### 7.3 Deployment Procedure
- **Platform:** Vercel, AWS Amplify, or Dockerized on AWS ECS (aligning with backend cloud).
- **CI/CD:** GitHub Actions pipeline to run tests, build the Next.js app, and deploy to staging/production automatically on branch merges.