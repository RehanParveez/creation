import {useEffect, useState,
} from "react";
import type {MaterialRequisition, MaterialRequisitionCreateInput, MaterialRequisitionPriority, MaterialRequisitionUpdateInput,
} from "../types";

interface BaseProps {
  submitting?: boolean;

  submitLabel?: string;

  onCancel?: () => void;
}

interface CreateProps
  extends BaseProps {
  initialValues?: undefined;

  onSubmit: (
    values: MaterialRequisitionCreateInput,
  ) => void;
}

interface UpdateProps
  extends BaseProps {
  initialValues: MaterialRequisition;

  onSubmit: (
    values: MaterialRequisitionUpdateInput,
  ) => void;
}

type Props =
  | CreateProps
  | UpdateProps;

export function MaterialRequisitionForm({
  initialValues,
  submitting = false,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: Props) {
  const [
    title,
    setTitle,
  ] = useState(
    initialValues?.title ?? "",
  );

  const [
    description,
    setDescription,
  ] = useState(
    initialValues?.description ?? "",
  );

  const [
    priority,
    setPriority,
  ] =
    useState<MaterialRequisitionPriority>(
      initialValues?.priority ??
        "NORMAL",
    );

  const [
    neededBy,
    setNeededBy,
  ] = useState(
    initialValues?.needed_by ?? "",
  );

  useEffect(() => {
    setTitle(
      initialValues?.title ?? "",
    );

    setDescription(
      initialValues?.description ?? "",
    );

    setPriority(
      initialValues?.priority ??
        "NORMAL",
    );

    setNeededBy(
      initialValues?.needed_by ?? "",
    );
  }, [initialValues]);

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      return;
    }

    if (!initialValues) {
      const values: MaterialRequisitionCreateInput =
        {
          title: trimmedTitle,
          description:
            description.trim() || null,
          priority,
          needed_by:
            neededBy || null,
        };

      onSubmit(values);

      return;
    }

    const values: MaterialRequisitionUpdateInput =
      {
        title: trimmedTitle,
        description:
          description.trim() || null,
        priority,
        needed_by:
          neededBy || null,
      };

    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">
          Title
        </label>

        <input
          value={title}
          onChange={(event) =>
            setTitle(
              event.target.value,
            )
          }
          maxLength={200}
          required
          className="w-full rounded-md border px-3 py-2"
          placeholder="Electrical Installation Materials"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value,
            )
          }
          rows={4}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Priority
          </label>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target
                  .value as MaterialRequisitionPriority,
              )
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="LOW">
              Low
            </option>

            <option value="NORMAL">
              Normal
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="URGENT">
              Urgent
            </option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Needed By
          </label>

          <input
            type="date"
            value={neededBy}
            onChange={(event) =>
              setNeededBy(
                event.target.value,
              )
            }
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-md border px-4 py-2"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            submitting ||
            !title.trim()
          }
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
}