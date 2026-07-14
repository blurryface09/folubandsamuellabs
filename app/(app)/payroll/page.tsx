import { ComingSoon, PageShell } from "@/components/app/page-shell";

export default function PayrollPage() {
  return (
    <PageShell
      title="Payroll"
      description="Run payroll, issue payslips, and manage compensation records."
    >
      <ComingSoon
        routeHref="/payroll"
        summary="Payroll is on the roadmap. Once it ships, you will run pay cycles and issue payslips from here, with every record scoped to your organization."
        features={[
          "Compensation records per employee",
          "Payroll runs with approval checkpoints",
          "Payslip generation and delivery",
          "Statutory deductions and remittances",
        ]}
      />
    </PageShell>
  );
}
