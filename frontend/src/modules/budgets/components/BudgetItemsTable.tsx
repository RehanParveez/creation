import type {BudgetItem,
} from "../types/budget.types";
import {BUDGET_CATEGORY_LABELS,
} from "../utils/budget.constants";
import {calculateVariance, toNumber,
} from "../utils/budget.calculations";

interface Props {
  items: BudgetItem[];

  editable?: boolean;

  onEdit?: (
    item: BudgetItem,
  ) => void;

  onDelete?: (
    item: BudgetItem,
  ) => void;
}

function money(value: string | number) {
  return new Intl.NumberFormat(
    undefined,
    {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 2,
    },
  ).format(toNumber(value));
}

export function BudgetItemsTable({
  items,
  editable = false,
  onEdit,
  onDelete,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">
          No budget items yet
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Add the first BOQ item to this budget.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-4 py-3 text-left">
                Code
              </th>

              <th className="px-4 py-3 text-left">
                Description
              </th>

              <th className="px-4 py-3 text-left">
                Category
              </th>

              <th className="px-4 py-3 text-right">
                Qty
              </th>

              <th className="px-4 py-3 text-right">
                Unit Cost
              </th>

              <th className="px-4 py-3 text-right">
                Estimated
              </th>

              <th className="px-4 py-3 text-right">
                Actual
              </th>

              <th className="px-4 py-3 text-right">
                Variance
              </th>

              {editable && (
                <th className="px-4 py-3 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const variance =
                calculateVariance(
                  item.estimated_total_cost,
                  item.actual_cost,
                );

              return (
                <tr
                  key={item.id}
                  className="border-b last:border-0"
                >
                  <td className="px-4 py-3 font-medium">
                    {item.item_code}
                  </td>

                  <td className="px-4 py-3">
                    {item.description}
                  </td>

                  <td className="px-4 py-3">
                    {
                      BUDGET_CATEGORY_LABELS[
                        item.category
                      ]
                    }
                  </td>

                  <td className="px-4 py-3 text-right">
                    {toNumber(
                      item.planned_quantity,
                    ).toLocaleString()}
                    {" "}
                    {item.unit}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {money(
                      item.estimated_unit_cost,
                    )}
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    {money(
                      item.estimated_total_cost,
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {money(
                      item.actual_cost,
                    )}
                  </td>

                  <td
                    className={[
                      "px-4 py-3 text-right",
                      variance > 0
                        ? "text-destructive"
                        : variance < 0
                          ? "text-emerald-600"
                          : "",
                    ].join(" ")}
                  >
                    {money(variance)}
                  </td>

                  {editable && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() =>
                              onEdit(item)
                            }
                            className="rounded-md border px-3 py-1.5"
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
                            className="rounded-md border border-destructive/30 px-3 py-1.5 text-destructive"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}