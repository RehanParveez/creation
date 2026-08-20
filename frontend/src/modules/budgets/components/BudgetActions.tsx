import type {Budget,
} from "../types/budget.types";

interface Props {
  budget: Budget;

  canManage: boolean;
  canApprove: boolean;

  onEdit: () => void;
  onDelete: () => void;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function BudgetActions({budget, canManage, canApprove, onEdit, onDelete, onSubmit, onApprove, onReject,
}: Props) {
  const editable =
    budget.status === "DRAFT" ||
    budget.status === "REJECTED";

  const pending =
    budget.status ===
    "PENDING_APPROVAL";

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {canManage && editable && (
        <>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border px-4 py-2"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-destructive/30 px-4 py-2 text-destructive"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={
              budget.items.length === 0
            }
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit for Approval
          </button>
        </>
      )}

      {canApprove && pending && (
        <>
          <button
            type="button"
            onClick={onReject}
            className="rounded-lg border border-destructive/30 px-4 py-2 text-destructive"
          >
            Reject
          </button>

          <button
            type="button"
            onClick={onApprove}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
          >
            Approve
          </button>
        </>
      )}
    </div>
  );
}