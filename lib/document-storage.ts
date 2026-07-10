import "server-only";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

import type { DocumentStorageProvider } from "@prisma/client";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const SIGNED_DOWNLOAD_TTL_SECONDS = 60 * 5;
const STORAGE_ROOT = path.join(process.cwd(), "storage", "documents");

const allowedTypes = new Map([
  ["application/pdf", [".pdf"]],
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["application/msword", [".doc"]],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    [".docx"],
  ],
]);

function s3Config() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;

  if (!region || !bucket) {
    return null;
  }

  return { region, bucket };
}

function s3Client(region: string) {
  return new S3Client({ region });
}

export function activeDocumentStorageProvider(): DocumentStorageProvider {
  return s3Config() ? "S3" : "LOCAL";
}

export function safeFileName(name: string) {
  const extension = path.extname(name).toLowerCase();
  const baseName = path
    .basename(name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `${baseName || "document"}${extension}`;
}

function validateDocumentFile(file: File) {
  if (file.size <= 0) {
    throw new Error("Choose a file to upload.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Files must be 10 MB or smaller.");
  }

  const fileName = safeFileName(file.name);
  const extension = path.extname(fileName).toLowerCase();
  const validExtensions = allowedTypes.get(file.type);

  if (!validExtensions || !validExtensions.includes(extension)) {
    throw new Error("Upload a PDF, image, DOC, or DOCX document.");
  }

  return {
    fileName,
    contentType: file.type,
  };
}

export function documentObjectKey({
  organizationId,
  employeeId,
  documentId,
  fileName,
}: {
  organizationId: string;
  employeeId: string;
  documentId: string;
  fileName: string;
}) {
  return [
    "organizations",
    organizationId,
    "employees",
    employeeId,
    `${documentId}-${fileName}`,
  ].join("/");
}

export function storagePathForKey(storageKey: string) {
  const resolvedPath = path.resolve(STORAGE_ROOT, storageKey);
  const resolvedRoot = path.resolve(STORAGE_ROOT);

  if (!resolvedPath.startsWith(resolvedRoot)) {
    throw new Error("Invalid storage key.");
  }

  return resolvedPath;
}

export async function saveDocumentFile({
  organizationId,
  employeeId,
  documentId,
  file,
}: {
  organizationId: string;
  employeeId: string;
  documentId: string;
  file: File;
}) {
  const { fileName, contentType } = validateDocumentFile(file);
  const storageKey = documentObjectKey({
    organizationId,
    employeeId,
    documentId,
    fileName,
  });
  const config = s3Config();

  if (config) {
    await s3Client(config.region).send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: storageKey,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: contentType,
        ServerSideEncryption: "AES256",
      }),
    );

    return {
      bucket: config.bucket,
      storageProvider: "S3" as const,
      storageKey,
      name: file.name,
      contentType,
      sizeBytes: file.size,
    };
  }

  const filePath = storagePathForKey(storageKey);

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return {
    bucket: null,
    storageProvider: "LOCAL" as const,
    storageKey,
    name: file.name,
    contentType,
    sizeBytes: file.size,
  };
}

export async function deleteStoredDocument({
  storageProvider,
  storageKey,
  bucket,
}: {
  storageProvider: DocumentStorageProvider;
  storageKey: string;
  bucket?: string | null;
}) {
  if (storageProvider === "S3") {
    const config = s3Config();
    const targetBucket = bucket ?? config?.bucket;

    if (!config || !targetBucket) {
      throw new Error("S3 is not configured.");
    }

    await s3Client(config.region).send(
      new DeleteObjectCommand({
        Bucket: targetBucket,
        Key: storageKey,
      }),
    );
    return;
  }

  try {
    await unlink(storagePathForKey(storageKey));
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }
}

export async function createDocumentDownloadUrl({
  storageProvider,
  storageKey,
  bucket,
}: {
  storageProvider: DocumentStorageProvider;
  storageKey: string;
  bucket?: string | null;
}) {
  if (storageProvider !== "S3") {
    return null;
  }

  const config = s3Config();
  const targetBucket = bucket ?? config?.bucket;

  if (!config || !targetBucket) {
    throw new Error("S3 is not configured.");
  }

  return getSignedUrl(
    s3Client(config.region),
    new GetObjectCommand({
      Bucket: targetBucket,
      Key: storageKey,
    }),
    { expiresIn: SIGNED_DOWNLOAD_TTL_SECONDS },
  );
}
