# System Analysis Document
**Project:** AI Financial Advisor Platform (Momentum-Aligned)

## 1. Functional Requirements

### 1.1 Authentication & User Management
- **Registration:** Capture user details (First name, Last name, Email, Password, Mobile), perform Email and SMS OTP verification.
- **Login:** Authenticate via Email and Password, with optional Two-Factor Authentication (2FA).
- **Password Recovery:** Email reset link with a 15-minute token expiry.
- **Role-Based Access Control (RBAC):** Restrict capabilities based on User Roles (Client, Adviser, Admin).

### 1.2 Client Profiling & Data Capture
- **Personal & Contact Info:** Capture Full name, DOB, ID/Passport, marital status, dependants, mobile, email, and address.
- **Employment & Household Info:** Capture employment status, occupation, employer, annual income, spouse income, and household expenses.
- **Financial Data:** Capture Assets (Property, Retirement, Investments, Savings, Business), Liabilities (Home loan, Vehicle, Credit cards, Personal loans), Income sources, and Monthly expenses breakdown.

### 1.3 Core Calculation Engines (FNA)
- **Budget Analysis:** Calculate Total Income, Total Expenses, Monthly Surplus, and Savings Rate to output a budget health score.
- **Emergency Fund Analysis:** Calculate gap based on a recommended reserve of 3–6 months' expenses.
- **Life Cover Analysis:** Calculate required life cover using the Human Life Value Model.
- **Disability & Income Protection:** Calculate recommended 60–75% income replacement.
- **Education Planning:** Project tertiary education costs based on children's ages.
- **Retirement Projection:** Project retirement capital and Income Replacement Ratio using inflation and investment return assumptions.
- **Estate Planning Analysis:** Calculate Estate Value, estimate Executor Fees and Estate Duty, and flag risks (e.g., liquidity shortage, no will).

### 1.4 Interactive & Value-Added Features
- **Risk Profiling System:** 10–15 behavioral questions to categorize users (Conservative to Aggressive).
- **Scenario Simulation:** Allow users to adjust savings, retirement age, income, and returns to see updated interactive projections.
- **AI Financial Assistant:** Conversational interface to answer finance questions, explain results, and guide through FNA.
- **Reporting Engine:** Generate downloadable PDF reports (Client Financial Health Report and Adviser Report).
- **Adviser Dashboard:** View client overviews, review financial analyses, edit assumptions, and prepare advice.
- **Admin Panel:** Manage users, platform analytics, and global financial assumptions (e.g., inflation, default returns).

### 1.5 System & Compliance Operations
- **Compliance & Audit:** Record client consent, data edits, AI interactions, and adviser adjustments.
- **Notification System:** Send email and in-app alerts for incomplete profiles, financial risks, new registrations, and FNA completions.

---

## 2. Technical Constraints

### 2.1 Backend Architecture
- **Framework:** Java / Spring Boot 3.x (Modular Monolith pattern).
- **Database:** PostgreSQL for relational persistence.
- **Data Access & Migrations:** Spring Data JPA / Hibernate, managed via Flyway or Liquibase.
- **Security:** Spring Security with JWT (RS256/HS256) and OAuth2.
- **Global Exception Handling:** `@ControllerAdvice` for standardized JSON error responses.

### 2.2 Frontend Architecture
- **Framework:** React or Next.js.
- **Communication Standard:** RESTful JSON APIs (documented via Swagger/OpenAPI 3.0).

### 2.3 Integration & External Services
- **AI Integration:** Proxy requests to NotebookLM LLM API (with strict prompt injection).
- **Reporting:** PDF generation using JasperReports or PDFBox.
- **Deployment & Cloud:** Dockerized multi-stage containerization, CI/CD via GitHub Actions, deployed to AWS/GCP/Azure using Infrastructure as Code (Terraform/CloudFormation).
- **Networking:** NGINX or API Gateway for SSL termination and routing.

### 2.4 Compliance & Data Retention
- **Audit Logs:** All data modifications and AI queries must trigger asynchronous events to an `AuditLog` table.
- **Data Retention:** Database backups and audit logs must be securely retained for a minimum of 5 years.
- **Regulatory Restriction:** The system/AI cannot recommend specific financial products; all advice must suggest consultation with a licensed adviser.

### 2.5 Testing Standards
- **Unit Testing:** JUnit 5 + Mockito for core calculations.
- **Integration Testing:** Spring Boot Test + Testcontainers (PostgreSQL).
- **Security Testing:** MockMvc for RBAC and JWT validation.

---

## 3. User Roles

### 3.1 Client User (`ROLE_CLIENT`)
- **Description:** The primary platform user who completes their financial profile.
- **Permissions:** Read and write access to their own data.
- **Capabilities:** Create an account, capture financial profile and data, run financial analyses, interact with the AI assistant, view reports, and book consultations.

### 3.2 Financial Adviser (`ROLE_ADVISER`)
- **Description:** Licensed professional managing client accounts and providing regulated advice.
- **Permissions:** Read access to assigned clients' data, write access to adviser-specific assumptions and reports.
- **Capabilities:** View client overviews, review financial analyses, edit financial assumptions for projections, prepare advice, and export detailed reports.

### 3.3 System Administrator (`ROLE_ADMIN`)
- **Description:** Platform management user.
- **Permissions:** Global read/write access to platform configurations and user management.
- **Capabilities:** Manage platform settings, adjust global financial assumptions (e.g., inflation rate, life expectancy), manage user access, and monitor platform analytics.

---

## 4. Business Logic Rules

### 4.1 Financial Needs Analysis (FNA) Calculations
- **Emergency Fund:** `Recommended Reserve = Monthly Expenses × (3 to 6)`
- **Life Cover Need (Human Life Value Model):** `(Annual Income × Years to Retirement) + Outstanding Debt + Education Funding`
- **Disability Cover:** `Recommended Coverage = 60% to 75% of Current Income`
- **Budget Health:** `Monthly Surplus = Total Income - Total Expenses`. Savings rate impacts the overall Budget Health Score.

### 4.2 Retirement Engine
- **Projections:** Compound current savings and monthly contributions over `(Retirement Age - Current Age)` years.
- **Growth Variables:** Factored against system/adviser-defined `Inflation Rate` and `Investment Return Rate`.
- **Outcome Metric:** `Income Replacement Ratio = Projected Monthly Retirement Income / Current Monthly Income`.

### 4.3 Estate Planning
- **Estate Value:** `Total Assets - Total Liabilities`.
- **Costs Estimation:** Calculate estimated Executor Fees and Estate Duty based on the Estate Value.
- **Risk Flagging:** Trigger alerts if the user lacks a valid will or if there is an estate liquidity shortage.

### 4.4 Risk Profiling
- **Scoring System:** Map questionnaire responses to a numerical score.
- **Risk Categories:** Categorize into Conservative, Moderate, Balanced, Growth, or Aggressive. This classification subsequently dictates the default investment return assumptions used in the Scenario Simulation and Retirement Engines.

### 4.5 AI Assistant Guardrails
- **Prompt Injection:** All AI requests must have an injected system prompt explicitly restricting the recommendation of specific financial products and enforcing the guidance to consult a licensed adviser.