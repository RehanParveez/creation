import {useState,
} from "react";

interface Props {
  open: boolean;
  loading?: boolean;
  onConfirm: (
    reason: string,
  ) => void;
  onClose: () => void;
}

export function RejectBudgetDialog({
  open,
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  const [reason, setReason] =
    useState("");

  const [error, setError] =
    useState("");

  if (!open) {
    return null;
  }

  function submit() {
    const value = reason.trim();

    if (!value) {
      setError(
        "A rejection reason is required.",
      );
      return;
    }

    setError("");
    onConfirm(value);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          Reject Budget
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Provide a clear reason so the budget
          owner can revise it.
        </p>

        <div className="mt-5 space-y-2">
          <label className="text-sm font-medium">
            Rejection Reason
          </label>

          <textarea
            value={reason}
            onChange={(event) => {
              setReason(
                event.target.value,
              );

              if (error) {
                setError("");
              }
            }}
            rows={5}
            disabled={loading}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Explain why this budget is being rejected..."
          />

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
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
            onClick={submit}
            disabled={loading}
            className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground"
          >
            {loading
              ? "Rejecting..."
              : "Reject Budget"}
          </button>
        </div>
      </div>
    </div>
  );
}