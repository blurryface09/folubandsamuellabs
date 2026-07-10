import { describe, expect, it } from "vitest";
import { createSecureToken, hashToken } from "../lib/auth-tokens";
import { canAccessEmployeeDocument } from "../lib/document-authorization";
import { inviteStatus } from "../lib/invite-token";
import { validatePasswordStrength } from "../lib/password";
import { hasMinimumRole } from "../lib/roles";
import { isSingleUseTokenUsable } from "../lib/token-policy";

describe("authentication password policy", () => {
  it("rejects weak passwords and accepts a reasonable production password", () => {
    expect(validatePasswordStrength("short")).toMatch(/10/);
    expect(validatePasswordStrength("lowercaseonly1!")).toMatch(/uppercase/i);
    expect(validatePasswordStrength("NoNumberHere!")).toMatch(/number/i);
    expect(validatePasswordStrength("NoSymbolHere1")).toMatch(/symbol/i);
    expect(validatePasswordStrength("StrongPass1!")).toBeNull();
  });
});

describe("secure tokens", () => {
  it("hashes tokens deterministically without exposing the raw token", () => {
    const token = createSecureToken();
    const hash = hashToken(token);

    expect(token).not.toEqual(hash);
    expect(hash).toEqual(hashToken(token));
    expect(hash).toHaveLength(64);
  });

  it("enforces expiry and single-use semantics", () => {
    const now = new Date("2026-07-10T12:00:00Z");

    expect(
      isSingleUseTokenUsable({
        expiresAt: new Date("2026-07-10T12:05:00Z"),
      }, now),
    ).toBe(true);
    expect(
      isSingleUseTokenUsable({
        expiresAt: new Date("2026-07-10T12:05:00Z"),
        usedAt: now,
      }, now),
    ).toBe(false);
    expect(
      isSingleUseTokenUsable({
        expiresAt: new Date("2026-07-10T11:59:59Z"),
      }, now),
    ).toBe(false);
  });
});

describe("employee invitation token status", () => {
  it("shows expired and accepted invitations correctly", () => {
    const expired = {
      expiresAt: new Date("2020-01-01T00:00:00Z"),
      acceptedAt: null,
      revokedAt: null,
    };
    const accepted = {
      expiresAt: new Date("2099-01-01T00:00:00Z"),
      acceptedAt: new Date(),
      revokedAt: null,
    };

    expect(inviteStatus(expired)).toBe("Expired");
    expect(inviteStatus(accepted)).toBe("Accepted");
  });
});

describe("role-based access control", () => {
  it("allows admins and HR to satisfy HR permission checks", () => {
    expect(hasMinimumRole("ADMIN", "HR_MANAGER")).toBe(true);
    expect(hasMinimumRole("HR_MANAGER", "HR_MANAGER")).toBe(true);
    expect(hasMinimumRole("EMPLOYEE", "HR_MANAGER")).toBe(false);
  });
});

describe("document authorization and tenant isolation", () => {
  it("allows HR users to access documents only inside their organization", () => {
    expect(
      canAccessEmployeeDocument({
        role: "HR_MANAGER",
        sessionOrganizationId: "org-a",
        documentOrganizationId: "org-a",
        sessionMemberId: "member-hr",
        employeeOrganizationMemberId: "employee-member",
      }),
    ).toBe(true);
    expect(
      canAccessEmployeeDocument({
        role: "HR_MANAGER",
        sessionOrganizationId: "org-a",
        documentOrganizationId: "org-b",
        sessionMemberId: "member-hr",
        employeeOrganizationMemberId: "employee-member",
      }),
    ).toBe(false);
  });

  it("allows employees to access only their own documents", () => {
    expect(
      canAccessEmployeeDocument({
        role: "EMPLOYEE",
        sessionOrganizationId: "org-a",
        documentOrganizationId: "org-a",
        sessionMemberId: "employee-member",
        employeeOrganizationMemberId: "employee-member",
      }),
    ).toBe(true);
    expect(
      canAccessEmployeeDocument({
        role: "EMPLOYEE",
        sessionOrganizationId: "org-a",
        documentOrganizationId: "org-a",
        sessionMemberId: "employee-member",
        employeeOrganizationMemberId: "other-employee",
      }),
    ).toBe(false);
  });
});
