import type {Budget,
} from "../../types/budget.types";

interface Props {
  open: boolean;
  budget: Budget;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ApproveBudgetDialog({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          Approve Budget?
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Once approved, this budget will be
          locked and cannot be modified.
        </p>

        <div className="mt-5 rounded-lg border p-4">
          <p className="font-medium">
            {budget.name}
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
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
          >
            {loading
              ? "Approving..."
              : "Approve Budget"}
          </button>
        </div>
      </div>
    </div>
  );
}