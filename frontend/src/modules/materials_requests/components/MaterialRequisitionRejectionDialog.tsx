import {useState,
} from "react";

interface Props {
  submitting?: boolean;

  onSubmit: (
    reason: string,
  ) => void;

  onCancel: () => void;
}

export function MaterialRequisitionRejectionDialog({
  submitting = false,
  onSubmit,
  onCancel,
}: Props) {
  const [
    reason,
    setReason,
  ] = useState("");

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const value = reason.trim();

    if (!value) {
      return;
    }

    onSubmit(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <h3 className="text-lg font-semibold">
          Reject Material Requisition
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          A rejection reason is required.
        </p>
      </div>

      <textarea
        value={reason}
        onChange={(event) =>
          setReason(event.target.value)
        }
        maxLength={2000}
        rows={6}
        required
        className="w-full rounded-md border px-3 py-2"
        placeholder="Explain why this requisition is being rejected..."
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-md border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            submitting ||
            !reason.trim()
          }
          className="rounded-md bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting
            ? "Rejecting..."
            : "Reject Requisition"}
        </button>
      </div>
    </form>
  );
}