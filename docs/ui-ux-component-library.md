# UI/UX Component Library Specification

## 1. Overview
This document defines the UI/UX Component Library for the AI Financial Advisor Platform (Momentum-Aligned). It outlines the design tokens, component specifications (props, state, and responsive behavior), and ensures strict adherence to the **Momentum design system** and **WCAG 2.1 AA accessibility standards**.

### 1.1 Core Principles
- **Mobile-First & Responsive:** Graceful scaling from mobile (320px) to ultra-wide desktop displays.
- **Accessibility (WCAG 2.1 AA):** Minimum 4.5:1 contrast ratios for text, 3:1 for UI components. Comprehensive ARIA attributes, keyboard navigability, and screen reader support.
- **Progressive Disclosure:** Complex financial forms are broken into digestible multi-step wizards to minimize cognitive load.
- **Component Architecture:** Built using React Native/Next.js with Tailwind CSS and Radix UI primitives for accessible, unstyled structural foundations.

---

## 2. Design Tokens (Momentum Theme)

### 2.1 Color Palette
*   **Primary:** `#005eb8` (Momentum Blue) - Used for primary actions, links, and active states.
*   **Secondary:** `#e35205` (Momentum Orange) - Used for highlights, warnings, and secondary CTAs.
*   **Background:** `#f8fafc` (Slate 50) - App background.
*   **Surface:** `#ffffff` (White) - Card and modal backgrounds.
*   **Text (Primary):** `#0f172a` (Slate 900) - High contrast body text.
*   **Text (Secondary):** `#475569` (Slate 600) - Helper text and labels.
*   **Success:** `#16a34a` (Green 600) - Positive financial indicators.
*   **Error:** `#dc2626` (Red 600) - Form errors, financial alerts.

### 2.2 Typography
*   **Font Family:** Primary Sans-Serif (e.g., Inter or Momentum brand font).
*   **Scale:** Base 16px (1rem). H1 (2.5rem), H2 (2rem), H3 (1.75rem), Body (1rem), Small (0.875rem).
*   **Weights:** Regular (400), Medium (500), Bold (700).

### 2.3 Breakpoints (Tailwind Defaults)
*   **Mobile (Default):** `< 768px`
*   **Tablet (`md`):** `768px - 1023px`
*   **Desktop (`lg`):** `1024px - 1279px`
*   **Large Desktop (`xl`):** `1280px+`

---

## 3. Core Components (Atoms & Molecules)

### 3.1 Button (`<Button />`)
Primary interactive element for submitting forms, triggering modals, and navigation.

*   **Props:**
    *   `variant` (enum: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`)
    *   `size` (enum: `'sm' | 'md' | 'lg'`)
    *   `isLoading` (boolean) - Replaces text with a spinner and disables interaction.
    *   `disabled` (boolean)
    *   `leftIcon` / `rightIcon` (ReactNode)
    *   `ariaLabel` (string) - Required if button contains only an icon.
*   **State Management:** Local UI state only (hover, focus, active).
*   **Responsive Behavior:** Full-width on mobile viewports; inline-block with defined padding on tablet/desktop. Minimum touch target of 44x44px enforced on mobile.
*   **Accessibility:** Focus rings visible on keyboard navigation (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`).

### 3.2 Input Field (`<InputField />`)
Wraps Radix UI form primitives to handle text, passwords, and numeric financial inputs.

*   **Props:**
    *   `label` (string) - Required for accessibility.
    *   `type` (enum: `'text' | 'number' | 'email' | 'password' | 'currency'`)
    *   `error` (string) - Error message from React Hook Form.
    *   `helperText` (string)
    *   `required` (boolean)
*   **State Management:** Controlled via React Hook Form + Zod validation.
*   **Responsive Behavior:** Stacks vertically. Font size minimum 16px on iOS to prevent auto-zoom on focus.
*   **Accessibility:** Automatically links label to input via `htmlFor`/`id`. Uses `aria-invalid` and `aria-describedby` when `error` is present.

### 3.3 Status Badge (`<Badge />`)
Used for Risk Profile status (e.g., "Aggressive"), Budget Health, and KYC Verification status.

*   **Props:**
    *   `status` (enum: `'success' | 'warning' | 'error' | 'info' | 'neutral'`)
    *   `label` (string)
*   **Responsive Behavior:** Text truncates with ellipsis if container is too small on mobile.

### 3.4 Data Card (`<Card />`)
Container for financial summaries, adviser dashboard items, and platform analytics.

*   **Props:**
    *   `title` (string)
    *   `subtitle` (string)
    *   `footerActions` (ReactNode)
*   **Responsive Behavior:** 
    *   **Mobile:** 100% width, minimal padding (16px).
    *   **Tablet/Desktop:** Grid layout (`grid-cols-2` or `grid-cols-3`), increased padding (24px).

---

## 4. Complex Components (Organisms)

### 4.1 Multi-Step Wizard (`<DataCaptureWizard />`)
Implements progressive disclosure for the Financial Data Capture System (Assets, Liabilities, Income, Expenses).

*   **Props:**
    *   `steps` (Array<{ id: string, label: string, component: ReactNode }>)
    *   `onComplete` (function) - Callback when the final step is submitted.
*   **State Management:** 
    *   **Zustand Store (`useWizardStore`)**: Tracks `currentStepIndex`, `furthestStepReached`, and aggregates form data (`draftFinancialData`) across steps before final submission.
*   **Responsive Behavior:**
    *   **Mobile:** Shows a horizontal progress bar or "Step X of Y" text to save vertical space.
    *   **Desktop:** Displays a vertical or horizontal stepper with full step labels (e.g., "1. Personal -> 2. Assets -> 3. Liabilities").
*   **Accessibility:** Focus shifts to the top of the new step container upon navigation. Uses `aria-current="step"` for the active step indicator.

### 4.2 Financial Chart Container (`<FinancialChart />`)
Wraps Recharts/Chart.js for Budget Analysis (Pie) and Retirement Projections (Line).

*   **Props:**
    *   `type` (enum: `'pie' | 'line' | 'bar'`)
    *   `data` (Array<Object>) - Raw financial data.
    *   `xAxisKey` / `yAxisKey` (string)
    *   `tooltipFormatter` (function) - Formats currency values.
*   **State Management:** Local state for active chart tooltips or toggled legend items.
*   **Responsive Behavior:**
    *   **Mobile:** Charts are scrollable horizontally if data density is high. Legends are moved below the chart.
    *   **Desktop:** Legends positioned to the right. Interactive hover states reveal precise data points.
*   **Accessibility:** Includes a visually hidden data table (`<table className="sr-only">`) containing the chart's raw data for screen readers.

### 4.3 AI Financial Assistant Chat (`<AIChatInterface />`)
Conversational UI for interacting with the NotebookLM-powered AI.

*   **Props:**
    *   `isTyping` (boolean) - Triggers typing indicator bubble.
    *   `messages` (Array<{ role: 'user' | 'assistant' | 'system', content: string }>)
    *   `onSendMessage` (function)
    *   `suggestedPrompts` (Array<string>)
*   **State Management:** 
    *   **Zustand (`useChatStore`)**: Manages the message history array, connection status (WebSockets/SSE), and streaming chunks.
*   **Responsive Behavior:**
    *   **Mobile:** Full-screen modal or dedicated tab route. Input sticks to the bottom (`safe-area-inset-bottom`).
    *   **Desktop:** Collapsible floating widget in the bottom-right corner or a persistent right-hand sidebar in the Client Portal.
*   **Accessibility:** 
    *   `aria-live="polite"` on the message container to announce new AI responses.
    *   Markdown is safely parsed and rendered with semantic HTML tags.

### 4.4 Data Grid / Table (`<DataTable />`)
Used in the Adviser Dashboard to view client lists and the Admin Panel for system variables.

*   **Props:**
    *   `columns` (Array<ColumnDef>)
    *   `data` (Array<Object>)
    *   `onRowClick` (function)
    *   `pagination` (Object) - { page, pageSize, total }
    *   `sortable` (boolean)
*   **State Management:** Managed via React Query (server-side sorting/pagination) or local state for small datasets.
*   **Responsive Behavior:**
    *   **Mobile:** Transforms from a traditional table into a stacked card layout (each row becomes a Card).
    *   **Tablet/Desktop:** Standard horizontal table with sticky headers and horizontal scrolling if columns exceed viewport width.
*   **Accessibility:** Implements `role="grid"`, `aria-sort` on headers, and keyboard navigation between cells.

---

## 5. Form & State Management Architecture

### 5.1 Global State (Zustand)
Zustand is utilized for cross-component state that doesn't require backend synchronization.
*   `useAppStore`: Manages UI toggles (sidebar state, theme, global modals).
*   `useAuthStore`: Manages JWT presence, decoded user role (`CLIENT`, `ADVISER`, `ADMIN`), and session expiry.
*   `useFNAStore`: Holds the draft state of the Financial Needs Analysis before final submission.

### 5.2 Server State (React Query)
React Query handles all API interactions, caching, and background synchronization.
*   `useQuery(['clientProfile', id])`: Fetches and caches client data.
*   `useMutation`: Used for saving form steps and generating reports. Handles loading states mapped directly to `<Button isLoading />`.

### 5.3 Form Management
*   **React Hook Form:** Handles field registration, touched states, and performance (uncontrolled inputs).
*   **Zod:** Schema validation mirroring backend Spring Boot DTOs (e.g., ensuring `monthlyIncome` is a positive number).

---

## 6. Accessibility (A11y) Checklist
To maintain WCAG 2.1 AA compliance across all components:
- [ ] **Color Contrast:** Run all primary/secondary color combinations through a contrast checker against the background.
- [ ] **Focus Management:** Ensure modals (like the AI Chat or "Edit Assumptions" modal) trap focus while open and return focus to the trigger button when closed.
- [ ] **Keyboard Navigation:** All interactive elements must be reachable via the `Tab` key.
- [ ] **Semantic HTML:** Use `<nav>`, `<main>`, `<aside>`, `<header>`, and `<footer>` appropriately in the layout templates.
- [ ] **Error Identification:** Form errors must be described in text and associated with the input using `aria-describedby`. Red color alone is not sufficient for error states.