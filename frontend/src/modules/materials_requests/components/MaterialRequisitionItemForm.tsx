import {useEffect, useState,
} from "react";
import type {MaterialRequisitionItem, MaterialRequisitionItemCreateInput, MaterialRequisitionItemUpdateInput,
} from "../types";

interface Props {
  item?: MaterialRequisitionItem;

  submitting?: boolean;

  onSubmit: (
    values:
      | MaterialRequisitionItemCreateInput
      | MaterialRequisitionItemUpdateInput,
  ) => void;

  onCancel: () => void;
}

export function MaterialRequisitionItemForm({
  item,
  submitting = false,
  onSubmit,
  onCancel,
}: Props) {
  const [
    itemCode,
    setItemCode,
  ] = useState(item?.item_code ?? "");

  const [
    materialName,
    setMaterialName,
  ] = useState(
    item?.material_name ?? "",
  );

  const [
    description,
    setDescription,
  ] = useState(
    item?.description ?? "",
  );

  const [
    unit,
    setUnit,
  ] = useState(item?.unit ?? "");

  const [
    requestedQuantity,
    setRequestedQuantity,
  ] = useState(
    item
      ? String(item.requested_quantity)
      : "",
  );

  const [
    notes,
    setNotes,
  ] = useState(item?.notes ?? "");

  useEffect(() => {
    setItemCode(item?.item_code ?? "");
    setMaterialName(
      item?.material_name ?? "",
    );
    setDescription(
      item?.description ?? "",
    );
    setUnit(item?.unit ?? "");
    setRequestedQuantity(
      item
        ? String(item.requested_quantity)
        : "",
    );
    setNotes(item?.notes ?? "");
  }, [item]);

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const quantity = Number(
      requestedQuantity,
    );

    if (
      !itemCode.trim() ||
      !materialName.trim() ||
      !unit.trim() ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      return;
    }

    onSubmit({
      item_code: itemCode.trim(),
      material_name: materialName.trim(),
      description:
        description.trim() || null,
      unit: unit.trim(),
      requested_quantity: quantity,
      notes: notes.trim() || null,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Item Code
          </label>

          <input
            value={itemCode}
            onChange={(event) =>
              setItemCode(event.target.value)
            }
            required
            maxLength={50}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Material Name
          </label>

          <input
            value={materialName}
            onChange={(event) =>
              setMaterialName(
                event.target.value,
              )
            }
            required
            maxLength={200}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <input
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value,
            )
          }
          maxLength={500}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Unit
          </label>

          <input
            value={unit}
            onChange={(event) =>
              setUnit(event.target.value)
            }
            required
            maxLength={50}
            placeholder="M, PCS, KG..."
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Requested Quantity
          </label>

          <input
            type="number"
            min="0.0001"
            step="0.0001"
            value={requestedQuantity}
            onChange={(event) =>
              setRequestedQuantity(
                event.target.value,
              )
            }
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Notes
        </label>

        <textarea
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          rows={3}
          className="w-full rounded-md border px-3 py-2"
        />
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
            ? "Saving..."
            : item
              ? "Update Item"
              : "Add Item"}
        </button>
      </div>
    </form>
  );
}