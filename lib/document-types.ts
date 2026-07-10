import { DocumentType } from "@prisma/client";

export const documentTypeLabels: Record<DocumentType, string> = {
  CV: "CV",
  CONTRACT: "Contract",
  OFFER_LETTER: "Offer letter",
  ID_CARD: "ID card",
  CERTIFICATE: "Certificate",
  PAYSLIP: "Payslip",
  OTHER: "Other",
};

export const documentTypeOptions = Object.entries(documentTypeLabels).map(
  ([value, label]) => ({
    value: value as DocumentType,
    label,
  }),
);

export function formatFileSize(sizeBytes?: number | null) {
  if (!sizeBytes) {
    return "Unknown size";
  }

  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}
