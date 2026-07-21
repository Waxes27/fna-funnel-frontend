# Profile Redesign
Aggressively redesign the profile layout to improve user experience. Ensure we keep the financial verbiage in the layout.


# Profile Layout Screenshot Template

## Screenshot Location
- `Flows\Profile\Cosmos iOS 87.png`

## Tabs
- [ ] Personal
- [ ] Financial

### Personal Tab

``` java
public record ProfileDTO(
        @NotNull @Valid ApplicantProfileDTO primaryApplicant,
        @Valid SpouseProfileDTO spouse
) {

    public record ApplicantProfileDTO(
            @NotNull Title title,
            @NotBlank @Size(max = 100) String firstName,
            @NotBlank @Size(max = 100) String surname,
            @NotBlank @Size(max = 50) @Pattern(
                    regexp = "^(?!0+$)[A-Za-z0-9-]{6,50}$",
                    message = "ID number format is invalid"
            ) String idNumber,
            @NotNull Gender gender,
            @NotNull MaritalStatus maritalStatus,
            @NotBlank @Size(max = 100) String occupation,
            @NotNull @DecimalMin(value = "0.00", inclusive = true, message = "Gross monthly income must be zero or greater") BigDecimal grossMonthlyIncome,
            @NotBlank @Size(max = 10) String incomeCurrency,
            @Email @NotBlank @Size(max = 255) String emailAddress,
            @NotBlank @Size(max = 30) String mobileNumber,
            @NotNull @Valid AddressDTO residentialAddress,
            @NotNull SmokerStatus smokerStatus,
            @NotNull EducationLevel highestEducationLevel
    ) {
    }

    public record SpouseProfileDTO(
            boolean applicable,
            Title title,
            String firstName,
            String surname,
            String idNumber,
            Gender gender,
            MaritalStatus maritalStatus,
            String occupation,
            BigDecimal grossMonthlyIncome,
            String incomeCurrency,
            String emailAddress,
            String mobileNumber,
            @Valid SpouseAddressDTO residentialAddress,
            SmokerStatus smokerStatus,
            EducationLevel highestEducationLevel
    ) {
    }

    public record AddressDTO(
            @NotBlank @Size(max = 255) String addressLine1,
            @Size(max = 255) String addressLine2,
            @NotBlank @Size(max = 100) String suburb,
            @NotBlank @Size(max = 100) String city,
            @NotBlank @Size(max = 100) String province,
            @NotBlank @Size(max = 20) String postalCode,
            @NotBlank @Size(max = 100) String country
    ) {
    }

    public record SpouseAddressDTO(
            boolean sameAsPrimaryApplicant,
            String addressLine1,
            String addressLine2,
            String suburb,
            String city,
            String province,
            String postalCode,
            String country
    ) {
    }
}
```

### Financial Tab

``` java
public class FinancialDataDTO {
    private UUID id;
    private UUID profileId;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private List<AssetDTO> assets;
    private List<LiabilityDTO> liabilities;
}

```
