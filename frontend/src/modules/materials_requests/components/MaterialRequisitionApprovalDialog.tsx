import {useEffect, useState,
} from "react";
import type {MaterialRequisition, MaterialRequisitionApproveInput,
} from "../types";
import {quantity,
} from "../utils";

interface Props {
  requisition: MaterialRequisition;

  submitting?: boolean;

  onSubmit: (
    input: MaterialRequisitionApproveInput,
  ) => void;

  onCancel: () => void;
}

export function MaterialRequisitionApprovalDialog({
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
      initial[item.id] = String(
        quantity(
          item.requested_quantity,
        ),
      );
    }

    setQuantities(initial);
  }, [requisition]);

  function updateQuantity(
    itemId: string,
    value: string,
  ) {
    setQuantities((current) => ({
      ...current,
      [itemId]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const items =
      requisition.items.map((item) => ({
        item_id: item.id,
        approved_quantity:
          Number(quantities[item.id]) || 0,
      }));

    onSubmit({ items });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <h3 className="text-lg font-semibold">
          Approve Material Requisition
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Set the quantity approved for
          each requested material.
        </p>
      </div>

      <div className="max-h-[60vh] overflow-y-auto rounded-lg border">
        {requisition.items.map((item) => (
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
                Requested
              </p>

              <p>
                {quantity(
                  item.requested_quantity,
                )}{" "}
                {item.unit}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Approved Quantity
              </label>

              <input
                type="number"
                min="0"
                step="0.0001"
                max={Number(
                  item.requested_quantity,
                )}
                value={
                  quantities[item.id] ?? ""
                }
                onChange={(event) =>
                  updateQuantity(
                    item.id,
                    event.target.value,
                  )
                }
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>
        ))}
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
          className="rounded-md bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting
            ? "Approving..."
            : "Approve Requisition"}
        </button>
      </div>
    </form>
  );
}