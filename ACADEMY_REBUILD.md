# FSLabs Academy Rebuild

## Status: Phase 0 Complete ✅

### Cleanup Summary

**Deleted:**
- ❌ `/app/(app)/*` — HR workspace (dashboard, employees, departments, attendance, leave, payroll, documents, settings, my-profile)
- ❌ `/app/exchange/*` — Exchange app (crypto/giftcard trading)
- ❌ `/app/api/exchange/*` — Exchange API endpoints
- ❌ `/components/app/*` — HR-specific components (AppSidebar, AppTopbar, MobileNav, PageShell)
- ❌ `/lib/current-organization.ts` — HR membership utility
- ❌ `/lib/document-authorization.ts` — HR document auth
- ❌ `/lib/leave.ts` — HR leave utilities

**Updated:**
- ✅ `proxy.ts` — Removed HR routes, added Academy protected routes (/student, /instructor, /admin/academy)
- ✅ `prisma/schema.prisma` — Removed all HR and Exchange models, added Academy models
- ✅ `lib/roles.ts` — Updated roles: OWNER, ADMIN, INSTRUCTOR, STUDENT
- ✅ `lib/navigation.ts` — Updated nav for Academy
- ✅ `lib/auth.ts` — Removed organization status check
- ✅ `components/Navbar.tsx` — Removed HR/Exchange links
- ✅ `components/Footer.tsx` — Removed HR/Exchange links, added Courses link

**Kept:**
- ✅ Authentication system (NextAuth.js v5)
- ✅ Database connection (Prisma + PostgreSQL/Neon)
- ✅ Public pages (home, about, contact, services)
- ✅ Training landing page
- ✅ UI framework (Tailwind, Lucide)
- ✅ Email system (Resend)
- ✅ File storage (S3, local)
- ✅ Audit logging

---

## Current App Structure

```
folubandsamuellabs (fslabs.tech)
├─ app/
│  ├─ (auth)/           Public auth routes
│  │  ├─ login
│  │  ├─ register
│  │  ├─ forgot-password
│  │  └─ reset-password
│  ├─ about/            Public about page
│  ├─ contact/          Public contact page
│  ├─ services/         Public services page
│  ├─ training/         Training landing page (existing)
│  ├─ invite/           Email invite links
│  ├─ api/
│  │  ├─ auth/          NextAuth handlers
│  │  ├─ contact/       Contact form
│  │  ├─ health/        Health check
│  │  └─ ready/         Deployment check
│  ├─ page.tsx          Home page
│  ├─ layout.tsx        Root layout
│  ├─ globals.css       Styling
│  └─ robots.ts, sitemap.ts
├─ components/
│  ├─ Navbar.tsx
│  ├─ Footer.tsx
│  ├─ SiteChrome.tsx
│  ├─ Logo.tsx
│  └─ ui/               Button, Card components
├─ lib/                 Auth, utilities, database
├─ prisma/              Database schema & migrations
├─ public/              Assets
└─ package.json         Dependencies
```

---

## Academy Routes (Ready for Phase 1)

**To be created:**
- `/courses` — Public course catalog
- `/courses/[slug]` — Course detail page
- `/student/*` — Protected student portal
- `/instructor/*` — Protected instructor portal  
- `/admin/academy/*` — Protected admin portal

**API endpoints (to be created):**
- `/api/courses/*` — Course CRUD
- `/api/enrollments/*` — Enrollment management
- `/api/payments/*` — Payment processing
- `/api/progress/*` — Student progress tracking
- `/api/certificates/*` — Certificate generation

---

## Database Schema

**Academy models added to Prisma:**
- `Course` — Course metadata, pricing, instructor
- `Module` — Curriculum organization
- `Lesson` — Individual lesson content
- `Enrollment` — Student course enrollment
- `StudentProgress` — Lesson completion tracking
- `Payment` — Payment records
- `Certificate` — Issued certificates

**Core models kept:**
- `User` — Student/Instructor accounts
- `Organization` — FSLabs platform
- `OrganizationMember` — User roles
- `PasswordResetToken`, `EmailVerificationToken` — Auth
- `LoginThrottle` — Security
- `Document` — File storage
- `AuditLog` — Activity tracking

**Roles (updated):**
- `OWNER` — Platform owner
- `ADMIN` — Academy administrator
- `INSTRUCTOR` — Course instructor
- `STUDENT` — Student (new)

---

## Next Steps (Awaiting Approval)

### Phase 0: Database Migration ⏳
- [ ] Generate Prisma migration: `npm run db:migrate "academy-schema"`
- [ ] Review migration for safety
- [ ] Test schema with sample data

### Phase 1: Course Management 🎯
- Create `/instructor/courses` UI
- Build `/api/courses/*` endpoints
- Database queries for course CRUD
- Instructor role checks

### Phase 2: Enrollment & Payments 💳
- Payment integration (Paystack)
- Checkout flow
- Enrollment status tracking

### Phase 3: Student Portal 📚
- `/student/dashboard`
- `/student/courses/[id]/lessons`
- Progress tracking

### Phase 4: Certificates 🏆
- PDF generation
- Certificate templates
- Download/share links

### Phase 5: Instructor Dashboard 📊
- Student management
- Analytics
- Communication tools

---

## Important Notes

- **No HR app** — Fully removed, no conflicts
- **No Exchange app** — Fully removed
- **Single organization** — FSLabs is the academy tenant (organizationId hardcoded or env var)
- **Clean git history** — Ready for fresh commits
- **Database preserved** — Existing User/Auth data intact (if any)
- **Type safety** — TypeScript strict mode maintained

**Ready to generate database migration and proceed with Phase 0?** ✅
