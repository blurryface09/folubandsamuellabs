# Production Setup

This app uses PostgreSQL for HR metadata, private S3 storage for staff documents, and SES or Resend for employee invitation email.

## Required Environment Variables

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="generate-a-long-random-secret"
APP_URL="https://your-production-domain.com"

AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="your-private-hr-documents-bucket"

EMAIL_FROM="Folub & Samuel Labs HR <hr@your-domain.com>"

# Preferred when using Amazon SES:
AWS_SES_REGION="us-east-1"

# Fallback when SES is not configured:
RESEND_API_KEY="re_..."
```

`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` must stay server-side only. Do not prefix them with `NEXT_PUBLIC_`.

## Private S3 Bucket

1. Create an S3 bucket in the same AWS account and region you will use for the app.
2. Keep **Block all public access** enabled.
3. Enable default server-side encryption, preferably SSE-S3 or SSE-KMS.
4. Create an IAM user or role for the app with access limited to this bucket.
5. Use a least-privilege policy similar to:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-private-hr-documents-bucket/organizations/*"
    }
  ]
}
```

Documents are stored with keys shaped like:

```text
organizations/{organizationId}/employees/{employeeId}/{documentId}-{safeFileName}
```

The database stores only metadata, the storage provider, bucket name, and object key. Downloads are served through short-lived signed URLs.

If `AWS_REGION` or `AWS_S3_BUCKET` is missing, the app falls back to local development storage under `storage/documents`.

## Invitation Email

The app sends employee invitation emails through Amazon SES when `AWS_SES_REGION` or `SES_REGION` is configured. If SES is not configured, it uses Resend when `RESEND_API_KEY` is present.

### Amazon SES

1. Verify `EMAIL_FROM` sender identity in SES.
2. Move SES out of sandbox or verify each test recipient.
3. Set `AWS_SES_REGION` to the SES region.
4. Ensure the app IAM principal can call `ses:SendEmail`.

### Resend

1. Verify the sending domain in Resend.
2. Set `EMAIL_FROM` to an address on that verified domain.
3. Set `RESEND_API_KEY`.

Invitation emails include the company name, employee name, expiry time, and secure invite link. Raw invite tokens are not written to logs.

## Security Notes

- All document reads, uploads, and deletes are scoped by `organizationId`.
- Employees can download only documents linked to their own employee record.
- Admin/HR users can access documents only for employees in their organization.
- S3 objects are private; the bucket must not be public.
- File names are sanitized and object keys are generated server-side.
- Uploads validate MIME type, file extension, and a 10 MB size limit.
- Document upload, download, deletion, invite sent, and invite resent events are audited in `AuditLog`.
