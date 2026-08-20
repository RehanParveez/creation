import {useEffect, useState,
} from "react";
import type {BudgetCreateInput, BudgetUpdateInput,
} from "../types/budget.types";

interface Props {
  initialValues?: {
    name: string;
    description: string | null;
  };

  loading?: boolean;

  submitLabel?: string;

  onSubmit: (
    values:
      | BudgetCreateInput
      | BudgetUpdateInput,
  ) => void;

  onCancel?: () => void;
}

export function BudgetForm({
  initialValues,
  loading = false,
  submitLabel = "Save Budget",
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] =
    useState(
      initialValues?.name ?? "",
    );

  const [description, setDescription] =
    useState(
      initialValues?.description ?? "",
    );

  const [errors, setErrors] =
    useState<
      Record<string, string>
    >({});

  useEffect(() => {
    setName(
      initialValues?.name ?? "",
    );

    setDescription(
      initialValues?.description ?? "",
    );
  }, [initialValues]);

  function submit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const nextErrors: Record<
      string,
      string
    > = {};

    if (!name.trim()) {
      nextErrors.name =
        "Budget name is required.";
    }

    if (name.trim().length > 200) {
      nextErrors.name =
        "Budget name cannot exceed 200 characters.";
    }

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0
    ) {
      return;
    }

    onSubmit({
      name: name.trim(),
      description:
        description.trim() || null,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label
          htmlFor="budget-name"
          className="text-sm font-medium"
        >
          Budget Name
        </label>

        <input
          id="budget-name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          maxLength={200}
          disabled={loading}
          className="w-full rounded-lg border bg-background px-3 py-2"
          placeholder="Construction Budget"
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="budget-description"
          className="text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="budget-description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value,
            )
          }
          disabled={loading}
          rows={4}
          className="w-full rounded-lg border bg-background px-3 py-2"
          placeholder="Describe this budget..."
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
}