import type {MaterialRequisition, MaterialRequisitionItem, MaterialRequisitionStatus,
} from "./types";

export function quantity(
  value: string | number | null | undefined,
): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

export function formatQuantity(
  value: string | number,
): string {
  return quantity(value).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 4,
    },
  );
}

export function getRemainingQuantity(
  item: MaterialRequisitionItem,
): number {
  return Math.max(
    quantity(item.approved_quantity) -
      quantity(item.fulfilled_quantity),
    0,
  );
}

export function getApprovalRemainingQuantity(
  item: MaterialRequisitionItem,
): number {
  return Math.max(
    quantity(item.requested_quantity) -
      quantity(item.approved_quantity),
    0,
  );
}

export function canEditRequisition(
  requisition: MaterialRequisition,
): boolean {
  return (
    requisition.status === "DRAFT" ||
    requisition.status === "REJECTED"
  );
}

export function canSubmitRequisition(
  requisition: MaterialRequisition,
): boolean {
  return (
    (
      requisition.status === "DRAFT" ||
      requisition.status === "REJECTED"
    ) &&
    requisition.items.length > 0
  );
}

export function canApproveRequisition(
  requisition: MaterialRequisition,
): boolean {
  return requisition.status === "SUBMITTED";
}

export function canRejectRequisition(
  requisition: MaterialRequisition,
): boolean {
  return requisition.status === "SUBMITTED";
}

export function canFulfillRequisition(
  requisition: MaterialRequisition,
): boolean {
  return (
    requisition.status === "APPROVED" ||
    requisition.status ===
      "PARTIALLY_FULFILLED"
  );
}

export function canCancelRequisition(
  requisition: MaterialRequisition,
): boolean {
  return (
    requisition.status !== "FULFILLED" &&
    requisition.status !== "CANCELLED"
  );
}

export function canDeleteRequisition(
  requisition: MaterialRequisition,
): boolean {
  return canEditRequisition(requisition);
}

export function statusLabel(
  status: MaterialRequisitionStatus,
): string {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "SUBMITTED":
      return "Submitted";

    case "APPROVED":
      return "Approved";

    case "REJECTED":
      return "Rejected";

    case "PARTIALLY_FULFILLED":
      return "Partially Fulfilled";

    case "FULFILLED":
      return "Fulfilled";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}

export function priorityLabel(
  priority: MaterialRequisition["priority"],
): string {
  return (
    priority.charAt(0) +
    priority.slice(1).toLowerCase()
  );
}

export function calculateLocalFulfillmentPercentage(
  requisition: MaterialRequisition,
): number {
  const approved = requisition.items.reduce(
    (total, item) =>
      total +
      quantity(item.approved_quantity),
    0,
  );

  if (approved <= 0) {
    return 0;
  }

  const fulfilled =
    requisition.items.reduce(
      (total, item) =>
        total +
        quantity(item.fulfilled_quantity),
      0,
    );

  return Math.min(
    100,
    (fulfilled / approved) * 100,
  );
}