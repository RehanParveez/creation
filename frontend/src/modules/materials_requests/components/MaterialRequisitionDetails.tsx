import type {MaterialRequisition,
} from "../types";
import { MaterialRequisitionStatusBadge } from "./MaterialRequisitionStatusBadge";
import { MaterialRequisitionPriorityBadge } from "./MaterialRequisitionPriorityBadge";
import { MaterialRequisitionItemsTable } from "./MaterialRequisitionItemsTable";
import { MaterialRequisitionSummaryCard } from "./MaterialRequisitionSummaryCard";
import type {MaterialRequisitionSummary,
} from "../types";

interface Props {
  requisition: MaterialRequisition;

  summary?: MaterialRequisitionSummary;

  editable?: boolean;

  onEditItem?: (
    item: MaterialRequisition["items"][number],
  ) => void;

  onDeleteItem?: (
    item: MaterialRequisition["items"][number],
  ) => void;
}

export function MaterialRequisitionDetails({
  requisition,
  summary,
  editable = false,
  onEditItem,
  onDeleteItem,
}: Props) {
  return (
    <div className="space-y-6">
      {summary && (
        <MaterialRequisitionSummaryCard
          summary={summary}
        />
      )}

      <div className="rounded-lg border bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold">
                {requisition.title}
              </h1>

              <MaterialRequisitionStatusBadge
                status={requisition.status}
              />

              <MaterialRequisitionPriorityBadge
                priority={requisition.priority}
              />
            </div>

            <p className="mt-2 font-mono text-sm text-gray-500">
              {requisition.requisition_number}
            </p>
          </div>
        </div>

        {requisition.description && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-500">
              Description
            </h2>

            <p className="mt-1 whitespace-pre-wrap">
              {requisition.description}
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">
              Needed By
            </p>

            <p className="mt-1 text-sm">
              {requisition.needed_by
                ? new Date(
                    requisition.needed_by,
                  ).toLocaleDateString()
                : "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Requested By
            </p>

            <p className="mt-1 text-sm">
              {requisition.requested_by}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Created
            </p>

            <p className="mt-1 text-sm">
              {new Date(
                requisition.created_at,
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {requisition.rejection_reason && (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">
              Rejection Reason
            </p>

            <p className="mt-1 text-sm text-red-700">
              {requisition.rejection_reason}
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Requested Materials
          </h2>
        </div>

        <MaterialRequisitionItemsTable
          items={requisition.items}
          editable={editable}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
        />
      </div>
    </div>
  );
}