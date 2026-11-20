import { Search, Trash2 } from 'lucide-react';
import {
  filterPatientRecords,
  formatDisplayDate,
  type PatientRecord,
} from '../utils/patientRecords';

interface SavedRecordsTableProps {
  records: PatientRecord[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onDeleteRecord: (id: string) => void;
}

export function SavedRecordsTable({
  records,
  searchQuery,
  onSearchChange,
  onDeleteRecord,
}: SavedRecordsTableProps) {
  const filteredRecords = filterPatientRecords(records, searchQuery);

  return (
    <section
      aria-labelledby="saved-records-heading"
      className="bg-white border border-[#D8E2EC] rounded-lg overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-[#E6EEF6]">
        <div>
          <h2
            id="saved-records-heading"
            className="text-lg font-semibold text-[#0F2233] tracking-tight"
          >
            Saved Records
          </h2>
          <p className="text-xs text-[#546A7E] mt-1 tabular-nums">
            {records.length === 1
              ? '1 patient record stored in localStorage'
              : `${records.length} patient records stored in localStorage`}
            {searchQuery.trim() && filteredRecords.length !== records.length
              ? ` · Showing ${filteredRecords.length} matching`
              : ''}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <label htmlFor="records-search" className="sr-only">
            Filter saved records
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B8096]"
            aria-hidden="true"
          />
          <input
            id="records-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by name, allergy, reason…"
            className="w-full rounded-md border border-[#C5D3E0] bg-white pl-9 pr-3 py-2 text-sm text-[#0F2233] placeholder:text-[#7B90A4] hover:border-[#9EB4C9] focus:border-[#0B5CAD] focus:outline-none focus:ring-2 focus:ring-[#0B5CAD]/20 transition-colors duration-150"
          />
        </div>
      </div>

      {records.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#172B3D]">
            No patient records saved yet
          </p>
          <p className="text-sm text-[#546A7E] mt-1 max-w-md mx-auto">
            Complete the Patient Intake Form above and click Save Record to store a patient entry in browser storage.
          </p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-medium text-[#172B3D]">
            No records match &ldquo;{searchQuery.trim()}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="mt-3 text-sm font-medium text-[#0B5CAD] hover:underline cursor-pointer"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="bg-[#F3F7FB] border-b border-[#D8E2EC] text-xs font-semibold text-[#3C5266]">
                <th scope="col" className="py-3 pl-6 pr-4">
                  Patient
                </th>
                <th scope="col" className="py-3 px-4 whitespace-nowrap">
                  Date of Birth
                </th>
                <th scope="col" className="py-3 px-4">
                  Allergies
                </th>
                <th scope="col" className="py-3 px-4">
                  Current Medications
                </th>
                <th scope="col" className="py-3 px-4">
                  Reason for Visit
                </th>
                <th scope="col" className="py-3 pl-4 pr-6 text-right whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EEF6] text-sm">
              {filteredRecords.map((record) => {
                const extras = [record.gender, record.phone, record.insuranceId]
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <tr
                    key={record.id}
                    className="align-top hover:bg-[#F8FBFE] transition-colors duration-150"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div className="font-semibold text-[#0F2233]">
                        {record.name}
                      </div>
                      {extras && (
                        <div className="text-xs text-[#546A7E] mt-1 tabular-nums">
                          {extras}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-[13px] tabular-nums text-[#2A3F54] whitespace-nowrap">
                      {formatDisplayDate(record.dateOfBirth)}
                    </td>
                    <td className="py-4 px-4 text-[#2A3F54] max-w-[190px] break-words">
                      {record.allergies || (
                        <span className="text-[#7B90A4]">None listed</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#2A3F54] max-w-[220px] break-words">
                      {record.currentMedications || (
                        <span className="text-[#7B90A4]">None listed</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#2A3F54] max-w-[250px] break-words">
                      {record.reasonForVisit}
                    </td>
                    <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(record.id)}
                        aria-label={`Delete record for ${record.name}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-transparent px-2.5 py-1.5 text-xs font-medium text-[#A62121] hover:bg-[#FDF2F2] hover:border-[#F1B8B8] transition-colors duration-150 whitespace-nowrap cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
