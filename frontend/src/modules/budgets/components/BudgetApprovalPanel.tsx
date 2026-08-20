import type {Budget,
} from "../types/budget.types";
import {BudgetStatusBadge,
} from "./BudgetStatusBadge";

interface Props {
  budget: Budget;
}

export function BudgetApprovalPanel({
  budget,
}: Props) {
  return (
    <div className="rounded-xl border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">
            Approval
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Current budget lifecycle state.
          </p>
        </div>

        <BudgetStatusBadge
          status={budget.status}
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <span
            className={[
              "h-3 w-3 rounded-full",
              budget.status === "DRAFT"
                ? "bg-primary"
                : "bg-muted-foreground/30",
            ].join(" ")}
          />

          <span>Draft</span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={[
              "h-3 w-3 rounded-full",
              budget.status ===
              "PENDING_APPROVAL"
                ? "bg-primary"
                : "bg-muted-foreground/30",
            ].join(" ")}
          />

          <span>
            Pending Approval
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={[
              "h-3 w-3 rounded-full",
              budget.status ===
              "APPROVED"
                ? "bg-emerald-500"
                : "bg-muted-foreground/30",
            ].join(" ")}
          />

          <span>Approved</span>
        </div>

        {budget.status ===
          "REJECTED" && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">
              Budget Rejected
            </p>

            <p className="mt-1 text-sm">
              {budget.rejection_reason ||
                "No rejection reason provided."}
            </p>
          </div>
        )}

        {budget.approved_at && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Approved At
            </p>

            <p className="mt-1 text-sm font-medium">
              {new Date(
                budget.approved_at,
              ).toLocaleString()}
            </p>
          </div>
        )}

        {budget.approved_by && (
          <div>
            <p className="text-sm text-muted-foreground">
              Approved By
            </p>

            <p className="mt-1 font-mono text-xs">
              {budget.approved_by}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}