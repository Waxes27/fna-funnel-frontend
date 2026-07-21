export const titleOptions = ['MR', 'MRS', 'MS', 'MISS', 'DR', 'PROF', 'OTHER'] as const;

export const genderOptions = [
  'MALE',
  'FEMALE',
  'NON_BINARY',
  'PREFER_NOT_TO_SAY',
  'OTHER',
] as const;

export const maritalStatusOptions = [
  'SINGLE',
  'MARRIED',
  'DIVORCED',
  'WIDOWED',
  'SEPARATED',
  'LIFE_PARTNERSHIP',
  'OTHER',
] as const;

export const smokerStatusOptions = ['SMOKER', 'NON_SMOKER', 'FORMER_SMOKER'] as const;

export const highestEducationLevelOptions = [
  'NO_FORMAL_EDUCATION',
  'PRIMARY_SCHOOL',
  'SOME_HIGH_SCHOOL',
  'MATRIC',
  'CERTIFICATE',
  'DIPLOMA',
  'BACHELORS_DEGREE',
  'HONOURS_DEGREE',
  'MASTERS_DEGREE',
  'DOCTORAL_DEGREE',
  'OTHER',
] as const;

export const provinceOptions = [
  'EASTERN_CAPE',
  'FREE_STATE',
  'GAUTENG',
  'KWAZULU_NATAL',
  'LIMPOPO',
  'MPUMALANGA',
  'NORTHERN_CAPE',
  'NORTH_WEST',
  'WESTERN_CAPE',
] as const;

export const formatEnumLabel = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
