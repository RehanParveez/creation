import type {MaterialRequisition,
} from "../types";
import {canApproveRequisition, canCancelRequisition, canDeleteRequisition, canEditRequisition, canFulfillRequisition, canRejectRequisition, canSubmitRequisition,
} from "../utils";

interface Props {
  requisition: MaterialRequisition;

  canUpdate: boolean;
  canDelete: boolean;
  canSubmit: boolean;
  canApprove: boolean;
  canReject: boolean;
  canFulfill: boolean;
  canCancel: boolean;

  loading?: boolean;

  onEdit?: () => void;
  onDelete?: () => void;
  onSubmit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onFulfill?: () => void;
  onCancel?: () => void;
}

export function MaterialRequisitionActions({
  requisition,

  canUpdate,
  canDelete,
  canSubmit,
  canApprove,
  canReject,
  canFulfill,
  canCancel,

  loading = false,

  onEdit,
  onDelete,
  onSubmit,
  onApprove,
  onReject,
  onFulfill,
  onCancel,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {canUpdate &&
        canEditRequisition(
          requisition,
        ) &&
        onEdit && (
          <button
            type="button"
            disabled={loading}
            onClick={onEdit}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Edit
          </button>
        )}

      {canDelete &&
        canDeleteRequisition(
          requisition,
        ) &&
        onDelete && (
          <button
            type="button"
            disabled={loading}
            onClick={onDelete}
            className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600"
          >
            Delete
          </button>
        )}

      {canSubmit &&
        canSubmitRequisition(
          requisition,
        ) &&
        onSubmit && (
          <button
            type="button"
            disabled={loading}
            onClick={onSubmit}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white"
          >
            Submit
          </button>
        )}

      {canApprove &&
        canApproveRequisition(
          requisition,
        ) &&
        onApprove && (
          <button
            type="button"
            disabled={loading}
            onClick={onApprove}
            className="rounded-md bg-green-600 px-3 py-2 text-sm text-white"
          >
            Approve
          </button>
        )}

      {canReject &&
        canRejectRequisition(
          requisition,
        ) &&
        onReject && (
          <button
            type="button"
            disabled={loading}
            onClick={onReject}
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
          >
            Reject
          </button>
        )}

      {canFulfill &&
        canFulfillRequisition(
          requisition,
        ) &&
        onFulfill && (
          <button
            type="button"
            disabled={loading}
            onClick={onFulfill}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white"
          >
            Fulfill
          </button>
        )}

      {canCancel &&
        canCancelRequisition(
          requisition,
        ) &&
        onCancel && (
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-md border border-orange-200 px-3 py-2 text-sm text-orange-600"
          >
            Cancel Requisition
          </button>
        )}
    </div>
  );
}