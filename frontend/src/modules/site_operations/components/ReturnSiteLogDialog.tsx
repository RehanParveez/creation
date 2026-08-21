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

export function ReturnSiteLogDialog({
  open,
  siteLog,
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  const [notes, setNotes] =
    useState("");

  if (!open) return null;

  const valid =
    notes.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          Return Site Report?
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          A return reason is required. The
          submitter will be able to edit and
          resubmit the report.
        </p>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          rows={5}
          maxLength={5000}
          placeholder="Explain what needs to be corrected..."
          className="mt-5 w-full rounded-lg border px-3 py-2"
        />

        <div className="mt-1 text-right text-xs text-muted-foreground">
          {notes.length}/5000
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
            onClick={() =>
              onConfirm(notes.trim())
            }
            disabled={
              loading || !valid
            }
            className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground"
          >
            {loading
              ? "Returning..."
              : "Return Report"}
          </button>
        </div>
      </div>
    </div>
  );
}