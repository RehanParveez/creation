import type { SiteLogStatus } from "../types/siteOperations.types";

interface Props {
  status: SiteLogStatus;
}

const styles: Record<
  SiteLogStatus,
  string
> = {
  DRAFT:
    "bg-slate-100 text-slate-700 border-slate-200",
  SUBMITTED:
    "bg-blue-50 text-blue-700 border-blue-200",
  REVIEWED:
    "bg-amber-50 text-amber-700 border-amber-200",
  RETURNED:
    "bg-red-50 text-red-700 border-red-200",
  APPROVED:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const labels: Record<
  SiteLogStatus,
  string
> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  REVIEWED: "Reviewed",
  RETURNED: "Returned",
  APPROVED: "Approved",
};

export function SiteLogStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}