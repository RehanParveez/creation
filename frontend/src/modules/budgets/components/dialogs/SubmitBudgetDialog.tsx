import type {Budget,
} from "../../types/budget.types";

interface Props {
  open: boolean;
  budget: Budget;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function SubmitBudgetDialog({
  open,
  budget,
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className = "w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
        <h2 className = "text-lg font-semibold">
          Submit Budget for Approval?
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          This budget will become read-only
          until it is approved or rejected.
        </p>

        <div className="mt-5 rounded-lg border p-4">
          <p className="font-medium">
            {budget.name}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {budget.items.length} budget item
            {budget.items.length === 1
              ? ""
              : "s"}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            {loading
              ? "Submitting..."
              : "Submit for Approval"}
          </button>
        </div>
      </div>
    </div>
  );
}