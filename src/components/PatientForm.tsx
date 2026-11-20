import type { FormEvent } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { PatientFormData, ValidationErrors } from '../utils/patientRecords';

interface PatientFormProps {
  formData: PatientFormData;
  errors: ValidationErrors;
  savedFeedback: string | null;
  onFieldChange: (field: keyof PatientFormData, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
}

const BASE_INPUT_CLASSES =
  'w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-[#0F2233] placeholder:text-[#7B90A4] transition-colors duration-150 focus:outline-none focus:ring-2';

function inputBorderClasses(hasError: boolean): string {
  return hasError
    ? 'border-[#C42525] focus:border-[#C42525] focus:ring-[#C42525]/20'
    : 'border-[#C5D3E0] hover:border-[#9EB4C9] focus:border-[#0B5CAD] focus:ring-[#0B5CAD]/20';
}

export function PatientForm({
  formData,
  errors,
  savedFeedback,
  onFieldChange,
  onSubmit,
  onClear,
}: PatientFormProps) {
  const errorCount = Object.keys(errors).length;

  return (
    <section
      aria-labelledby="intake-form-heading"
      className="bg-white border border-[#D8E2EC] rounded-lg p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 mb-4 border-b border-[#E6EEF6]">
        <div>
          <h2
            id="intake-form-heading"
            className="text-base sm:text-lg font-semibold text-[#0F2233] tracking-tight"
          >
            Patient Intake Form
          </h2>
          <p className="text-xs sm:text-sm text-[#546A7E] mt-0.5">
            Fields marked with an asterisk (<span className="text-[#C42525]">*</span>) are required before saving.
          </p>
        </div>
        <span className="text-xs text-[#546A7E]">
          Controlled React inputs
        </span>
      </div>

      {errorCount > 0 && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2.5 rounded-md border border-[#F1B8B8] bg-[#FDF2F2] px-4 py-3 text-sm text-[#8F1D1D]"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#C42525]" aria-hidden="true" />
          <p>
            Please complete the {errorCount === 1 ? 'required field' : `${errorCount} required fields`} highlighted below before saving the patient record.
          </p>
        </div>
      )}

      {savedFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 flex items-start gap-2.5 rounded-md border border-[#B7DFC9] bg-[#F0F9F4] px-4 py-3 text-sm text-[#125C38]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[#157347]" aria-hidden="true" />
          <p>{savedFeedback}</p>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {/* Core Row: Patient Name & Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="patient-name"
              className="block text-sm font-medium text-[#172B3D] mb-1"
            >
              Patient Name <span className="text-[#C42525]" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="patient-name"
              name="name"
              autoComplete="name"
              required
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              placeholder="e.g. Daniel Hughes"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'patient-name-error' : undefined}
              className={`${BASE_INPUT_CLASSES} ${inputBorderClasses(Boolean(errors.name))}`}
            />
            {errors.name && (
              <p
                id="patient-name-error"
                role="alert"
                className="mt-1 text-xs font-medium text-[#C42525]"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="patient-dob"
              className="block text-sm font-medium text-[#172B3D] mb-1"
            >
              Date of Birth <span className="text-[#C42525]" aria-hidden="true">*</span>
            </label>
            <input
              type="date"
              id="patient-dob"
              name="dateOfBirth"
              required
              value={formData.dateOfBirth}
              onChange={(e) => onFieldChange('dateOfBirth', e.target.value)}
              aria-invalid={Boolean(errors.dateOfBirth)}
              aria-describedby={errors.dateOfBirth ? 'patient-dob-error' : undefined}
              className={`${BASE_INPUT_CLASSES} tabular-nums ${inputBorderClasses(Boolean(errors.dateOfBirth))}`}
            />
            {errors.dateOfBirth && (
              <p
                id="patient-dob-error"
                role="alert"
                className="mt-1 text-xs font-medium text-[#C42525]"
              >
                {errors.dateOfBirth}
              </p>
            )}
          </div>
        </div>

        {/* Clinical History Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="patient-allergies"
              className="block text-sm font-medium text-[#172B3D] mb-1"
            >
              Allergies
            </label>
            <textarea
              id="patient-allergies"
              name="allergies"
              rows={2}
              value={formData.allergies}
              onChange={(e) => onFieldChange('allergies', e.target.value)}
              placeholder="Drug, food, or environmental allergies (or NKDA)"
              className={`${BASE_INPUT_CLASSES} resize-y min-h-[64px] ${inputBorderClasses(false)}`}
            />
          </div>

          <div>
            <label
              htmlFor="patient-medications"
              className="block text-sm font-medium text-[#172B3D] mb-1"
            >
              Current Medications
            </label>
            <textarea
              id="patient-medications"
              name="currentMedications"
              rows={2}
              value={formData.currentMedications}
              onChange={(e) => onFieldChange('currentMedications', e.target.value)}
              placeholder="Name, dosage, and frequency (e.g. Lisinopril 10mg daily)"
              className={`${BASE_INPUT_CLASSES} resize-y min-h-[64px] ${inputBorderClasses(false)}`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="patient-reason"
            className="block text-sm font-medium text-[#172B3D] mb-1"
          >
            Reason for Visit <span className="text-[#C42525]" aria-hidden="true">*</span>
          </label>
          <textarea
            id="patient-reason"
            name="reasonForVisit"
            rows={2}
            required
            value={formData.reasonForVisit}
            onChange={(e) => onFieldChange('reasonForVisit', e.target.value)}
            placeholder="Chief complaint, duration of symptoms, or follow-up reason"
            aria-invalid={Boolean(errors.reasonForVisit)}
            aria-describedby={errors.reasonForVisit ? 'patient-reason-error' : undefined}
            className={`${BASE_INPUT_CLASSES} resize-y min-h-[68px] ${inputBorderClasses(Boolean(errors.reasonForVisit))}`}
          />
          {errors.reasonForVisit && (
            <p
              id="patient-reason-error"
              role="alert"
              className="mt-1 text-xs font-medium text-[#C42525]"
            >
              {errors.reasonForVisit}
            </p>
          )}
        </div>

        {/* Optional Demographic & Coverage Details */}
        <div className="pt-4 border-t border-[#E6EEF6]">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#172B3D]">
              Additional Patient Details
            </h3>
            <span className="text-xs text-[#546A7E]">Optional</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="patient-gender"
                className="block text-sm font-medium text-[#172B3D] mb-1"
              >
                Gender
              </label>
              <select
                id="patient-gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => onFieldChange('gender', e.target.value)}
                className={`${BASE_INPUT_CLASSES} ${inputBorderClasses(false)}`}
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="patient-phone"
                className="block text-sm font-medium text-[#172B3D] mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="patient-phone"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => onFieldChange('phone', e.target.value)}
                placeholder="(555) 012-3456"
                className={`${BASE_INPUT_CLASSES} tabular-nums ${inputBorderClasses(false)}`}
              />
            </div>

            <div>
              <label
                htmlFor="patient-insurance-id"
                className="block text-sm font-medium text-[#172B3D] mb-1"
              >
                Insurance ID
              </label>
              <input
                type="text"
                id="patient-insurance-id"
                name="insuranceId"
                value={formData.insuranceId}
                onChange={(e) => onFieldChange('insuranceId', e.target.value)}
                placeholder="e.g. BCBS-4829104"
                className={`${BASE_INPUT_CLASSES} font-mono text-[13px] ${inputBorderClasses(false)}`}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E6EEF6]">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-[#0B5CAD] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#084785] active:bg-[#06386B] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Save Record
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center justify-center rounded-md border border-[#C5D3E0] bg-white px-4 py-2.5 text-sm font-medium text-[#2A3F54] hover:bg-[#F3F7FB] hover:border-[#9EB4C9] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Clear form
            </button>
          </div>
          <p className="text-xs text-[#546A7E]">
            Saves locally to browser storage
          </p>
        </div>
      </form>
    </section>
  );
}
