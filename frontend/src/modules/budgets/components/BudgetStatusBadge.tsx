import {BUDGET_STATUS_LABELS,
} from "../utils/budget.constants";

import type {BudgetStatus,
} from "../types/budget.types";

interface Props {
  status: BudgetStatus;
}

export function BudgetStatusBadge({
  status,
}: Props) {
  const classes: Record<
    BudgetStatus,
    string
  > = {
    DRAFT:
      "bg-slate-100 text-slate-700",
    PENDING_APPROVAL:
      "bg-amber-100 text-amber-800",
    APPROVED:
      "bg-emerald-100 text-emerald-800",
    REJECTED:
      "bg-red-100 text-red-800",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full",
        "px-2.5 py-1 text-xs font-semibold",
        classes[status],
      ].join(" ")}
    >
      {BUDGET_STATUS_LABELS[status]}
    </span>
  );
}