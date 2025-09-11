import { Country } from './types';

// Each country now has a unique `value` for the select option
// and an `algorithmKey` to map to the correct logic.
export const COUNTRIES: Country[] = [...[
  { value: 'argentina', label: 'Argentina', algorithmKey: 'argentina' },
  { value: 'czech', label: 'Czech', algorithmKey: 'czech_slovak' },
  { value: 'germany', label: 'Germany', algorithmKey: 'germany' },
  { value: 'miwguc', label: 'MIWGUC - Multinational Interdisciplinary Working Group for Uveitis in Childhood', algorithmKey: 'miwguc' },
  { value: 'nordic', label: 'Nordic', algorithmKey: 'nordic' },
  { value: 'pakistan', label: 'Pakistan', algorithmKey: 'us_pakistan' },
  { value: 'portugal', label: 'Portugal', algorithmKey: 'spain_portugal' },
  { value: 'slovakia', label: 'Slovakia', algorithmKey: 'czech_slovak' },
  { value: 'spain', label: 'Spain', algorithmKey: 'spain_portugal' },
  { value: 'uk', label: 'UK', algorithmKey: 'uk' },
  { value: 'us', label: 'US', algorithmKey: 'us_pakistan' },
] as const].sort((a, b) => a.label.localeCompare(b.label));

// Sub-diagnosis and other options are defined within the algorithmService.ts file
// to keep related logic and data together.