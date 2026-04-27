# Backend Architecture & Specification

**Project:** AI Financial Advisor Platform (Momentum-Aligned)

This document outlines the server-side architecture, core business logic, API contracts, and infrastructure. For client-side rendering and UI specifications, please refer to the `frontend-specification.md`.

---

## 1. Technology Stack & Architecture

### 1.1 Server-Side Technologies

- **Framework:** Java / Spring Boot 3.x
- **Database:** PostgreSQL (Relational persistence)
- **Data Access:** Spring Data JPA / Hibernate
- **Database Migrations:** Flyway or Liquibase
- **Security:** Spring Security, JWT (JSON Web Tokens), OAuth2
- **AI Integration:** Spring AI / NotebookLM LLM API
- **Reporting:** JasperReports or PDFBox (for PDF generation)

### 1.2 Backend Architecture

- **Pattern:** Modular Monolith (prepared for microservices transition if scale demands).
- **Layers:** Controller (API), Service (Business Logic), Repository (Data Access).
- **Global Exception Handling:** `@ControllerAdvice` ensuring standardized JSON error responses.

---

## 2. Core Services & Business Logic

### 2.1 Financial Needs Analysis (FNA) Engine

- **Calculations:**
  - Emergency Fund (3-6x expenses)
  - Life Cover (Human Life Value model: `(Income x Years to Ret) + Debt + Education`)
  - Disability Cover (60-75% income replacement)

### 2.2 Budget & Retirement Engines

- **Budget Service:** Aggregates inputs, calculates monthly surplus, savings rate, and health score.
- **Retirement Service:** Projects capital using assumptions (Inflation, Investment return) and calculates the Income Replacement Ratio.

### 2.3 AI Financial Assistant Service

- Proxies requests to NotebookLM LLM API.
- Injects system prompts to enforce constraints (e.g., "Do not recommend specific financial products").
- Logs all interactions to the Compliance & Audit System.

---

## 3. Database Schema & Data Models

### 3.1 Core Entities (JPA)

- `User`: id, email, password_hash, role, status.
- `ClientProfile`: user_id, dob, id_number, marital_status, employment_status.
- `FinancialData`: profile_id, assets_json, liabilities_json, monthly_income, monthly_expenses.
- `AuditLog`: id, user_id, action_type, timestamp, metadata.
- `SystemAssumptions`: id, inflation_rate, default_return_rate.

### 3.2 Shared Data Models (DTOs)

To maintain parity with the frontend interfaces:

```java
public class FinancialDataDTO {
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private List<AssetDTO> assets;
    private List<LiabilityDTO> liabilities;
}
```

---

## 4. Security & Compliance

### 4.1 Authentication & Authorization

- **JWT Strategy:** Tokens signed using RS256/HS256. Issued upon successful login.
- **Role-Based Access Control (RBAC):**
  - `ROLE_CLIENT`: Can read/write own data.
  - `ROLE_ADVISER`: Can read assigned clients, generate reports.
  - `ROLE_ADMIN`: Can manage platform assumptions and users.

### 4.2 Compliance & Audit

- All data modifications and AI queries trigger an async event logged into the `AuditLog` table.
- **Retention:** Database backups and audit logs retained securely for a minimum of 5 years to meet regulatory requirements.

---

## 5. Integration Points & API Contracts

### 5.1 Communication Protocols

- **API Standard:** RESTful JSON APIs.
- **Documentation:** Swagger/OpenAPI 3.0 exposed at `/api-docs` and `/swagger-ui.html`.

### 5.2 Key Endpoints

- `POST /api/v1/auth/register` - User onboarding.
- `POST /api/v1/auth/login` - Returns HttpOnly cookie with JWT.
- `GET /api/v1/profile/{clientId}` - Fetches user data (integrates with frontend state).
- `POST /api/v1/fna/calculate` - Triggers the FNA Engine calculations.
- `POST /api/v1/ai/chat` - Synchronous endpoint for AI assistant interaction.

---

## 6. Testing Strategy

- **Unit Testing:** JUnit 5 + Mockito for testing core engine calculations (e.g., Retirement math) without DB context.
- **Integration Testing:** Spring Boot Test + Testcontainers (PostgreSQL) to validate repository layer and API endpoints.
- **Security Testing:** MockMvc to verify RBAC and JWT validation rules.

---

## 7. Deployment & Infrastructure

### 7.1 Version Control

- **Git Flow:** Feature branching off `develop`. Main branch protected and strictly mirrors production.

### 7.2 Environment Variables

Required `.env` / `application.yml` configuration:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
    username: ${DB_USER}
    password: ${DB_PASS}
jwt:
  secret: ${JWT_SECRET_KEY}
  expiration: 86400000
ai:
  llm:
    api-key: ${NOTEBOOKLM_API_KEY}
```

### 7.3 Deployment Procedure

- **Containerization:** Multi-stage `Dockerfile` creating a lightweight JRE image.
- **CI/CD:** GitHub Actions to run tests, build the `.jar`, create the Docker image, and push to a Container Registry.
- **Infrastructure:** Deployed to AWS (ECS/EKS), GCP (Cloud Run/GKE), or Azure using Infrastructure as Code (Terraform/CloudFormation). NGINX/API Gateway handles SSL termination and routing to the frontend/backend.
