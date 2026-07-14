import { ComingSoon, PageShell } from "@/components/app/page-shell";

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Configure your organization profile, roles, and integrations."
    >
      <ComingSoon
        routeHref="/settings"
        summary="Organization settings are on the roadmap. Once they ship, admins will manage the company profile, roles, and billing from here."
        features={[
          "Organization profile and branding",
          "Role and permission management",
          "Billing and subscription controls",
          "Integrations and notification preferences",
        ]}
      />
    </PageShell>
  );
}
