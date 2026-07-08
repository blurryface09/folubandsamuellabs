export function EmployeeToast({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-4 top-20 z-50 max-w-sm rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
      {message}
    </div>
  );
}
