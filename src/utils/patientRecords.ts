export interface PatientFormData {
  name: string;
  dateOfBirth: string;
  allergies: string;
  currentMedications: string;
  reasonForVisit: string;
  gender: string;
  phone: string;
  insuranceId: string;
}

export interface PatientRecord extends PatientFormData {
  id: string;
  savedAt: string;
}

export interface ValidationErrors {
  name?: string;
  dateOfBirth?: string;
  reasonForVisit?: string;
}

export interface TargetFieldSpec {
  label: string;
  element: string;
  id: string;
  name: keyof Pick<
    PatientFormData,
    'name' | 'dateOfBirth' | 'allergies' | 'currentMedications' | 'reasonForVisit'
  >;
  required: boolean;
}

export const STORAGE_KEY = 'harborview_patient_records_v1';

export const FORM_LOAD_DELAY_MS = 1000;

export const INITIAL_FORM_STATE: PatientFormData = {
  name: '',
  dateOfBirth: '',
  allergies: '',
  currentMedications: '',
  reasonForVisit: '',
  gender: '',
  phone: '',
  insuranceId: '',
};

export const TARGET_FIELD_SPECS: TargetFieldSpec[] = [
  {
    label: 'Patient Name',
    element: 'input[type="text"]',
    id: 'patient-name',
    name: 'name',
    required: true,
  },
  {
    label: 'Date of Birth',
    element: 'input[type="date"]',
    id: 'patient-dob',
    name: 'dateOfBirth',
    required: true,
  },
  {
    label: 'Allergies',
    element: 'textarea',
    id: 'patient-allergies',
    name: 'allergies',
    required: false,
  },
  {
    label: 'Current Medications',
    element: 'textarea',
    id: 'patient-medications',
    name: 'currentMedications',
    required: false,
  },
  {
    label: 'Reason for Visit',
    element: 'textarea',
    id: 'patient-reason',
    name: 'reasonForVisit',
    required: true,
  },
];

export const SEED_RECORDS: PatientRecord[] = [
  {
    id: 'rec-seed-001',
    name: 'Margaret Chen',
    dateOfBirth: '1978-09-24',
    allergies: 'Sulfa drugs (mild rash)',
    currentMedications: 'Levothyroxine 50mcg daily, Vitamin D3 1000 IU',
    reasonForVisit: 'Annual preventive checkup and thyroid panel review',
    gender: 'Female',
    phone: '(555) 234-8910',
    insuranceId: 'BCBS-4829104',
    savedAt: '2026-11-19T14:30:00.000Z',
  },
  {
    id: 'rec-seed-002',
    name: 'Robert Alvarez',
    dateOfBirth: '1962-03-11',
    allergies: 'No known drug allergies (NKDA)',
    currentMedications: 'Atorvastatin 20mg nightly, Metformin 500mg BID',
    reasonForVisit: 'Follow-up for hypertension and quarterly A1C lab work',
    gender: 'Male',
    phone: '(555) 781-3402',
    insuranceId: 'UHC-9910432',
    savedAt: '2026-11-19T16:15:00.000Z',
  },
];

export function validatePatientForm(data: PatientFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Patient Name is required.';
  }

  if (!data.dateOfBirth.trim()) {
    errors.dateOfBirth = 'Date of Birth is required.';
  }

  if (!data.reasonForVisit.trim()) {
    errors.reasonForVisit = 'Reason for Visit is required.';
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function createPatientRecord(
  data: PatientFormData,
  now: Date = new Date(),
  idOverride?: string
): PatientRecord {
  const uniqueSuffix = Math.random().toString(36).slice(2, 8);
  return {
    id: idOverride ?? `rec-${now.getTime()}-${uniqueSuffix}`,
    name: data.name.trim(),
    dateOfBirth: data.dateOfBirth.trim(),
    allergies: data.allergies.trim(),
    currentMedications: data.currentMedications.trim(),
    reasonForVisit: data.reasonForVisit.trim(),
    gender: data.gender.trim(),
    phone: data.phone.trim(),
    insuranceId: data.insuranceId.trim(),
    savedAt: now.toISOString(),
  };
}

export function countPopulatedTargetFields(data: PatientFormData): number {
  return TARGET_FIELD_SPECS.reduce((count, spec) => {
    return count + (data[spec.name].trim().length > 0 ? 1 : 0);
  }, 0);
}

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return '—';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  const [, year, month, day] = match;
  return `${month}/${day}/${year}`;
}

export function filterPatientRecords(
  records: PatientRecord[],
  query: string
): PatientRecord[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return records;

  return records.filter((record) => {
    return (
      record.name.toLowerCase().includes(trimmed) ||
      record.dateOfBirth.toLowerCase().includes(trimmed) ||
      record.allergies.toLowerCase().includes(trimmed) ||
      record.currentMedications.toLowerCase().includes(trimmed) ||
      record.reasonForVisit.toLowerCase().includes(trimmed) ||
      record.insuranceId.toLowerCase().includes(trimmed)
    );
  });
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function loadStoredRecords(storage?: StorageLike | null): PatientRecord[] {
  if (!storage) return SEED_RECORDS;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      return SEED_RECORDS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return SEED_RECORDS;
    }
    return parsed.filter(
      (item): item is PatientRecord =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.dateOfBirth === 'string' &&
        typeof item.reasonForVisit === 'string'
    );
  } catch {
    return SEED_RECORDS;
  }
}

export function persistRecords(
  records: PatientRecord[],
  storage?: StorageLike | null
): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage quota or private-browsing write failures
  }
}
