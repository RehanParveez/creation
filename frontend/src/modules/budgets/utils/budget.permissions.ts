import type {Budget,
} from "../types/budget.types";

export interface BudgetPermissionState {
  canView: boolean;
  canManage: boolean;
  canApprove: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canSubmit: boolean;
  canApproveOrReject: boolean;
}

export function getBudgetPermissionState(
  budget: Budget,
  permissions: string[],
): BudgetPermissionState {
  const canView =
    permissions.includes("budget.view");

  const canManage =
    permissions.includes("budget.manage");

  const canApprove =
    permissions.includes("budget.approve");

  const editable =
    budget.status === "DRAFT" ||
    budget.status === "REJECTED";

  const pendingApproval =
    budget.status === "PENDING_APPROVAL";

  return {
    canView,
    canManage,
    canApprove,

    canEdit:
      canManage && editable,

    canDelete:
      canManage && editable,

    canSubmit:
      canManage &&
      editable &&
      budget.items.length > 0,

    canApproveOrReject:
      canApprove && pendingApproval,
  };
}