import { ComingSoon, PageShell } from "@/components/app/page-shell";

export default function LeavePage() {
  return (
    <PageShell
      title="Leave"
      description="Manage leave policies, balances, and approvals for your team."
    >
      <ComingSoon
        routeHref="/leave"
        summary="Leave management is on the roadmap. Once it ships, staff will request time off here and managers will approve it, all scoped to your organization."
        features={[
          "Leave policies and accrual rules",
          "Balance tracking per employee",
          "Request and approval workflows",
          "Team leave calendars",
        ]}
      />
    </PageShell>
  );
}
