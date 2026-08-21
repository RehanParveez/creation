import {
  useState,
} from "react";

import type { SiteLog } from "../types/siteOperations.types";

interface Props {
  open: boolean;
  siteLog: SiteLog;
  loading?: boolean;
  onConfirm: (
    notes: string,
  ) => void;
  onClose: () => void;
}

export function ReviewSiteLogDialog({
  open,
  siteLog,
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  const [notes, setNotes] =
    useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          Review Site Report
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Mark this submitted report as
          reviewed. Review notes are optional.
        </p>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          rows={4}
          placeholder="Optional reviewer notes..."
          className="mt-5 w-full rounded-lg border px-3 py-2"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onConfirm(
                notes.trim(),
              )
            }
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            {loading
              ? "Reviewing..."
              : "Mark Reviewed"}
          </button>
        </div>
      </div>
    </div>
  );
}