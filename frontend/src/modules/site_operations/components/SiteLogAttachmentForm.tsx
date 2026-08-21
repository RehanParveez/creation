import {useState,
} from "react";
import type {SiteLogAttachmentCreateInput,
} from "../types/siteOperations.types";

interface Props {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    payload: SiteLogAttachmentCreateInput,
  ) => void;
}

export function SiteLogAttachmentForm({
  open,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [fileName, setFileName] =
    useState("");

  const [storageKey, setStorageKey] =
    useState("");

  const [
    contentType,
    setContentType,
  ] = useState("");

  const [sizeBytes, setSizeBytes] =
    useState("0");

  if (!open) return null;

  function submit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (
      !fileName.trim() ||
      !storageKey.trim() ||
      !contentType.trim()
    ) {
      return;
    }

    onSubmit({
      file_name: fileName.trim(),
      storage_key: storageKey.trim(),
      content_type:
        contentType.trim(),
      size_bytes: Number(sizeBytes),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold">
          Add Attachment
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The current backend accepts
          attachment metadata only. Actual
          object-storage upload is not exposed
          by the supplied API.
        </p>

        <div className="mt-5 space-y-4">
          <input
            placeholder="File name"
            value={fileName}
            onChange={(e) =>
              setFileName(
                e.target.value,
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          />

          <input
            placeholder="Storage key"
            value={storageKey}
            onChange={(e) =>
              setStorageKey(
                e.target.value,
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          />

          <input
            placeholder="Content type e.g. image/jpeg"
            value={contentType}
            onChange={(e) =>
              setContentType(
                e.target.value,
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          />

          <input
            type="number"
            min="0"
            placeholder="Size in bytes"
            value={sizeBytes}
            onChange={(e) =>
              setSizeBytes(
                e.target.value,
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            {loading
              ? "Adding..."
              : "Add Attachment"}
          </button>
        </div>
      </form>
    </div>
  );
}