export type InputType =
  | "csv_excel"
  | "pdf"
  | "photo_screenshot"
  | "manual"
  | "sample"
  | "other";

export type PayrollProvider =
  | "adp"
  | "quickbooks"
  | "gusto"
  | "excel_csv"
  | "other"
  | "unknown";

export function fileSizeBucket(bytes: number) {
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return "<1mb";
  if (mb < 5) return "1-5mb";
  if (mb < 10) return "5-10mb";
  return "10mb+";
}

export function safeFileType(file: Pick<File, "name" | "type">) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension && ["pdf", "csv", "xls", "xlsx", "png", "jpg", "jpeg"].includes(extension))
    return extension === "jpeg" ? "jpg" : extension;
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("image/")) return "image";
  return "other";
}

export function nonSensitiveErrorCode(status?: number) {
  if (status === 400) return "invalid_request";
  if (status === 413) return "file_too_large";
  if (status === 429) return "rate_limited";
  if (status && status >= 500) return "service_error";
  return "unexpected_error";
}
