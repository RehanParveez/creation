import type {MaterialRequisitionSummary,
} from "../types";
import { formatQuantity } from "../utils";

interface Props {
  summary: MaterialRequisitionSummary;
}

export function MaterialRequisitionSummaryCard({
  summary,
}: Props) {
  const percentage = Number(
    summary.fulfillment_percentage,
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-500">
          Items
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {summary.total_items}
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-500">
          Requested
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {formatQuantity(
            summary.total_requested_quantity,
          )}
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-500">
          Approved
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {formatQuantity(
            summary.total_approved_quantity,
          )}
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-500">
          Fulfillment
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {percentage.toFixed(2)}%
        </p>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{
              width: `${Math.min(
                percentage,
                100,
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}