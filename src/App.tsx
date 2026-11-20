import { useEffect, useState, type FormEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import { FormSkeleton } from './components/FormSkeleton';
import { FormStatePanel } from './components/FormStatePanel';
import { PatientForm } from './components/PatientForm';
import { SavedRecordsTable } from './components/SavedRecordsTable';
import {
  FORM_LOAD_DELAY_MS,
  INITIAL_FORM_STATE,
  createPatientRecord,
  hasValidationErrors,
  loadStoredRecords,
  persistRecords,
  validatePatientForm,
  type PatientFormData,
  type PatientRecord,
  type ValidationErrors,
} from './utils/patientRecords';

export default function App() {
  const [formData, setFormData] = useState<PatientFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [records, setRecords] = useState<PatientRecord[]>(() =>
    loadStoredRecords(typeof window !== 'undefined' ? window.localStorage : null)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loadCycle, setLoadCycle] = useState(0);
  const [isFormReady, setIsFormReady] = useState(false);

  useEffect(() => {
    setIsFormReady(false);
    const timer = window.setTimeout(() => {
      setIsFormReady(true);
    }, FORM_LOAD_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [loadCycle]);

  function handleFieldChange(field: keyof PatientFormData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (savedFeedback) {
      setSavedFeedback(null);
    }

    if (
      (field === 'name' || field === 'dateOfBirth' || field === 'reasonForVisit') &&
      errors[field]
    ) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validatePatientForm(formData);

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      setSavedFeedback(null);
      return;
    }

    const newRecord = createPatientRecord(formData);
    const nextRecords = [newRecord, ...records];
    setRecords(nextRecords);
    persistRecords(nextRecords, window.localStorage);

    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setSavedFeedback(`Record saved for ${newRecord.name}.`);
  }

  function handleClearForm() {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setSavedFeedback(null);
  }

  function handleDeleteRecord(id: string) {
    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    persistRecords(nextRecords, window.localStorage);
  }

  function handleReplayDelay() {
    setSavedFeedback(null);
    setLoadCycle((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F9FC] text-[#0F2233]">
      {/* Top Clinical Workspace Header */}
      <header className="bg-white border-b border-[#D8E2EC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
            <span className="font-bold tracking-tight text-[#0B5CAD] whitespace-nowrap shrink-0">
              Harborview Medical
            </span>
            <span className="text-[#9EB4C9] hidden sm:inline shrink-0" aria-hidden="true">/</span>
            <span className="text-[#546A7E] hidden sm:inline whitespace-nowrap shrink-0">
              Patient Intake
            </span>
            <span className="text-[#9EB4C9] hidden sm:inline shrink-0" aria-hidden="true">/</span>
            <span className="font-medium text-[#0F2233] hidden sm:inline truncate">
              Record Entry
            </span>
          </nav>

          <button
            type="button"
            onClick={handleReplayDelay}
            disabled={!isFormReady}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#C5D3E0] bg-white px-3.5 py-2 text-xs font-medium text-[#2A3F54] hover:bg-[#F3F7FB] hover:border-[#9EB4C9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#546A7E]" aria-hidden="true" />
            Replay 1s Load
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#0F2233] tracking-tight text-balance">
            Patient Record Entry
          </h1>
          <p className="text-sm text-[#4A6075] mt-1 max-w-2xl">
            Enter patient demographics, allergies, current medications, and reason for visit. All fields are controlled React inputs synced in real time with the state inspector.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            {isFormReady ? (
              <PatientForm
                formData={formData}
                errors={errors}
                savedFeedback={savedFeedback}
                onFieldChange={handleFieldChange}
                onSubmit={handleSubmit}
                onClear={handleClearForm}
              />
            ) : (
              <FormSkeleton />
            )}
          </div>

          <div className="lg:col-span-5">
            <FormStatePanel formData={formData} isFormReady={isFormReady} />
          </div>
        </div>

        <div className="mt-8">
          <SavedRecordsTable
            records={records}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onDeleteRecord={handleDeleteRecord}
          />
        </div>
      </main>

      <footer className="border-t border-[#E2EAF2] bg-white mt-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#546A7E]">
          <span>Harborview Medical · Clinical Intake Test Target</span>
          <span>Local-only browser storage · No patient data transmitted</span>
        </div>
      </footer>
    </div>
  );
}
