import { ComingSoon, PageShell } from "@/components/app/page-shell";

export default function AttendancePage() {
  return (
    <PageShell
      title="Attendance"
      description="Track clock-ins, shifts, and timesheets across your organization."
    >
      <ComingSoon
        routeHref="/attendance"
        summary="Attendance tracking is on the roadmap. Once it ships, staff clock-ins and shift schedules will appear here, scoped to your organization."
        features={[
          "Daily clock-in and clock-out records",
          "Shift calendars and rotation planning",
          "Late arrival and absence exceptions",
          "Timesheet summaries for payroll handoff",
        ]}
      />
    </PageShell>
  );
}
