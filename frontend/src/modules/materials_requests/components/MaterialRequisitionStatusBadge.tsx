import type {MaterialRequisitionStatus,
} from "../types";
import { statusLabel } from "../utils";

interface Props {
  status: MaterialRequisitionStatus;
}

export function MaterialRequisitionStatusBadge({
  status,
}: Props) {
  const className =
    {
      DRAFT:
        "bg-gray-100 text-gray-700",
      SUBMITTED:
        "bg-blue-100 text-blue-700",
      APPROVED:
        "bg-green-100 text-green-700",
      REJECTED:
        "bg-red-100 text-red-700",
      PARTIALLY_FULFILLED:
        "bg-yellow-100 text-yellow-800",
      FULFILLED:
        "bg-emerald-100 text-emerald-700",
      CANCELLED:
        "bg-gray-200 text-gray-700",
    }[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {statusLabel(status)}
    </span>
  );
}