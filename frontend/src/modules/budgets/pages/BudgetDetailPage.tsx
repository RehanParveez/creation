import {useState,
} from "react";
import {useNavigate, useParams,
} from "react-router-dom";
import {useApproveBudget, useBudget, useCreateBudgetItem, useDeleteBudget, useDeleteBudgetItem, useRejectBudget, useSubmitBudget, useUpdateBudget, useUpdateBudgetItem,
} from "../hooks";
import { BudgetStatusBadge } from "../components/BudgetStatusBadge";
import { BudgetItemForm } from "../components/BudgetItemForm";
import {calculateEstimatedBudget,
} from "../utils/budget.calculations";
import type {BudgetItem, BudgetItemCreateInput, BudgetItemUpdateInput, BudgetUpdateInput,
} from "../types/budget.types";
import { useAuthStore } from "@/app/store";

export function BudgetDetailPage() {
  const {
    budgetId,
  } = useParams<{
    budgetId: string;
  }>();

  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user,
  );

  const permissions =
    user?.permissions ?? [];

  const budgetQuery = useBudget(
    budgetId ?? "",
  );

  const updateBudget =
    useUpdateBudget();

  const deleteBudget =
    useDeleteBudget();

  const submitBudget =
    useSubmitBudget();

  const approveBudget =
    useApproveBudget();

  const rejectBudget =
    useRejectBudget();

  const createBudgetItem =
    useCreateBudgetItem();

  const updateBudgetItem =
    useUpdateBudgetItem();

  const deleteBudgetItem =
    useDeleteBudgetItem();

  const [
    editBudgetOpen,
    setEditBudgetOpen,
  ] = useState(false);

  const [
    editBudgetName,
    setEditBudgetName,
  ] = useState("");

  const [
    editBudgetDescription,
    setEditBudgetDescription,
  ] = useState("");

  const [
    editBudgetErrors,
    setEditBudgetErrors,
  ] = useState<
    Record<string, string>
  >({});

  const [
    itemFormOpen,
    setItemFormOpen,
  ] = useState(false);

  const [
    editingItem,
    setEditingItem,
  ] = useState<BudgetItem | undefined>();

  const [
    rejectOpen,
    setRejectOpen,
  ] = useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  /*
   * ---------------------------------------------------------
   * Loading
   * ---------------------------------------------------------
   */

  if (budgetQuery.isLoading) {
    return (
      <div className="p-6">
        Loading budget...
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * Error
   * ---------------------------------------------------------
   */

  if (budgetQuery.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8">
          <h2 className="font-semibold">
            Unable to load budget
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The budget could not be loaded.
          </p>

          <button
            type="button"
            onClick={() =>
              budgetQuery.refetch()
            }
            className="mt-4 rounded-lg border px-4 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * Capture query data once.
   *
   * This is important for TypeScript narrowing.
   * After the guard below, `budget` is guaranteed to exist.
   * ---------------------------------------------------------
   */

  const budgetData =
    budgetQuery.data;

  if (!budgetData) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-dashed p-8">
          <h2 className="font-semibold">
            Budget not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The requested budget does not exist
            or is no longer available.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/budgets")
            }
            className="mt-4 rounded-lg border px-4 py-2"
          >
            Back to Budgets
          </button>
        </div>
      </div>
    );
  }

  /*
   * From this point onward TypeScript knows that
   * `budget` cannot be undefined.
   */

  const budget =
    budgetData;

  /*
   * ---------------------------------------------------------
   * Budget calculations
   * ---------------------------------------------------------
   */

  const items =
    budget.items ?? [];

  const estimatedBudget =
    calculateEstimatedBudget(items);

  const actualCost =
    items.reduce(
      (total, item) =>
        total +
        Number(
          item.actual_cost ?? 0,
        ),
      0,
    );

  /*
   * Committed cost is currently not represented
   * by the budget item model.
   *
   * Keep this as zero until commitment logic is
   * introduced into the backend/frontend.
   */
  const committedCost = 0;

  /*
   * Approved budget is the estimated budget once
   * the budget reaches APPROVED status.
   */
  const approvedBudget =
    budget.status === "APPROVED"
      ? estimatedBudget
      : 0;

  const remainingBudget =
    approvedBudget -
    actualCost -
    committedCost;

  const usagePercentage =
    approvedBudget > 0
      ? (
          (actualCost +
            committedCost) /
          approvedBudget
        ) * 100
      : 0;

  /*
   * ---------------------------------------------------------
   * Permissions
   * ---------------------------------------------------------
   */

  const canView =
    permissions.includes(
      "budget.view",
    );

  const canManage =
    permissions.includes(
      "budget.manage",
    );

  const canApprove =
    permissions.includes(
      "budget.approve",
    );

  const editable =
    budget.status === "DRAFT" ||
    budget.status === "REJECTED";

  const pendingApproval =
    budget.status ===
    "PENDING_APPROVAL";

  const canEdit =
    canManage &&
    editable;

  const canDelete =
    canManage &&
    editable;

  const canSubmit =
    canManage &&
    editable &&
    items.length > 0;

  const canApproveOrReject =
    canApprove &&
    pendingApproval;

  /*
   * If the user somehow reaches this page without
   * the view permission, don't expose the budget.
   *
   * This is only a frontend UX guard.
   * The backend must still enforce authorization.
   */
  if (!canView) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8">
          <h2 className="font-semibold">
            Access denied
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to view
            this budget.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/budgets")
            }
            className="mt-4 rounded-lg border px-4 py-2"
          >
            Back to Budgets
          </button>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * Budget actions
   * ---------------------------------------------------------
   */

  function openEditBudget() {
    setEditBudgetName(
      budget.name,
    );

    setEditBudgetDescription(
      budget.description ?? "",
    );

    setEditBudgetErrors({});

    setEditBudgetOpen(true);
  }

  function handleUpdateBudget() {
    const name =
      editBudgetName.trim();

    const description =
      editBudgetDescription.trim();

    const nextErrors: Record<
      string,
      string
    > = {};

    if (!name) {
      nextErrors.name =
        "Budget name is required.";
    }

    if (name.length > 200) {
      nextErrors.name =
        "Budget name cannot exceed 200 characters.";
    }

    if (description.length > 2000) {
      nextErrors.description =
        "Description cannot exceed 2000 characters.";
    }

    setEditBudgetErrors(
      nextErrors,
    );

    if (
      Object.keys(nextErrors).length > 0
    ) {
      return;
    }

    const payload: BudgetUpdateInput = {
      name,
      description:
        description || null,
    };

    updateBudget.mutate(
      {
        budgetId: budget.id,
        payload,
      },
      {
        onSuccess: () => {
          setEditBudgetOpen(false);
          setEditBudgetErrors({});
        },
      },
    );
  }

  function handleDeleteBudget() {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this budget?",
      );

    if (!confirmed) {
      return;
    }

    deleteBudget.mutate(
      budget.id,
      {
        onSuccess: () => {
          navigate("/budgets");
        },
      },
    );
  }

  function handleSubmitBudget() {
    submitBudget.mutate(
      budget.id,
    );
  }

  function handleApproveBudget() {
    const confirmed =
      window.confirm(
        "Approve this budget? Once approved, it will be locked for editing.",
      );

    if (!confirmed) {
      return;
    }

    approveBudget.mutate(
      budget.id,
    );
  }

  function handleRejectBudget() {
    const reason =
      rejectionReason.trim();

    if (!reason) {
      return;
    }

    rejectBudget.mutate(
      {
        budgetId: budget.id,
        reason,
      },
      {
        onSuccess: () => {
          setRejectOpen(false);
          setRejectionReason("");
        },
      },
    );
  }

  /*
   * ---------------------------------------------------------
   * Budget item actions
   * ---------------------------------------------------------
   */

  function handleItemSubmit(
    values:
      | BudgetItemCreateInput
      | BudgetItemUpdateInput,
  ) {
    /*
     * Existing item
     */
    if (editingItem) {
      const payload: BudgetItemUpdateInput =
        {
          ...(values.item_code !==
            undefined && {
            item_code:
              values.item_code,
          }),

          ...(values.description !==
            undefined && {
            description:
              values.description,
          }),

          ...(values.category !==
            undefined && {
            category:
              values.category,
          }),

          ...(values.unit !==
            undefined && {
            unit:
              values.unit,
          }),

          ...(values.planned_quantity !==
            undefined && {
            planned_quantity:
              values.planned_quantity,
          }),

          ...(values.estimated_unit_cost !==
            undefined && {
            estimated_unit_cost:
              values.estimated_unit_cost,
          }),
        };

      updateBudgetItem.mutate(
        {
          budgetId: budget.id,
          itemId: editingItem.id,
          payload,
        },
        {
          onSuccess: () => {
            setEditingItem(
              undefined,
            );

            setItemFormOpen(
              false,
            );
          },
        },
      );

      return;
    }

    /*
     * New item validation
     */

    if (
      values.item_code ===
        undefined ||
      !values.item_code.trim()
    ) {
      return;
    }

    if (
      values.description ===
        undefined ||
      !values.description.trim()
    ) {
      return;
    }

    if (
      values.category ===
        undefined
    ) {
      return;
    }

    if (
      values.unit ===
        undefined ||
      !values.unit.trim()
    ) {
      return;
    }

    if (
      values.planned_quantity ===
      undefined
    ) {
      return;
    }

    if (
      values.estimated_unit_cost ===
      undefined
    ) {
      return;
    }

    const payload:
      BudgetItemCreateInput =
      {
        item_code:
          values.item_code.trim(),

        description:
          values.description.trim(),

        category:
          values.category,

        unit:
          values.unit.trim(),

        planned_quantity:
          values.planned_quantity,

        estimated_unit_cost:
          values.estimated_unit_cost,
      };

    createBudgetItem.mutate(
      {
        budgetId: budget.id,
        payload,
      },
      {
        onSuccess: () => {
          setItemFormOpen(
            false,
          );
        },
      },
    );
  }

  function handleDeleteItem(
    itemId: string,
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this budget item?",
      );

    if (!confirmed) {
      return;
    }

    deleteBudgetItem.mutate({
      budgetId: budget.id,
      itemId,
    });
  }

  function openCreateItem() {
    setEditingItem(
      undefined,
    );

    setItemFormOpen(true);
  }

  function openEditItem(
    item: BudgetItem,
  ) {
    setEditingItem(item);
    setItemFormOpen(true);
  }

  /*
   * ---------------------------------------------------------
   * Currency
   * ---------------------------------------------------------
   */

  const currencyFormatter =
    new Intl.NumberFormat(
      undefined,
      {
        style: "currency",
        currency: "PKR",
      },
    );

  /*
   * ---------------------------------------------------------
   * Render
   * ---------------------------------------------------------
   */

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate("/budgets")
            }
            className="mb-3 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Budgets
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">
              {budget.name}
            </h1>

            <BudgetStatusBadge
              status={
                budget.status
              }
            />
          </div>

          {budget.description && (
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {budget.description}
            </p>
          )}

          <p className="mt-2 font-mono text-xs text-muted-foreground">
            Project:{" "}
            {budget.project_id}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          {canEdit && (
            <button
              type="button"
              onClick={
                openEditBudget
              }
              className="rounded-lg border px-4 py-2"
            >
              Edit Budget
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={
                handleDeleteBudget
              }
              disabled={
                deleteBudget.isPending
              }
              className="rounded-lg border border-destructive/30 px-4 py-2 text-destructive"
            >
              {deleteBudget.isPending
                ? "Deleting..."
                : "Delete"}
            </button>
          )}

          {canSubmit && (
            <button
              type="button"
              onClick={
                handleSubmitBudget
              }
              disabled={
                submitBudget.isPending
              }
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            >
              {submitBudget.isPending
                ? "Submitting..."
                : "Submit for Approval"}
            </button>
          )}

          {canApproveOrReject && (
            <>
              <button
                type="button"
                onClick={
                  handleApproveBudget
                }
                disabled={
                  approveBudget.isPending
                }
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
              >
                {approveBudget.isPending
                  ? "Approving..."
                  : "Approve"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setRejectOpen(true)
                }
                disabled={
                  rejectBudget.isPending
                }
                className="rounded-lg border px-4 py-2"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Estimated Budget
          </p>

          <p className="mt-2 text-xl font-semibold">
            {currencyFormatter.format(
              estimatedBudget,
            )}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Approved Budget
          </p>

          <p className="mt-2 text-xl font-semibold">
            {currencyFormatter.format(
              approvedBudget,
            )}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Actual Cost
          </p>

          <p className="mt-2 text-xl font-semibold">
            {currencyFormatter.format(
              actualCost,
            )}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Remaining Budget
          </p>

          <p className="mt-2 text-xl font-semibold">
            {currencyFormatter.format(
              remainingBudget,
            )}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Usage
          </p>

          <p className="mt-2 text-xl font-semibold">
            {usagePercentage.toFixed(1)}%
          </p>
        </div>

      </div>

      {/* Budget Items */}

      <section className="overflow-hidden rounded-xl border">

        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="font-semibold">
              Budget Items
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}
            </p>
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={
                openCreateItem
              }
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            >
              Add Item
            </button>
          )}

        </div>

        {items.length === 0 ? (
          <div className="p-10 text-center">

            <h3 className="font-semibold">
              No budget items
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Add items to define the budget.
            </p>

            {canEdit && (
              <button
                type="button"
                onClick={
                  openCreateItem
                }
                className="mt-4 rounded-lg border px-4 py-2"
              >
                Add First Item
              </button>
            )}

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px] text-sm">

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
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right">
                    Unit Cost
                  </th>

                  <th className="px-4 py-3 text-right">
                    Estimated Total
                  </th>

                  <th className="px-4 py-3 text-right">
                    Actual Cost
                  </th>

                  {canEdit && (
                    <th className="px-4 py-3" />
                  )}

                </tr>
              </thead>

              <tbody>

                {items.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >

                      <td className="px-4 py-4 font-mono text-xs">
                        {item.item_code}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium">
                          {item.description}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          {item.unit}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {item.category}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {Number(
                          item.planned_quantity,
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {currencyFormatter.format(
                          Number(
                            item.estimated_unit_cost,
                          ),
                        )}
                      </td>

                      <td className="px-4 py-4 text-right font-medium">
                        {currencyFormatter.format(
                          Number(
                            item.estimated_total_cost,
                          ),
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {currencyFormatter.format(
                          Number(
                            item.actual_cost ?? 0,
                          ),
                        )}
                      </td>

                      {canEdit && (
                        <td className="px-4 py-4 text-right">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                openEditItem(
                                  item,
                                )
                              }
                              className="rounded-lg border px-3 py-1.5"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteItem(
                                  item.id,
                                )
                              }
                              disabled={
                                deleteBudgetItem.isPending
                              }
                              className="rounded-lg border border-destructive/30 px-3 py-1.5 text-destructive"
                            >
                              Delete
                            </button>

                          </div>

                        </td>
                      )}

                    </tr>
                  ),
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* Edit Budget Modal */}

      {editBudgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-xl">

            <div className="mb-5">

              <h2 className="text-lg font-semibold">
                Edit Budget
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Update the budget information.
              </p>

            </div>

            <div className="space-y-5">

              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Budget Name
                </label>

                <input
                  value={
                    editBudgetName
                  }
                  onChange={(event) =>
                    setEditBudgetName(
                      event.target.value,
                    )
                  }
                  disabled={
                    updateBudget.isPending
                  }
                  maxLength={200}
                  className="w-full rounded-lg border px-3 py-2"
                />

                {editBudgetErrors.name && (
                  <p className="text-sm text-destructive">
                    {
                      editBudgetErrors.name
                    }
                  </p>
                )}

              </div>

              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={
                    editBudgetDescription
                  }
                  onChange={(event) =>
                    setEditBudgetDescription(
                      event.target.value,
                    )
                  }
                  disabled={
                    updateBudget.isPending
                  }
                  maxLength={2000}
                  rows={5}
                  className="w-full rounded-lg border px-3 py-2"
                />

                {editBudgetErrors.description && (
                  <p className="text-sm text-destructive">
                    {
                      editBudgetErrors.description
                    }
                  </p>
                )}

              </div>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setEditBudgetOpen(
                      false,
                    );

                    setEditBudgetErrors(
                      {},
                    );
                  }}
                  disabled={
                    updateBudget.isPending
                  }
                  className="rounded-lg border px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleUpdateBudget
                  }
                  disabled={
                    updateBudget.isPending
                  }
                  className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                  {updateBudget.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Budget Item Modal */}

      {itemFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">

          <div className="w-full max-w-3xl rounded-2xl border bg-background p-6 shadow-xl">

            <div className="mb-5">

              <h2 className="text-lg font-semibold">
                {editingItem
                  ? "Edit Budget Item"
                  : "Add Budget Item"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Enter the planned quantity and estimated unit cost.
              </p>

            </div>

            <BudgetItemForm
              item={
                editingItem
              }
              loading={
                createBudgetItem.isPending ||
                updateBudgetItem.isPending
              }
              onSubmit={
                handleItemSubmit
              }
              onCancel={() => {
                setItemFormOpen(
                  false,
                );

                setEditingItem(
                  undefined,
                );
              }}
            />

          </div>

        </div>
      )}

      {/* Reject Modal */}

      {rejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-xl">

            <h2 className="text-lg font-semibold">
              Reject Budget
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Provide a reason for rejecting this budget.
            </p>

            <textarea
              value={
                rejectionReason
              }
              onChange={(event) =>
                setRejectionReason(
                  event.target.value,
                )
              }
              rows={5}
              className="mt-5 w-full rounded-lg border px-3 py-2"
              placeholder="Enter rejection reason..."
            />

            <div className="mt-5 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  setRejectOpen(
                    false,
                  );

                  setRejectionReason(
                    "",
                  );
                }}
                disabled={
                  rejectBudget.isPending
                }
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleRejectBudget
                }
                disabled={
                  rejectBudget.isPending ||
                  !rejectionReason.trim()
                }
                className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground"
              >
                {rejectBudget.isPending
                  ? "Rejecting..."
                  : "Reject Budget"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}