import {useMemo, useState,
} from "react";
import { Link } from "react-router-dom";
import {useMaterialRequisitions,
} from "../hooks";
import { MaterialRequisitionStatusBadge } from "../components/MaterialRequisitionStatusBadge";
import { MaterialRequisitionPriorityBadge } from "../components/MaterialRequisitionPriorityBadge";
import type {MaterialRequisitionStatus,
} from "../types";

interface Props {
  projectId?: string;
}

export function MaterialRequisitionsPage({
  projectId,
}: Props) {
  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    MaterialRequisitionStatus | "ALL"
  >("ALL");

  const query =
    useMaterialRequisitions();

  const filtered = useMemo(() => {
    const requisitions =
      query.data ?? [];

    if (statusFilter === "ALL") {
      return requisitions;
    }

    return requisitions.filter(
      (item) =>
        item.status === statusFilter,
    );
  }, [
    query.data,
    statusFilter,
  ]);

  if (query.isLoading) {
    return (
      <div className="p-6">
        Loading material requisitions...
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load material
          requisitions.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Material Requisitions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage project material requests,
            approvals, and fulfillment.
          </p>
        </div>

        {projectId && (
          <Link
            to={`/projects/${projectId}/material-requisitions/new`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            New Requisition
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          "ALL",
          "DRAFT",
          "SUBMITTED",
          "APPROVED",
          "REJECTED",
          "PARTIALLY_FULFILLED",
          "FULFILLED",
          "CANCELLED",
        ].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() =>
              setStatusFilter(
                status as
                  | MaterialRequisitionStatus
                  | "ALL",
              )
            }
            className={`rounded-md px-3 py-2 text-sm ${
              statusFilter === status
                ? "bg-gray-900 text-white"
                : "border bg-white"
            }`}
          >
            {status === "ALL"
              ? "All"
              : status
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(
                 /\b\w/g,
                 (char: string) =>
                  char.toUpperCase(),
                )}
          </button>
        ))}
      </div>

      {!filtered.length ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-gray-500">
            No material requisitions found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase">
                  Requisition
                </th>

                <th className="px-4 py-3 text-left text-xs uppercase">
                  Priority
                </th>

                <th className="px-4 py-3 text-left text-xs uppercase">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-xs uppercase">
                  Items
                </th>

                <th className="px-4 py-3 text-left text-xs uppercase">
                  Needed By
                </th>

                <th className="px-4 py-3 text-right text-xs uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y bg-white">
              {filtered.map(
                (requisition) => (
                  <tr
                    key={requisition.id}
                  >
                    <td className="px-4 py-4">
                      <Link
                        to={
                          projectId
                            ? `/projects/${projectId}/material-requisitions/${requisition.id}`
                            : `/material-requisitions/${requisition.id}`
                        }
                        className="font-medium text-blue-600"
                      >
                        {
                          requisition.title
                        }
                      </Link>

                      <p className="mt-1 font-mono text-xs text-gray-500">
                        {
                          requisition.requisition_number
                        }
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <MaterialRequisitionPriorityBadge
                        priority={
                          requisition.priority
                        }
                      />
                    </td>

                    <td className="px-4 py-4">
                      <MaterialRequisitionStatusBadge
                        status={
                          requisition.status
                        }
                      />
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {
                        requisition.items
                          .length
                      }
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {requisition.needed_by
                        ? new Date(
                            requisition.needed_by,
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <Link
                        to={
                          projectId
                            ? `/projects/${projectId}/material-requisitions/${requisition.id}`
                            : `/material-requisitions/${requisition.id}`
                        }
                        className="text-sm text-blue-600"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}