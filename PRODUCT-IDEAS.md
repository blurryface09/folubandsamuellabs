# FSLabs — Product Ideas Log

Running log of product ideas being considered for FSLabs, separate from its
current live products. Each entry should carry enough context that a new
Claude session (or a new hire) can pick it up cold.

---

## 1. Africa/Nigeria-first remote support tool ("ScreenConnect for Africa")

**Status:** Early idea stage — discussed, not yet scoped or committed to.
**Raised:** Aug 2026, while evaluating ConnectWise ScreenConnect for TailorNow's
own internal use (helping tailors onboard via remote PC control).

### The trigger

While setting up ScreenConnect to help TailorNow's support team walk
less tech-savvy tailors through onboarding (photo uploads, NIN entry) on PC,
the CTO noted the remote-support/RMM category is in real demand and wondered
whether FSLabs could build and sell a competing product rather than just
being a customer of one.

### What ScreenConnect actually is (for context)

Category: Remote Monitoring & Management (RMM) / remote-support software.
Same category as TeamViewer, AnyDesk, Splashtop, LogMeIn. Two-sided
architecture: a technician console (installed permanently on the support
side) and a lightweight guest connector (temporary, one-time-session on the
end user's side, or persistent for unattended access).

Primary market: MSPs (Managed Service Providers) running remote IT support
for client businesses, internal helpdesks, and attended one-off support like
TailorNow's use case.

### Why "Africa-first" could be a real wedge, not just a clone

- Incumbents (ConnectWise, TeamViewer, AnyDesk) are built for US/EU markets:
  USD pricing, assume reliable broadband, no local payment rails.
- A Nigeria/Africa-first version could win on: local pricing (Naira,
  amounts that make sense locally), local payment integration (Paystack —
  which FSLabs already has working integration experience with via
  TailorNow), better performance on unreliable/lower-bandwidth connections,
  and local trust (a Nigerian company selling to Nigerian SMEs/MSPs).
- Realistic path in is *not* out-featuring the incumbents head-on — it's
  serving a market segment they under-serve, or bundling with FSLabs' own
  existing dev/IT services rather than launching as a cold standalone
  product.

### Why this is a serious undertaking, not a quick build

- **Security-critical category.** This is remote control of someone else's
  computer — get session isolation, encryption, or auth wrong and the
  liability is severe (see abuse patterns below).
- **Real incumbent moat:** years of protocol hardening, cross-platform agent
  engineering (Windows/Mac, limited mobile), and — more importantly — deep
  channel relationships with MSPs who resell these tools. That relationship
  moat is harder to replicate than the software.
- **Known abuse patterns to design against from day one:**
  - Tech support scams — attackers impersonate support/a bank and talk
    victims into installing remote-access software, then steal credentials
    or install malware. The tool is structurally identical whether used in
    good or bad faith; only process/consent design prevents this.
  - Ransomware initial access — RMM tools have been used by ransomware
    affiliates as a persistence/lateral-movement foothold because they look
    like legitimate IT software to endpoint security.
  - Self-hosted-server vulnerabilities — ScreenConnect had a critical
    auth-bypass CVE in early 2024 (CVE-2024-1709/1708) exploited in the wild
    by ransomware groups against self-hosted servers. A cloud-hosted-only
    model (own and patch your own infra centrally) sidesteps this whole
    risk category for customers.
- Any FSLabs version should bake in from the start: attended one-time
  sessions as the default (not persistent unattended access), mandatory
  session recording + audit logs, and cloud-hosted architecture rather than
  offering self-hosting (at least initially).

### Open questions (not yet answered)

- Build vs. white-label: is there an existing open-source or licensable
  remote-desktop protocol stack to build on (e.g. based on RDP/VNC/WebRTC)
  rather than building the core transport from scratch?
- Target customer first: internal FSLabs/TailorNow use only, sell to other
  Nigerian SMEs, or go after the MSP-reseller channel directly?
- Regulatory: any Nigerian data-protection (NDPR) or telecom licensing
  implications for a remote-access product specifically (distinct from the
  identity-data handling questions already worked through for TailorNow's
  NIN-adjacent onboarding flow).
- Team/timeline: this would need dedicated security engineering effort, not
  a side-project inside TailorNow's existing team bandwidth.

### Next step when picked back up

Scope a proper first-principles discussion: target customer, build-vs-license
decision, and a minimum-viable security model, before any code gets written.

---

<!-- Add new ideas below this line, each with the same shape: Status, Raised,
     trigger/context, why it fits FSLabs, real risks/challenges, open
     questions, next step. -->
