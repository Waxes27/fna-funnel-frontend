# Auth Context Management

## Keycloak
* Token Endpoint: :8081/realms/fna-momentum/protocol/openid-connect/token
``` json
{
    "access_token": "",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "",
    "token_type": "Bearer",
    "id_token": "",
    "not-before-policy": 0,
    "session_state": "1a2f017d-c153-40e5-b12d-15b5ca664c8d",
    "scope": "openid email profile"
}
```

## API Backend
* Endpoint: :8080/api/v1/auth/me
``` json
{
    "token": null,
    "type": "Bearer",
    "id": "5fa939c9-149c-4478-be23-f50d773d5a31",
    "email": "nceba.dumasi@gmail.com",
    "role": "ROLE_CLIENT"
}
```

### Auth Session Fields to store
``` json
{
    "access_token": "",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "",
    "token_type": "Bearer",
    "id_token": "",
    "not-before-policy": 0,
    "session_state": "1a2f017d-c153-40e5-b12d-15b5ca664c8d",
    "scope": "openid email profile",
    "id": "5fa939c9-149c-4478-be23-f50d773d5a31",
    "email": "nceba.dumasi@gmail.com",
    "role": "ROLE_CLIENT"
}
```

## Rules

### Auth State Conditions

* Auth Session Filled
    - Access Token is valid
    - Access Token is present
    - id is present
    - email is present
    - role is present

### Redirect Rules

* If Auth Session is not filled, redirect to Keycloak Login Page
* If Auth Session is filled, fetch client information from API Backend

``` java
public class ClientProfileDTO {
    private UUID id;
    private UUID userId;

    private Title title;
    private String firstName;
    private String lastName;
    private String fullName;
    private LocalDate dateOfBirth;
    private String idNumber;
    private Gender gender;
    private MaritalStatus maritalStatus;
    private Integer numberOfDependants;

    private String mobileNumber;
    private String email;
    private ResidentialAddress address;
    private String residentialAddress;

    private String employmentStatus;
    private String occupation;
    private String employer;
    private BigDecimal grossMonthlyIncome;
    private BigDecimal annualIncome;

    private BigDecimal spouseIncome;
    private BigDecimal householdExpenses;
    private SmokerStatus smokerStatus;
    private EducationLevel highestEducationLevel;
    private OnboardingStatus onboardingStatus;
    private OnboardingStep currentOnboardingStep;
    private LocalDateTime emailVerifiedAt;
    private LocalDateTime mobileVerifiedAt;
    private LocalDateTime completedAt;
}
```
* If Client Information is not present, redirect to Onboarding Page
* If Client Information is present, redirect to User Dashboard Page
* If Auth Session is filled, redirect to User Dashboard
