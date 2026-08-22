import type {MaterialRequisitionItem,
} from "../types";
import {formatQuantity, getRemainingQuantity,
} from "../utils";

interface Props {
  items: MaterialRequisitionItem[];

  editable?: boolean;

  onEdit?: (
    item: MaterialRequisitionItem,
  ) => void;

  onDelete?: (
    item: MaterialRequisitionItem,
  ) => void;
}

export function MaterialRequisitionItemsTable({
  items,
  editable = false,
  onEdit,
  onDelete,
}: Props) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
        No material items have been added.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase">
              Code
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase">
              Material
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase">
              Unit
            </th>

            <th className="px-4 py-3 text-right text-xs font-medium uppercase">
              Requested
            </th>

            <th className="px-4 py-3 text-right text-xs font-medium uppercase">
              Approved
            </th>

            <th className="px-4 py-3 text-right text-xs font-medium uppercase">
              Fulfilled
            </th>

            <th className="px-4 py-3 text-right text-xs font-medium uppercase">
              Remaining
            </th>

            {editable && (
              <th className="px-4 py-3 text-right text-xs font-medium uppercase">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y bg-white">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-sm font-medium">
                {item.item_code}
              </td>

              <td className="px-4 py-3">
                <div className="text-sm font-medium">
                  {item.material_name}
                </div>

                {item.description && (
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                )}
              </td>

              <td className="px-4 py-3 text-sm">
                {item.unit}
              </td>

              <td className="px-4 py-3 text-right text-sm">
                {formatQuantity(
                  item.requested_quantity,
                )}
              </td>

              <td className="px-4 py-3 text-right text-sm">
                {formatQuantity(
                  item.approved_quantity,
                )}
              </td>

              <td className="px-4 py-3 text-right text-sm">
                {formatQuantity(
                  item.fulfilled_quantity,
                )}
              </td>

              <td className="px-4 py-3 text-right text-sm font-medium">
                {formatQuantity(
                  getRemainingQuantity(item),
                )}
              </td>

              {editable && (
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(item)
                        }
                        className="text-sm text-blue-600"
                      >
                        Edit
                      </button>
                    )}

                    {onDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(item)
                        }
                        className="text-sm text-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}