# Full Feature Specification

## AI Financial Advisor Platform (Momentum-Aligned)

### 1. Product Overview

#### 1.1 Purpose

The platform is an AI-assisted digital financial planning system designed to help users:

- Capture their financial information
- Complete a Financial Needs Analysis (FNA)
- Understand financial risks and gaps
- Receive AI-driven financial education
- Prepare for a consultation with a licensed financial adviser

**Important:** The system does NOT provide regulated financial advice automatically. All product recommendations must be reviewed and confirmed by a licensed adviser.

---

### 2. User Types

#### 2.1 Client User

Primary platform user who completes their financial profile.

**Capabilities:**

- Create account
- Complete financial profile
- Run financial analysis
- Interact with AI assistant
- View financial reports
- Book consultation

#### 2.2 Financial Adviser

Licensed adviser managing client accounts.

**Capabilities:**

- View client profiles
- Review financial analysis
- Edit assumptions
- Prepare advice
- Export reports

#### 2.3 System Administrator

Platform management user.

**Capabilities:**

- Manage platform settings
- Update financial assumptions
- Manage users
- Monitor analytics

---

### 3. Core Platform Modules

The platform consists of the following core systems:

1. Authentication System
2. Client Profile Engine
3. Financial Data Capture System
4. Financial Needs Analysis Engine
5. Budget Analysis Engine
6. Retirement Projection Engine
7. Insurance Needs Analysis
8. Estate Planning Analysis
9. Risk Profiling System
10. AI Financial Assistant
11. Scenario Simulation Engine
12. Reporting Engine
13. Adviser Dashboard
14. Compliance & Audit System
15. Notification System

---

### 4. Authentication System

#### 4.1 Account Registration

**Inputs:** First name, Last name, Email, Password, Mobile number
**Process:** Email verification, SMS OTP verification
**Outputs:** Verified user account
**Business Rules:** Email must be unique, Password minimum 8 characters

#### 4.2 Login

**Inputs:** Email, Password
**Optional:** Two-factor authentication
**Outputs:** Authenticated session token

#### 4.3 Password Recovery

**Process:** Email reset link
**Rules:** Token expiry 15 minutes

---

### 5. Client Profile Engine

#### 5.1 Personal Information

**Fields:** Full name, Date of birth, ID / Passport number, Marital status, Number of dependants

#### 5.2 Contact Information

**Fields:** Mobile number, Email, Residential address

#### 5.3 Employment Information

**Fields:** Employment status, Occupation, Employer, Annual income

#### 5.4 Household Information

**Fields:** Spouse income, Household expenses

---

### 6. Financial Data Capture System

#### 6.1 Assets

**Fields:** Property value, Retirement funds, Investments, Savings accounts, Business ownership

#### 6.2 Liabilities

**Fields:** Home loan balance, Vehicle finance, Credit cards, Personal loans

#### 6.3 Income Sources

**Fields:** Salary, Business income, Rental income, Other income

#### 6.4 Monthly Expenses

**Categories:** Housing, Utilities, Food, Transport, Insurance, School fees, Debt repayments

---

### 7. Budget Analysis Engine

**Inputs:** Monthly income, Monthly expenses
**Calculations:** Total Income, Total Expenses, Monthly Surplus, Savings Rate
**Outputs:** Budget health score, Expense breakdown chart

---

### 8. Financial Needs Analysis Engine

The FNA Engine evaluates a user's financial protection and investment gaps.

#### 8.1 Emergency Fund Analysis

**Calculation:** Recommended Reserve = 3–6 Months Expenses
**Gap:** Required Reserve − Current Savings

#### 8.2 Life Cover Analysis

**Inputs:** Annual income, Number of dependants, Outstanding debt
**Calculation Model:** Human Life Value Model
**Life Cover Need:** (Annual Income × Years to Retirement) + Debt + Education Funding

#### 8.3 Disability Cover

**Recommended:** 60–75% of income replacement

#### 8.4 Income Protection

**Calculation:** Monthly income protection requirement

#### 8.5 Education Planning

**Inputs:** Number of children, Current age
**Outputs:** Projected tertiary education costs

---

### 9. Retirement Projection Engine

**Inputs:** Current age, Retirement age, Current retirement savings, Monthly contributions
**Assumptions:** Inflation, Investment return
**Calculations:** Projected Retirement Capital, Income Replacement Ratio
**Outputs:** Retirement readiness score, Capital shortfall

---

### 10. Estate Planning Analysis

**Inputs:** Total assets, Total liabilities
**Calculations:** Estate Value, Executor Fees Estimate, Estate Duty Estimate
**Risk Flags:** No will, Estate liquidity shortage

---

### 11. Risk Profiling System

**Questionnaire:** 10–15 behavioural investment questions
**Scoring Output:** Conservative, Moderate, Balanced, Growth, Aggressive
_(The score influences investment projections.)_

---

### 12. AI Financial Assistant

**Purpose:** Conversational interface helping users understand financial concepts.
**Capabilities:** Answer finance questions, Explain financial results, Guide users through FNA
**Restrictions:** Cannot recommend specific financial products, Must suggest consultation with adviser

---

### 13. Scenario Simulation Engine

Users can simulate changes including:

- Increasing savings
- Changing retirement age
- Adding income
- Adjusting investment return

**Outputs:** Updated retirement projections, Interactive graphs

---

### 14. Reporting Engine

**Reports Generated:**

- **Client Financial Health Report:** Includes Budget analysis, Risk profile, Insurance gaps, Retirement readiness
- **Adviser Report:** Includes Full financial fact-find, All calculations

**Export Options:** PDF, Download report

---

### 15. Adviser Dashboard

**Features:**

- **Client Overview:** Displays Financial health score, Risk profile, Key alerts
- **Client File:** Profile data, Financial analysis, Documents
- **Advice Preparation:** Editable assumptions, Notes

---

### 16. Compliance & Audit System

**The system must record:** Client consent, Data edits, AI interactions, Adviser adjustments
**Retention Period:** Minimum 5 years

---

### 17. Notification System

**User Notifications:** Incomplete profile, Financial risks detected
**Adviser Notifications:** New client registered, FNA completed
**Delivery Channels:** Email, In-app notification

---

### 18. Admin Panel

**Capabilities:** Manage users, Adjust financial assumptions, Monitor platform analytics
**Adjustable Variables:** Inflation, Investment return assumptions, Life expectancy

---

### 19. MVP Feature List

The Minimum Viable Product must include:

- User registration
- Client financial profile
- Financial data capture
- Budget analysis
- Financial needs analysis
- Retirement projection
- Risk profile questionnaire
- AI assistant
- Adviser dashboard
- PDF reporting

---

### 20. Recommended Technology Stack

- **Frontend:** React or Next.js
- **Backend: **Spring Boot
- **Database:** PostgreSQL
- **AI Layer:** LLM API integration (NotebookLM)
- **Cloud Infrastructure:** AWS / Azure / GCP
- **Security:** OAuth authentication, Encrypted storage
