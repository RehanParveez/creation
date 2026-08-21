import type { IssueSeverity } from "../types/siteOperations.types";

interface Props {
  severity: IssueSeverity;
}

const styles: Record<
  IssueSeverity,
  string
> = {
  LOW:
    "bg-slate-100 text-slate-700 border-slate-200",
  MEDIUM:
    "bg-amber-50 text-amber-700 border-amber-200",
  HIGH:
    "bg-orange-50 text-orange-700 border-orange-200",
  CRITICAL:
    "bg-red-50 text-red-700 border-red-200",
};

export function IssueSeverityBadge({
  severity,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${styles[severity]}`}
    >
      {severity.replace("_", " ")}
    </span>
  );
}