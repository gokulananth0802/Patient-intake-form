export function FormSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading patient record"
      data-testid="form-loading-skeleton"
      className="bg-white border border-[#D8E2EC] rounded-lg p-5 sm:p-6"
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E6EEF6]">
        <div>
          <p className="text-base font-semibold text-[#0F2233]">
            Loading patient record…
          </p>
          <p className="text-xs sm:text-sm text-[#546A7E] mt-0.5">
            Preparing clinical intake form fields
          </p>
        </div>
        <span className="text-xs font-mono tabular-nums text-[#546A7E]">
          1.0s simulated fetch
        </span>
      </div>

      {/* Matches 2-column Patient Name + Date of Birth row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1.5">
          <div className="h-4 w-28 rounded bg-[#E6EEF6] skeleton-pulse" />
          <div className="h-10 w-full rounded-md bg-[#EEF4FA] skeleton-pulse" />
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-28 rounded bg-[#E6EEF6] skeleton-pulse" />
          <div className="h-10 w-full rounded-md bg-[#EEF4FA] skeleton-pulse" />
        </div>
      </div>

      {/* Matches 2-column Allergies + Current Medications row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1.5">
          <div className="h-4 w-24 rounded bg-[#E6EEF6] skeleton-pulse" />
          <div className="h-16 w-full rounded-md bg-[#EEF4FA] skeleton-pulse" />
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-36 rounded bg-[#E6EEF6] skeleton-pulse" />
          <div className="h-16 w-full rounded-md bg-[#EEF4FA] skeleton-pulse" />
        </div>
      </div>

      {/* Matches Reason for Visit textarea */}
      <div className="space-y-1.5 mb-5">
        <div className="h-4 w-32 rounded bg-[#E6EEF6] skeleton-pulse" />
        <div className="h-[68px] w-full rounded-md bg-[#EEF4FA] skeleton-pulse" />
      </div>

      {/* Matches Optional Additional Details 3-column row */}
      <div className="pt-4 border-t border-[#E6EEF6]">
        <div className="h-4 w-44 rounded bg-[#E6EEF6] skeleton-pulse mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="space-y-1.5">
            <div className="h-4 w-16 rounded bg-[#E6EEF6] skeleton-pulse" />
            <div className="h-10 w-full rounded-md bg-[#EEF4FA] skeleton-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-16 rounded bg-[#E6EEF6] skeleton-pulse" />
            <div className="h-10 w-full rounded-md bg-[#EEF4FA] skeleton-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-24 rounded bg-[#E6EEF6] skeleton-pulse" />
            <div className="h-10 w-full rounded-md bg-[#EEF4FA] skeleton-pulse" />
          </div>
        </div>
      </div>

      {/* Matches action buttons row */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#E6EEF6]">
        <div className="h-10 w-32 rounded-md bg-[#DCE7F2] skeleton-pulse" />
        <div className="h-10 w-28 rounded-md bg-[#EEF4FA] skeleton-pulse" />
      </div>
    </section>
  );
}
