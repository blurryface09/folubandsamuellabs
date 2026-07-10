import "server-only";

import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const STORAGE_ROOT = path.join(process.cwd(), "storage", "documents");

function safeFileName(name: string) {
  const extension = path.extname(name).toLowerCase();
  const baseName = path
    .basename(name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `${baseName || "document"}${extension}`;
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
  file,
}: {
  organizationId: string;
  employeeId: string;
  file: File;
}) {
  if (file.size <= 0) {
    throw new Error("Choose a file to upload.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Files must be 10 MB or smaller.");
  }

  const storageKey = path.join(
    organizationId,
    employeeId,
    `${randomUUID()}-${safeFileName(file.name)}`,
  );
  const filePath = storagePathForKey(storageKey);

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return {
    storageKey,
    name: file.name,
    contentType: file.type || "application/octet-stream",
    sizeBytes: file.size,
  };
}

export async function deleteDocumentFile(storageKey: string) {
  try {
    await unlink(storagePathForKey(storageKey));
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }
}
