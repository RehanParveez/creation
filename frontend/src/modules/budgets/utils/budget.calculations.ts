import type {BudgetItem, BudgetItemCategory, BudgetStatus,
} from "../types/budget.types";

export const BUDGET_STATUS_LABELS: Record<
  BudgetStatus,
  string
> = {
  DRAFT: "Draft",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const BUDGET_STATUS_DESCRIPTIONS: Record<
  BudgetStatus,
  string
> = {
  DRAFT: "This budget is being prepared.",
  PENDING_APPROVAL:
    "This budget has been submitted and is waiting for approval.",
  APPROVED:
    "This budget has been approved and is locked for editing.",
  REJECTED:
    "This budget was rejected and can be revised and resubmitted.",
};

export const BUDGET_CATEGORY_LABELS: Record<
  BudgetItemCategory,
  string
> = {
  MATERIALS: "Materials",
  LABOUR: "Labour",
  EQUIPMENT: "Equipment",
  SUBCONTRACTOR: "Subcontractor",
  OTHER: "Other",
};

export const BUDGET_CATEGORIES: BudgetItemCategory[] = [
  "MATERIALS",
  "LABOUR",
  "EQUIPMENT",
  "SUBCONTRACTOR",
  "OTHER",
];

export const BUDGET_STATUSES: BudgetStatus[] = [
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
];

export const BUDGET_PERMISSIONS = {
  VIEW: "budget.view",
  MANAGE: "budget.manage",
  APPROVE: "budget.approve",
} as const;

export function toNumber(
  value: string | number | null | undefined,
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

export function calculateEstimatedBudget(
  items: BudgetItem[],
): number {
  return items.reduce(
    (total, item) =>
      total + toNumber(item.estimated_total_cost),
    0,
  );
}

export function calculateItemTotal(
  quantity: string | number | null | undefined,
  unitCost: string | number | null | undefined,
): number {
  return (
    toNumber(quantity) *
    toNumber(unitCost)
  );
}

export function calculateVariance(
  estimated: string | number | null | undefined,
  actual: string | number | null | undefined,
): number {
  return (
    toNumber(actual) -
    toNumber(estimated)
  );
}