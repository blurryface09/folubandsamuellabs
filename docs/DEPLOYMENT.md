# Vercel Deployment

This guide prepares the HR SaaS for a secure production deployment on Vercel.

## Build Configuration

- Install command: `npm install`
- Build command: `npm run build`
- Build script: `prisma generate && next build`
- Production migration command: `npm run db:deploy`

Do not run `prisma migrate dev` in production. It is for local development only.

## Environment Checklist

Set these in Vercel Project Settings:

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="long-random-secret"
APP_URL="https://your-vercel-domain.com"

AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="private-hr-documents-bucket"

EMAIL_FROM="Folub & Samuel Labs HR <hr@your-domain.com>"
AWS_SES_REGION="us-east-1"
# or
RESEND_API_KEY="re_..."
```

Optional:

```bash
ALLOW_PRODUCTION_SEED="false"
```

Never expose AWS credentials or tokens with `NEXT_PUBLIC_`.

## Neon Setup

1. Create a Neon project and production branch.
2. Use pooled connection strings only where supported by Prisma.
3. Store the production `DATABASE_URL` in Vercel.
4. Before each deployment with schema changes, create a Neon backup or branch.
5. Run migrations with:

```bash
npm run db:deploy
```

## Backup And Restore

- Use Neon branching before production migrations.
- Take a restore point or create a protected branch before large releases.
- To restore, promote a known-good branch or restore from the Neon dashboard.
- Validate `/api/ready` after restore.

## S3 Setup

Use a private S3 bucket with public access blocked. Grant only:

```json
{
  "Effect": "Allow",
  "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
  "Resource": "arn:aws:s3:::private-hr-documents-bucket/organizations/*"
}
```

Enable server-side encryption. The app generates signed URLs for downloads.

## SES Or Resend

SES:

1. Verify `EMAIL_FROM`.
2. Move out of sandbox for real recipients.
3. Set `AWS_SES_REGION`.
4. Ensure IAM allows `ses:SendEmail`.

Resend:

1. Verify your sending domain.
2. Set `EMAIL_FROM`.
3. Set `RESEND_API_KEY`.

## Deployment Steps

1. Confirm local checks pass:

```bash
npm install
npx prisma validate
npx prisma generate
npm run test:run
npm run lint
npm run build
```

2. Create a Neon backup or branch.
3. Deploy environment variables to Vercel.
4. Run `npm run db:deploy` against production.
5. Deploy the Vercel build.

## Post-Deployment Verification

- Visit `/api/health` and confirm `ok: true`.
- Visit `/api/ready` and confirm database readiness.
- Register a company admin.
- Verify email.
- Add an employee.
- Invite the employee.
- Accept invite and verify staff email.
- Upload, download, and delete a document.
- Confirm cross-tenant document access fails.

## Rollback

1. Revert to the previous Vercel deployment.
2. If a migration caused data issues, restore or promote the known-good Neon branch.
3. Re-run `/api/ready`.
4. Rotate secrets if a deployment exposed configuration by mistake.

## Seed Safety

The seed script refuses to run in production unless `ALLOW_PRODUCTION_SEED=true`.
Production deployments should not run seed automatically.
