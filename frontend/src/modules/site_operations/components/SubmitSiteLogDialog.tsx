import type { SiteLog } from "../types/siteOperations.types";

interface Props {
  open: boolean;
  siteLog: SiteLog;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function SubmitSiteLogDialog({
  open,
  siteLog,
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          Submit Site Report?
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Once submitted, the report will
          enter the review workflow and can
          no longer be edited unless it is
          returned.
        </p>

        <div className="mt-5 rounded-lg border p-4">
          <p className="font-medium">
            {siteLog.report_date}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Progress:{" "}
            {siteLog.progress_percent}%
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
              : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}