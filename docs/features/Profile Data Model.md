# Profile Data Model

## 1. Primary Applicant Profile

### Personal Information

| Field                   | Data Type     | Required | Description                                                                    |
| ----------------------- | ------------- | -------: | ------------------------------------------------------------------------------ |
| `title`                 | String / Enum |      Yes | Applicant’s title, for example `Mr`, `Mrs`, `Ms`, `Dr`, or `Prof`.             |
| `firstName`             | String        |      Yes | First name as recorded on the applicant’s identity document.                   |
| `surname`               | String        |      Yes | Surname as recorded on the applicant’s identity document.                      |
| `idNumber`              | String        |      Yes | Applicant’s South African identity number or recognised identification number. |
| `gender`                | String / Enum |      Yes | Applicant’s gender.                                                            |
| `maritalStatus`         | String / Enum |      Yes | Applicant’s current marital status.                                            |
| `smokerStatus`          | String / Enum |      Yes | Indicates whether the applicant is a smoker.                                   |
| `highestEducationLevel` | String / Enum |      Yes | Highest level of education completed by the applicant.                         |

### Employment and Income Information

| Field                | Data Type | Required | Description                                                      |
| -------------------- | --------- | -------: | ---------------------------------------------------------------- |
| `occupation`         | String    |      Yes | Applicant’s current occupation or job title.                     |
| `grossMonthlyIncome` | Decimal   |      Yes | Applicant’s total monthly income before deductions.              |
| `incomeCurrency`     | String    |      Yes | Currency applicable to the gross monthly income. Default: `ZAR`. |

### Contact Information

| Field          | Data Type | Required | Description                                                                     |
| -------------- | --------- | -------: | ------------------------------------------------------------------------------- |
| `emailAddress` | String    |      Yes | Applicant’s primary email address.                                              |
| `mobileNumber` | String    |      Yes | Applicant’s primary mobile number, including the country code where applicable. |

### Residential Address

| Field          | Data Type     | Required | Description                                                          |
| -------------- | ------------- | -------: | -------------------------------------------------------------------- |
| `addressLine1` | String        |      Yes | Street number, street name, or primary residential address line.     |
| `addressLine2` | String        |       No | Apartment, unit, complex, estate, or additional address information. |
| `suburb`       | String        |      Yes | Residential suburb or locality.                                      |
| `city`         | String        |      Yes | Residential city or town.                                            |
| `province`     | String / Enum |      Yes | Province or administrative region.                                   |
| `postalCode`   | String        |      Yes | Residential postal code.                                             |
| `country`      | String        |      Yes | Country of residence. Default: `South Africa`.                       |

---

## 2. Spouse Profile

The spouse profile is required when:

```text
maritalStatus = MARRIED
```

The spouse must provide the same personal, employment, income, contact, address, smoking, and education information as the primary applicant.

### Spouse Personal Information

| Field                   | Data Type     | Required | Description                                               |
| ----------------------- | ------------- | -------: | --------------------------------------------------------- |
| `title`                 | String / Enum |      Yes | Spouse’s title.                                           |
| `firstName`             | String        |      Yes | First name as recorded on the spouse’s identity document. |
| `surname`               | String        |      Yes | Surname as recorded on the spouse’s identity document.    |
| `idNumber`              | String        |      Yes | Spouse’s identity number.                                 |
| `gender`                | String / Enum |      Yes | Spouse’s gender.                                          |
| `maritalStatus`         | String / Enum |      Yes | Spouse’s marital status.                                  |
| `smokerStatus`          | String / Enum |      Yes | Indicates whether the spouse is a smoker.                 |
| `highestEducationLevel` | String / Enum |      Yes | Highest level of education completed by the spouse.       |

### Spouse Employment and Income Information

| Field                | Data Type | Required | Description                                        |
| -------------------- | --------- | -------: | -------------------------------------------------- |
| `occupation`         | String    |      Yes | Spouse’s current occupation or job title.          |
| `grossMonthlyIncome` | Decimal   |      Yes | Spouse’s total monthly income before deductions.   |
| `incomeCurrency`     | String    |      Yes | Currency applicable to the income. Default: `ZAR`. |

### Spouse Contact Information

| Field          | Data Type | Required | Description                     |
| -------------- | --------- | -------: | ------------------------------- |
| `emailAddress` | String    |      Yes | Spouse’s primary email address. |
| `mobileNumber` | String    |      Yes | Spouse’s primary mobile number. |

### Spouse Residential Address

| Field                    | Data Type     |    Required | Description                                                              |
| ------------------------ | ------------- | ----------: | ------------------------------------------------------------------------ |
| `sameAsPrimaryApplicant` | Boolean       |         Yes | Indicates whether the spouse shares the applicant’s residential address. |
| `addressLine1`           | String        | Conditional | Required when the spouse does not share the applicant’s address.         |
| `addressLine2`           | String        |          No | Additional residential address information.                              |
| `suburb`                 | String        | Conditional | Required when `sameAsPrimaryApplicant` is `false`.                       |
| `city`                   | String        | Conditional | Required when `sameAsPrimaryApplicant` is `false`.                       |
| `province`               | String / Enum | Conditional | Required when `sameAsPrimaryApplicant` is `false`.                       |
| `postalCode`             | String        | Conditional | Required when `sameAsPrimaryApplicant` is `false`.                       |
| `country`                | String        | Conditional | Required when `sameAsPrimaryApplicant` is `false`.                       |

---

## 3. Suggested Data Structure

```json
{
  "primaryApplicant": {
    "title": "",
    "firstName": "",
    "surname": "",
    "idNumber": "",
    "gender": "",
    "occupation": "",
    "grossMonthlyIncome": 0,
    "incomeCurrency": "ZAR",
    "maritalStatus": "",
    "emailAddress": "",
    "mobileNumber": "",
    "residentialAddress": {
      "addressLine1": "",
      "addressLine2": "",
      "suburb": "",
      "city": "",
      "province": "",
      "postalCode": "",
      "country": "South Africa"
    },
    "smokerStatus": "",
    "highestEducationLevel": ""
  },
  "spouse": {
    "applicable": false,
    "title": "",
    "firstName": "",
    "surname": "",
    "idNumber": "",
    "gender": "",
    "occupation": "",
    "grossMonthlyIncome": 0,
    "incomeCurrency": "ZAR",
    "maritalStatus": "",
    "emailAddress": "",
    "mobileNumber": "",
    "residentialAddress": {
      "sameAsPrimaryApplicant": true,
      "addressLine1": "",
      "addressLine2": "",
      "suburb": "",
      "city": "",
      "province": "",
      "postalCode": "",
      "country": "South Africa"
    },
    "smokerStatus": "",
    "highestEducationLevel": ""
  }
}
```

## 4. Suggested Enumerations

```text
title:
- MR
- MRS
- MS
- MISS
- DR
- PROF
- OTHER

gender:
- MALE
- FEMALE
- NON_BINARY
- PREFER_NOT_TO_SAY
- OTHER

maritalStatus:
- SINGLE
- MARRIED
- DIVORCED
- WIDOWED
- SEPARATED
- LIFE_PARTNERSHIP
- OTHER

smokerStatus:
- SMOKER
- NON_SMOKER
- FORMER_SMOKER

highestEducationLevel:
- NO_FORMAL_EDUCATION
- PRIMARY_SCHOOL
- SOME_HIGH_SCHOOL
- MATRIC
- CERTIFICATE
- DIPLOMA
- BACHELORS_DEGREE
- HONOURS_DEGREE
- MASTERS_DEGREE
- DOCTORAL_DEGREE
- OTHER
```

## 5. Validation Rules

* The applicant’s names and surname must match the supplied identity document.
* The ID number must be unique and validated according to the applicable identification format.
* `grossMonthlyIncome` must be zero or greater.
* The email address must use a valid email format.
* The mobile number should be stored in an international format, for example `+27821234567`.
* Spouse information becomes mandatory when the applicant’s marital status is `MARRIED`.
* The spouse’s residential address may be omitted when `sameAsPrimaryApplicant` is `true`.
* Sensitive personal information must be encrypted in transit and at rest.
