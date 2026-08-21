import {useEffect, useState,
} from "react";
import type {IssueSeverity, SiteLogIssue, SiteLogIssueCreateInput, SiteLogIssueUpdateInput,
} from "../types/siteOperations.types";
import {ISSUE_SEVERITY_OPTIONS, ISSUE_STATUS_OPTIONS,
} from "../types/siteOperations.types";

interface Props {
  open: boolean;
  issue?: SiteLogIssue;
  loading?: boolean;
  onClose: () => void;
  onCreate: (
    payload: SiteLogIssueCreateInput,
  ) => void;
  onUpdate: (
    payload: SiteLogIssueUpdateInput,
  ) => void;
}

export function SiteLogIssueForm({
  open,
  issue,
  loading = false,
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  const editing = Boolean(issue);

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    severity,
    setSeverity,
  ] =
    useState<IssueSeverity>("MEDIUM");

  const [status, setStatus] =
    useState("");

  const [
    resolution,
    setResolution,
  ] = useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) return;

    setTitle(issue?.title ?? "");
    setDescription(
      issue?.description ?? "",
    );
    setSeverity(
      issue?.severity ?? "MEDIUM",
    );
    setStatus(issue?.status ?? "");
    setResolution(
      issue?.resolution ?? "",
    );
    setError("");
  }, [open, issue]);

  if (!open) return null;

  function submit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError(
        "Issue title is required.",
      );
      return;
    }

    if (editing) {
      onUpdate({
        title: title.trim(),
        description:
          description.trim() ||
          null,
        severity,
        status: status
          ? (status as SiteLogIssue["status"])
          : undefined,
        resolution:
          resolution.trim() ||
          null,
      });

      return;
    }

    onCreate({
      title: title.trim(),
      description:
        description.trim() ||
        null,
      severity,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xl rounded-xl bg-background p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold">
          {editing
            ? "Edit Issue"
            : "Add Site Issue"}
        </h2>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value,
                )
              }
              maxLength={200}
              className="mt-2 w-full rounded-lg border px-3 py-2"
            />

            {error && (
              <p className="mt-1 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              rows={4}
              className="mt-2 w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">
                Severity
              </label>

              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(
                    e.target
                      .value as IssueSeverity,
                  )
                }
                className="mt-2 w-full rounded-lg border px-3 py-2"
              >
                {ISSUE_SEVERITY_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            {editing && (
              <div>
                <label className="text-sm font-medium">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-lg border px-3 py-2"
                >
                  {ISSUE_STATUS_OPTIONS.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}
          </div>

          {editing && (
            <div>
              <label className="text-sm font-medium">
                Resolution
              </label>

              <textarea
                value={resolution}
                onChange={(e) =>
                  setResolution(
                    e.target.value,
                  )
                }
                rows={3}
                className="mt-2 w-full rounded-lg border px-3 py-2"
              />
            </div>
          )}
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
              ? "Saving..."
              : editing
                ? "Save Issue"
                : "Add Issue"}
          </button>
        </div>
      </form>
    </div>
  );
}