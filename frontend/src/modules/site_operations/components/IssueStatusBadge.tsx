import type { IssueStatus } from "../types/siteOperations.types";

interface Props {
  status: IssueStatus;
}

const styles: Record<
  IssueStatus,
  string
> = {
  OPEN:
    "bg-red-50 text-red-700 border-red-200",
  IN_PROGRESS:
    "bg-blue-50 text-blue-700 border-blue-200",
  RESOLVED:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED:
    "bg-slate-100 text-slate-700 border-slate-200",
};

export function IssueStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}