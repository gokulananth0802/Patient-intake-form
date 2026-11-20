import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_FORM_STATE,
  SEED_RECORDS,
  STORAGE_KEY,
  TARGET_FIELD_SPECS,
  countPopulatedTargetFields,
  createPatientRecord,
  filterPatientRecords,
  formatDisplayDate,
  hasValidationErrors,
  loadStoredRecords,
  persistRecords,
  validatePatientForm,
  type StorageLike,
} from './patientRecords';

function createMemoryStorage(initial: Record<string, string> = {}): StorageLike {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

test('target field specs match exact required extension IDs and names', () => {
  assert.deepEqual(
    TARGET_FIELD_SPECS.map((s) => ({ id: s.id, name: s.name })),
    [
      { id: 'patient-name', name: 'name' },
      { id: 'patient-dob', name: 'dateOfBirth' },
      { id: 'patient-allergies', name: 'allergies' },
      { id: 'patient-medications', name: 'currentMedications' },
      { id: 'patient-reason', name: 'reasonForVisit' },
    ]
  );
});

test('validatePatientForm rejects empty or whitespace-only required fields', () => {
  const errors = validatePatientForm({
    ...INITIAL_FORM_STATE,
    name: '   ',
    dateOfBirth: '',
    reasonForVisit: '\t\n',
  });

  assert.equal(hasValidationErrors(errors), true);
  assert.equal(errors.name, 'Patient Name is required.');
  assert.equal(errors.dateOfBirth, 'Date of Birth is required.');
  assert.equal(errors.reasonForVisit, 'Reason for Visit is required.');
});

test('validatePatientForm passes when name, dateOfBirth, and reasonForVisit are filled', () => {
  const errors = validatePatientForm({
    ...INITIAL_FORM_STATE,
    name: 'Daniel Hughes',
    dateOfBirth: '1985-04-12',
    reasonForVisit: 'Persistent cough 2 weeks',
  });

  assert.equal(hasValidationErrors(errors), false);
  assert.deepEqual(errors, {});
});

test('createPatientRecord trims inputs and preserves all fields', () => {
  const fixedDate = new Date('2026-11-20T08:00:00.000Z');
  const record = createPatientRecord(
    {
      name: '  Daniel Hughes  ',
      dateOfBirth: '1985-04-12',
      allergies: ' Penicillin ',
      currentMedications: ' Lisinopril 10mg daily ',
      reasonForVisit: ' Persistent cough 2 weeks ',
      gender: 'Male',
      phone: ' (555) 101-2020 ',
      insuranceId: ' AET-90210 ',
    },
    fixedDate,
    'rec-fixed'
  );

  assert.deepEqual(record, {
    id: 'rec-fixed',
    name: 'Daniel Hughes',
    dateOfBirth: '1985-04-12',
    allergies: 'Penicillin',
    currentMedications: 'Lisinopril 10mg daily',
    reasonForVisit: 'Persistent cough 2 weeks',
    gender: 'Male',
    phone: '(555) 101-2020',
    insuranceId: 'AET-90210',
    savedAt: '2026-11-20T08:00:00.000Z',
  });
});

test('countPopulatedTargetFields counts only the 5 automation-target fields', () => {
  assert.equal(countPopulatedTargetFields(INITIAL_FORM_STATE), 0);

  assert.equal(
    countPopulatedTargetFields({
      ...INITIAL_FORM_STATE,
      gender: 'Male',
      phone: '555-0100',
      insuranceId: 'INS-123',
    }),
    0
  );

  assert.equal(
    countPopulatedTargetFields({
      ...INITIAL_FORM_STATE,
      name: 'Daniel Hughes',
      dateOfBirth: '1985-04-12',
      allergies: 'Penicillin',
      currentMedications: 'Lisinopril 10mg daily',
      reasonForVisit: 'Persistent cough 2 weeks',
    }),
    5
  );
});

test('loadStoredRecords and persistRecords handle initial seed, explicit empty array, and corrupt JSON', () => {
  const emptyStorage = createMemoryStorage();
  assert.equal(loadStoredRecords(emptyStorage).length, SEED_RECORDS.length);

  // Explicit empty array after deleting all records should stay empty
  persistRecords([], emptyStorage);
  assert.deepEqual(loadStoredRecords(emptyStorage), []);

  // Valid persisted records load back accurately
  const saved = [
    createPatientRecord(
      {
        ...INITIAL_FORM_STATE,
        name: 'Daniel Hughes',
        dateOfBirth: '1985-04-12',
        allergies: 'Penicillin',
        currentMedications: 'Lisinopril 10mg daily',
        reasonForVisit: 'Persistent cough 2 weeks',
      },
      new Date('2026-11-20T08:00:00.000Z'),
      'rec-1'
    ),
  ];
  persistRecords(saved, emptyStorage);
  assert.deepEqual(loadStoredRecords(emptyStorage), saved);

  // Corrupt JSON recovers safely to seed records
  const corruptStorage = createMemoryStorage({ [STORAGE_KEY]: '{not-valid-json' });
  assert.equal(loadStoredRecords(corruptStorage).length, SEED_RECORDS.length);
});

test('formatDisplayDate formats ISO date strings cleanly', () => {
  assert.equal(formatDisplayDate('1985-04-12'), '04/12/1985');
  assert.equal(formatDisplayDate(''), '—');
  assert.equal(formatDisplayDate('invalid'), 'invalid');
});

test('filterPatientRecords filters by name, allergies, medication, or reason', () => {
  assert.equal(filterPatientRecords(SEED_RECORDS, '').length, 2);
  assert.equal(filterPatientRecords(SEED_RECORDS, 'margaret').length, 1);
  assert.equal(filterPatientRecords(SEED_RECORDS, 'metformin').length, 1);
  assert.equal(filterPatientRecords(SEED_RECORDS, 'penicillin').length, 0);
});
