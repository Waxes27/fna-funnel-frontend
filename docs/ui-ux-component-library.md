# UI/UX Component Library Specification

## 1. Overview
This document defines the UI/UX Component Library for the AI Financial Advisor Platform (Momentum-Aligned). It outlines the design tokens, component specifications (props, state, and responsive behavior), and ensures strict adherence to the **Momentum design system** and **WCAG 2.1 AA accessibility standards**.

### 1.1 Core Principles
- **Mobile-First & Responsive:** Graceful scaling from mobile (320px) to ultra-wide desktop displays.
- **Accessibility (WCAG 2.1 AA):** Minimum 4.5:1 contrast ratios for text, 3:1 for UI components. Comprehensive ARIA attributes, keyboard navigability, and screen reader support.
- **Progressive Disclosure:** Complex financial forms are broken into digestible, mobile-first onboarding steps with persistent progress feedback.
- **Component Architecture:** Built with React Native primitives and theme tokens, using shared foundation components (`Screen`, `Surface`, `Typography`, `Input`, `Button`) plus onboarding-specific composition helpers.

---

## 2. Design Tokens (Momentum Theme)

### 2.1 Color Palette
*   **Implementation Source:** All production colors come from the shared React Native theme object rather than hard-coded per-screen values.
*   **Primary:** Ink-led Momentum palette for primary actions, progress fills, and highlighted onboarding moments.
*   **Secondary:** Signal orange accents for consent, status emphasis, and actionable highlights.
*   **Background & Surface:** Canvas, `surface`, and `surfaceRaised` tokens differentiate full-screen layouts from elevated cards and summary rows.
*   **Text:** `text` and `textSecondary` tokens preserve hierarchy for headings, body copy, helper text, and status labels.

### 2.2 Typography
*   **Font Family:** Primary Sans-Serif (e.g., Inter or Momentum brand font).
*   **Scale:** Base 16px (1rem). H1 (2.5rem), H2 (2rem), H3 (1.75rem), Body (1rem), Small (0.875rem).
*   **Weights:** Regular (400), Medium (500), Bold (700).

### 2.3 Responsive Tiers
*   **Mobile (Default):** `< 768px`
*   **Tablet (`md`):** `768px - 1023px`
*   **Desktop (`lg`):** `1024px - 1279px`
*   **Large Desktop (`xl`):** `1280px+`

---

## 3. Core Components (Atoms & Molecules)

### 3.1 Button (`<Button />`)
Primary interactive element for submitting forms, triggering modals, and navigation.

*   **Props:**
    *   `variant` (enum: `'primary' | 'secondary' | 'outline' | 'consent'`)
    *   `isLoading` (boolean) - Replaces text with a spinner and disables interaction.
    *   `disabled` (boolean)
    *   `style` / `textStyle` for token-safe layout customization
*   **State Management:** Local UI state only (hover, focus, active).
*   **Responsive Behavior:** Full-width CTA treatment on onboarding screens with a minimum touch target enforced by the shared layout token set.
*   **Accessibility:** Pressable semantics and high-contrast label styles are preserved across primary, secondary, outline, and consent states.

### 3.2 Input Field (`<Input />`)
Wraps the shared React Native input primitive to handle text, passwords, and numeric financial inputs.

*   **Props:**
    *   `label` (string) - Required for accessibility.
    *   `type` (enum: `'text' | 'number' | 'email' | 'password' | 'currency'`)
    *   `error` (string) - Error message from React Hook Form.
    *   `helperText` (string)
    *   `required` (boolean)
*   **State Management:** Used both with React Hook Form + Zod and with lightweight Zustand-backed draft updates for onboarding steps.
*   **Responsive Behavior:** Stacks vertically inside `OnboardingCard` containers and keeps spacing consistent through theme tokens.
*   **Accessibility:** Provides explicit labels, error copy, and mobile-friendly input modes for phone, email, and numeric fields.

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

### 4.1 Onboarding Wizard (`<OnboardingShell />`)
Implements progressive disclosure for the mobile-first client setup flow.

*   **Props:**
    *   `step` and `totalSteps` for numbered progress
    *   `children` for screen-specific content
    *   optional `contentContainerStyle` for safe token-based layout adjustments
*   **State Management:** 
    *   **Zustand (`useAppStore`)** tracks `onboardingStep`, `isOnboardingComplete`, and the shared `profileDraft` used across all onboarding screens.
*   **Responsive Behavior:**
    *   **Mobile:** Uses scrollable single-column layouts, persistent "Step X of Y" feedback, and bottom action bars sized for thumb reach.
    *   **Tablet/Desktop:** Reuses the same shell while allowing cards and content stacks to breathe with larger spacing tokens.
*   **Accessibility:** Progress remains visible at the top of each step, actions stay grouped in a predictable action bar, and each screen keeps one primary task in focus.

### 4.2 Onboarding Card Set
The onboarding flow standardizes screen composition through reusable helpers.

*   **`<OnboardingHeader />`:** Renders eyebrow, title, and description with consistent type hierarchy.
*   **`<OnboardingCard />`:** Wraps elevated step content in a themed `Surface`.
*   **`<OnboardingActionBar />`:** Aligns primary and secondary CTAs, loading states, and consent-style actions.
*   **`<OnboardingProgress />`:** Displays the current step count and progress bar using theme colors and radii.

### 4.3 Financial Chart Container (`<FinancialChart />`)
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

### 4.4 AI Financial Assistant Chat (`<AIChatInterface />`)
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

### 4.5 Data Grid / Table (`<DataTable />`)
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
*   `useAppStore`: Manages auth state, onboarding progress, setup completion, and the shared onboarding draft.
*   `profileDraft`: Stores goals, personal details, financial snapshot values, risk comfort, consent, notification preference, and account connection choice.
*   `onboardingStep`: Drives resume behavior so the router can reopen the flow at the next incomplete screen.

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
