import {useEffect, useMemo, useState,
} from "react";
import type {BudgetItem, BudgetItemCategory, BudgetItemCreateInput, BudgetItemUpdateInput,
} from "../types/budget.types";
import {BUDGET_CATEGORIES, BUDGET_CATEGORY_LABELS,
} from "../utils/budget.constants";
import {calculateItemTotal,
} from "../utils/budget.calculations";

interface Props {
  item?: BudgetItem;
  loading?: boolean;

  onSubmit: (
    values:
      | BudgetItemCreateInput
      | BudgetItemUpdateInput,
  ) => void;

  onCancel?: () => void;
}

export function BudgetItemForm({
  item,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [itemCode, setItemCode] =
    useState(item?.item_code ?? "");

  const [description, setDescription] =
    useState(item?.description ?? "");

  const [category, setCategory] =
    useState<BudgetItemCategory>(
      item?.category ?? "MATERIALS",
    );

  const [unit, setUnit] =
    useState(item?.unit ?? "");

  const [quantity, setQuantity] =
    useState(
      item
        ? String(item.planned_quantity)
        : "",
    );

  const [unitCost, setUnitCost] =
    useState(
      item
        ? String(item.estimated_unit_cost)
        : "",
    );

  const [errors, setErrors] =
    useState<
      Record<string, string>
    >({});

  useEffect(() => {
    setItemCode(item?.item_code ?? "");
    setDescription(
      item?.description ?? "",
    );
    setCategory(
      item?.category ?? "MATERIALS",
    );
    setUnit(item?.unit ?? "");
    setQuantity(
      item
        ? String(item.planned_quantity)
        : "",
    );
    setUnitCost(
      item
        ? String(item.estimated_unit_cost)
        : "",
    );
  }, [item]);

  const estimatedTotal =
    useMemo(
      () =>
        calculateItemTotal(
          Number(quantity || 0),
          Number(unitCost || 0),
        ),
      [quantity, unitCost],
    );

  function submit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const nextErrors: Record<
      string,
      string
    > = {};

    if (!itemCode.trim()) {
      nextErrors.itemCode =
        "Item code is required.";
    }

    if (!description.trim()) {
      nextErrors.description =
        "Description is required.";
    }

    if (!unit.trim()) {
      nextErrors.unit =
        "Unit is required.";
    }

    const parsedQuantity =
      Number(quantity);

    const parsedUnitCost =
      Number(unitCost);

    if (
      !Number.isFinite(
        parsedQuantity,
      ) ||
      parsedQuantity <= 0
    ) {
      nextErrors.quantity =
        "Quantity must be greater than zero.";
    }

    if (
      !Number.isFinite(
        parsedUnitCost,
      ) ||
      parsedUnitCost < 0
    ) {
      nextErrors.unitCost =
        "Unit cost cannot be negative.";
    }

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0
    ) {
      return;
    }

    onSubmit({
      item_code: itemCode.trim(),
      description: description.trim(),
      category,
      unit: unit.trim(),
      planned_quantity:
        parsedQuantity,
      estimated_unit_cost:
        parsedUnitCost,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Item Code
          </label>

          <input
            value={itemCode}
            onChange={(e) =>
              setItemCode(e.target.value)
            }
            maxLength={50}
            disabled={loading}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="MAT-001"
          />

          {errors.itemCode && (
            <p className="text-sm text-destructive">
              {errors.itemCode}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as BudgetItemCategory,
              )
            }
            disabled={loading}
            className="w-full rounded-lg border px-3 py-2"
          >
            {BUDGET_CATEGORIES.map(
              (value) => (
                <option
                  key={value}
                  value={value}
                >
                  {
                    BUDGET_CATEGORY_LABELS[
                      value
                    ]
                  }
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Description
        </label>

        <input
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          maxLength={500}
          disabled={loading}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Portland Cement"
        />

        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Unit
          </label>

          <input
            value={unit}
            onChange={(e) =>
              setUnit(e.target.value)
            }
            maxLength={50}
            disabled={loading}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="BAG"
          />

          {errors.unit && (
            <p className="text-sm text-destructive">
              {errors.unit}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Planned Quantity
          </label>

          <input
            type="number"
            min="0.0001"
            step="0.0001"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            disabled={loading}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="500"
          />

          {errors.quantity && (
            <p className="text-sm text-destructive">
              {errors.quantity}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Estimated Unit Cost
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={unitCost}
            onChange={(e) =>
              setUnitCost(e.target.value)
            }
            disabled={loading}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="1450"
          />

          {errors.unitCost && (
            <p className="text-sm text-destructive">
              {errors.unitCost}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          Estimated Total
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {new Intl.NumberFormat(
            undefined,
            {
              style: "currency",
              currency: "PKR",
            },
          ).format(estimatedTotal)}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Calculated as quantity × unit cost.
        </p>
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
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          {loading
            ? "Saving..."
            : item
              ? "Update Item"
              : "Add Item"}
        </button>
      </div>
    </form>
  );
}