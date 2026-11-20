import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import {
  TARGET_FIELD_SPECS,
  countPopulatedTargetFields,
  type PatientFormData,
} from '../utils/patientRecords';

interface FormStatePanelProps {
  formData: PatientFormData;
  isFormReady: boolean;
}

export function FormStatePanel({ formData, isFormReady }: FormStatePanelProps) {
  const [copied, setCopied] = useState(false);

  const formattedJson = JSON.stringify(formData, null, 2);
  const populatedCount = countPopulatedTargetFields(formData);

  async function handleCopyJson() {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside
      aria-labelledby="form-state-heading"
      className="bg-white border border-[#D8E2EC] rounded-lg p-6 lg:sticky lg:top-6"
    >
      <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-[#E6EEF6]">
        <div>
          <h2
            id="form-state-heading"
            className="text-base font-semibold text-[#0F2233] tracking-tight"
          >
            Form State (live)
          </h2>
          <p className="text-xs text-[#546A7E] mt-1 tabular-nums">
            {isFormReady
              ? `${populatedCount} of 5 target fields in React state`
              : 'Waiting for delayed form mount (1.0s)'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyJson}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#C5D3E0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#2A3F54] hover:bg-[#F3F7FB] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#157347]" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-[#546A7E]" aria-hidden="true" />
              Copy JSON
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-[#4A6075] mb-3 leading-relaxed">
        Reflects React controlled state in real time. Values filled via DOM automation must appear below to confirm React <code className="font-mono text-[#0F2233]">onChange</code> synchronization.
      </p>

      <pre
        data-testid="live-form-state-json"
        className="overflow-x-auto rounded-md border border-[#1E3348] bg-[#0F2233] p-4 font-mono text-xs leading-6 text-[#E6F0FA]"
      >
        <code>{formattedJson}</code>
      </pre>

      <div className="mt-5 pt-4 border-t border-[#E6EEF6]">
        <h3 className="text-xs font-semibold text-[#172B3D] mb-2.5">
          Target Field Selectors
        </h3>
        <div className="space-y-2">
          {TARGET_FIELD_SPECS.map((spec) => {
            const hasValue = formData[spec.name].trim().length > 0;
            return (
              <div
                key={spec.id}
                className="flex items-center justify-between gap-2 text-xs py-1 border-b border-[#F1F5F9] last:border-b-0"
              >
                <div className="min-w-0 truncate">
                  <span className="font-mono text-[#0B5CAD]">#{spec.id}</span>
                  <span className="text-[#8CA0B3] mx-1.5" aria-hidden="true">·</span>
                  <span className="text-[#4A6075]">{spec.label}</span>
                </div>
                <span
                  className={`font-mono text-[11px] shrink-0 ${
                    hasValue ? 'text-[#157347] font-medium' : 'text-[#7B90A4]'
                  }`}
                >
                  {hasValue ? 'Synced' : 'Empty'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
