# Momentum FNA - AI Financial Advisor Platform

This is the frontend application for the Momentum-Aligned AI Financial Advisor Platform. It is a React Native (Expo) application designed for mobile-first interaction to capture client data, run financial needs analyses (FNA), and facilitate communication between clients, advisers, and the AI assistant.

## Features

- **Authentication System:** Secure login, registration, and role-based access.
- **Client Profiling & Data Capture:** Multi-step wizards for personal and financial information.
- **Financial Analysis Dashboards:** Visual representations of budget health, emergency funds, life cover needs, and retirement projections.
- **AI Financial Assistant Integration:** Interactive chat interface for AI-driven financial education.

## Technology Stack

- **Framework:** React Native / Expo
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State Management:** Zustand
- **Network / API:** Axios
- **Testing:** Jest + React Native Testing Library
- **Code Quality:** ESLint + Prettier

## Project Structure

\`\`\`
├── assets/ # Images, icons, and fonts
├── docs/ # Project specification and architecture documents
├── src/  
│ ├── components/ # Reusable UI components (Buttons, Inputs, Cards)
│ ├── screens/ # Screen components mapping to routes
│ ├── navigation/ # React Navigation stacks and tabs configuration
│ ├── services/ # API clients and external service integrations
│ ├── store/ # Zustand global state management
│ ├── utils/ # Helper functions and responsive design utilities
│ ├── types/ # TypeScript interface definitions
│ ├── constants/ # App-wide constants (colors, typography, endpoints)
│ └── hooks/ # Custom React hooks
├── **tests**/ # Jest unit and component tests
├── .github/workflows/ # CI/CD pipeline definitions
├── App.tsx # Application entry point
└── package.json # Dependencies and scripts
\`\`\`

## Getting Started

### Prerequisites

- Node.js (>= 18.x)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator (Android Studio)

### Installation

1. Clone the repository and navigate to the project root:
   \`\`\`bash
   cd fna-funnel-frontend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

3. Start the Expo development server:
   \`\`\`bash
   npm start
   \`\`\`

4. Press `i` to open the iOS simulator, `a` to open the Android emulator, or scan the QR code with the Expo Go app on your physical device.

## Available Scripts

- \`npm start\`: Starts the Expo Metro bundler.
- \`npm run android\`: Starts the app on an Android emulator/device.
- \`npm run ios\`: Starts the app on an iOS simulator (macOS only).
- \`npm run web\`: Starts the app in a web browser.
- \`npm run lint\`: Runs ESLint to identify code quality issues.
- \`npm run format\`: Runs Prettier to format the codebase.
- \`npm run test\`: Runs the Jest test suite.

## Development Guidelines

1. **Clean Architecture:** Keep components presentation-focused. Move business logic to custom hooks or the Zustand store.
2. **Type Safety:** Always define TypeScript interfaces for props, state, and API responses in the `src/types/` directory.
3. **Styling:** Use `StyleSheet.create` for component styles. Reference global colors and typography from `src/constants/theme.ts`.
4. **Testing:** Write unit tests for all reusable components and utility functions in the `__tests__/` directory.

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/main.yml`) that automatically runs linting and testing on all pull requests and pushes to the `main` and `develop` branches.

## Next Steps for Feature Implementation

1. **Authentication Screens:** Implement Login, Registration, and OTP screens.
2. **Navigation Flow:** Expand `App.tsx` with Stack and Tab navigators for authenticated vs. unauthenticated flows.
3. **API Integration:** Connect the Axios `apiClient.ts` to the backend REST API endpoints.
4. **Component Library:** Build out the remaining atomic UI components (Inputs, Modals, Charts).
