import {useEffect, useState,
} from "react";
import type {MaterialRequisition, MaterialRequisitionFulfillInput,
} from "../types";
import {getRemainingQuantity,
} from "../utils";

interface Props {
  requisition: MaterialRequisition;

  submitting?: boolean;

  onSubmit: (
    input: MaterialRequisitionFulfillInput,
  ) => void;

  onCancel: () => void;
}

export function MaterialRequisitionFulfillmentDialog({
  requisition,
  submitting = false,
  onSubmit,
  onCancel,
}: Props) {
  const [
    quantities,
    setQuantities,
  ] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const initial: Record<
      string,
      string
    > = {};

    for (const item of requisition.items) {
      initial[item.id] = "";
    }

    setQuantities(initial);
  }, [requisition]);

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const items = requisition.items
      .map((item) => ({
        item_id: item.id,
        fulfilled_quantity:
          Number(quantities[item.id]) || 0,
      }))
      .filter(
        (item) =>
          item.fulfilled_quantity > 0,
      );

    if (!items.length) {
      return;
    }

    onSubmit({ items });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <h3 className="text-lg font-semibold">
          Fulfill Material Requisition
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Enter the quantity being delivered
          now. Partial fulfillment is supported.
        </p>
      </div>

      <div className="max-h-[60vh] overflow-y-auto rounded-lg border">
        {requisition.items.map((item) => {
          const remaining =
            getRemainingQuantity(item);

          if (remaining <= 0) {
            return null;
          }

          return (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-3 border-b p-4 last:border-b-0 md:grid-cols-3"
            >
              <div>
                <p className="font-medium">
                  {item.material_name}
                </p>

                <p className="text-xs text-gray-500">
                  {item.item_code}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Remaining
                </p>

                <p>
                  {remaining}{" "}
                  {item.unit}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  Fulfill Now
                </label>

                <input
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  max={remaining}
                  value={
                    quantities[item.id] ??
                    ""
                  }
                  onChange={(event) =>
                    setQuantities(
                      (current) => ({
                        ...current,
                        [item.id]:
                          event.target.value,
                      }),
                    )
                  }
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>
          );
        })}
      </div>

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
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting
            ? "Processing..."
            : "Record Fulfillment"}
        </button>
      </div>
    </form>
  );
}