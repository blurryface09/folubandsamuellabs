export function DepartmentToast({
  message,
  type = "success",
}: {
  message?: string;
  type?: string;
}) {
  if (!message) {
    return null;
  }

  const classes =
    type === "error"
      ? "border-red-200 text-red-700"
      : "border-emerald-200 text-emerald-700";

  return (
    <div
      className={`fixed right-4 top-20 z-50 max-w-sm rounded-md border bg-white px-4 py-3 text-sm font-medium shadow-lg ${classes}`}
    >
      {message}
    </div>
  );
}
