import { uploadEmployeeDocument } from "@/app/(app)/employees/document-actions";
import { Button } from "@/components/ui/button";
import { documentTypeOptions } from "@/lib/document-types";

export function EmployeeDocumentUploadForm({ employeeId }: { employeeId: string }) {
  return (
    <form
      action={uploadEmployeeDocument}
      className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4"
    >
      <input name="employeeId" type="hidden" value={employeeId} />
      <div className="grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
        <div>
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="document-category"
          >
            Document type
          </label>
          <select
            className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            id="document-category"
            name="category"
            required
          >
            {documentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="document-file">
            File
          </label>
          <input
            className="mt-2 block h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            id="document-file"
            name="file"
            required
            type="file"
          />
        </div>
        <Button className="w-full md:w-auto" type="submit">
          Upload
        </Button>
      </div>
      <p className="text-xs text-slate-500">
        Files are stored locally for development and limited to 10 MB.
      </p>
    </form>
  );
}
