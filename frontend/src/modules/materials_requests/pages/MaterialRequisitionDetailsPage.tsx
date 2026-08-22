import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {useMaterialRequisition, useMaterialRequisitionSummary, useUpdateMaterialRequisition, useDeleteMaterialRequisition, useCreateMaterialRequisitionItem, useUpdateMaterialRequisitionItem,
  useDeleteMaterialRequisitionItem, useSubmitMaterialRequisition, useApproveMaterialRequisition, useRejectMaterialRequisition, useFulfillMaterialRequisition, useCancelMaterialRequisition,
} from "../hooks";
import { MaterialRequisitionDetails } from "../components/MaterialRequisitionDetails";
import { MaterialRequisitionActions } from "../components/MaterialRequisitionActions";
import { MaterialRequisitionForm } from "../components/MaterialRequisitionForm";
import { MaterialRequisitionItemForm } from "../components/MaterialRequisitionItemForm";
import { MaterialRequisitionApprovalDialog } from "../components/MaterialRequisitionApprovalDialog";
import { MaterialRequisitionRejectionDialog } from "../components/MaterialRequisitionRejectionDialog";
import { MaterialRequisitionFulfillmentDialog } from "../components/MaterialRequisitionFulfillmentDialog";
import {canEditRequisition,
} from "../utils";
import {MATERIAL_REQUISITION_PERMISSIONS,
} from "../permissions";
import {useAuthStore,
} from "@/app/store";
import type {MaterialRequisitionItem, MaterialRequisitionItemCreateInput, MaterialRequisitionItemUpdateInput, MaterialRequisitionUpdateInput,
} from "../types";

export function MaterialRequisitionDetailsPage() {
  const navigate = useNavigate();

  const {
    requisitionId,
  } = useParams<{
    requisitionId: string;
  }>();

  const user = useAuthStore(
    (state) => state.user,
  );

  const permissions =
    user?.permissions ?? [];

  const requisitionQuery =
    useMaterialRequisition(
      requisitionId,
    );

  const summaryQuery =
    useMaterialRequisitionSummary(
      requisitionId,
    );

  const updateMutation =
    useUpdateMaterialRequisition();

  const deleteMutation =
    useDeleteMaterialRequisition();

  const createItemMutation =
    useCreateMaterialRequisitionItem();

  const updateItemMutation =
    useUpdateMaterialRequisitionItem();

  const deleteItemMutation =
    useDeleteMaterialRequisitionItem();

  const submitMutation =
    useSubmitMaterialRequisition();

  const approveMutation =
    useApproveMaterialRequisition();

  const rejectMutation =
    useRejectMaterialRequisition();

  const fulfillMutation =
    useFulfillMaterialRequisition();

  const cancelMutation =
    useCancelMaterialRequisition();

  const [
    editingRequisition,
    setEditingRequisition,
  ] = useState(false);

  const [
    editingItem,
    setEditingItem,
  ] = useState<
    MaterialRequisitionItem | undefined
  >();

  const [
    showItemForm,
    setShowItemForm,
  ] = useState(false);

  const [
    showApproval,
    setShowApproval,
  ] = useState(false);

  const [
    showRejection,
    setShowRejection,
  ] = useState(false);

  const [
    showFulfillment,
    setShowFulfillment,
  ] = useState(false);

  const requisitionData =
  requisitionQuery.data;

  if (
    requisitionQuery.isLoading
  ) {
  return (
    <div className="p-6">
      Loading material requisition...
    </div>
  );
}

  if (
    requisitionQuery.isError ||
    !requisitionData
  ) {
   return (
    <div className="p-6">
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        Material requisition could
        not be found.
      </div>
    </div>
  );
}

const requisition =
  requisitionData;

  const canView =
    permissions.includes(
      MATERIAL_REQUISITION_PERMISSIONS.READ,
    );

  const canUpdate =
    permissions.includes(
      MATERIAL_REQUISITION_PERMISSIONS.UPDATE,
    );

  const canDelete =
    permissions.includes(
      MATERIAL_REQUISITION_PERMISSIONS.DELETE,
    );

  const canSubmit =
    permissions.includes(
      MATERIAL_REQUISITION_PERMISSIONS.SUBMIT,
    );

  const canApprove =
    permissions.includes(
      MATERIAL_REQUISITION_PERMISSIONS.APPROVE,
    );

  const canReject =
    permissions.includes(
      MATERIAL_REQUISITION_PERMISSIONS.REJECT,
    );

  const canFulfill =
    permissions.includes(
      MATERIAL_REQUISITION_PERMISSIONS.FULFILL,
    );

  const canCancel =
    permissions.includes(
      MATERIAL_REQUISITION_PERMISSIONS.CANCEL,
    );

  const canEdit =
    canUpdate &&
    canEditRequisition(
      requisition,
    );

  if (!canView) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8">
          <h2 className="font-semibold">
            Access denied
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            You do not have permission
            to view this material
            requisition.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mt-4 rounded-md border px-4 py-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const busy =
    updateMutation.isPending ||
    deleteMutation.isPending ||
    createItemMutation.isPending ||
    updateItemMutation.isPending ||
    deleteItemMutation.isPending ||
    submitMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending ||
    fulfillMutation.isPending ||
    cancelMutation.isPending;

  function handleUpdate(
    values:
      | MaterialRequisitionUpdateInput,
  ) {
    updateMutation.mutate({
      requisitionId:
        requisition.id,
      input: values,
    });

    setEditingRequisition(false);
  }

  function handleDelete() {
    const confirmed =
      window.confirm(
        "Delete this material requisition?",
      );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(
      requisition.id,
      {
        onSuccess: () => {
          navigate(
            requisition.project_id
              ? `/projects/${requisition.project_id}/material-requisitions`
              : "/material-requisitions",
          );
        },
      },
    );
  }

  function handleCreateItem(
    values:
      | MaterialRequisitionItemCreateInput,
  ) {
    createItemMutation.mutate(
      {
        requisitionId:
          requisition.id,
        input: values,
      },
      {
        onSuccess: () => {
          setShowItemForm(false);
        },
      },
    );
  }

  function handleUpdateItem(
    values:
      | MaterialRequisitionItemUpdateInput,
  ) {
    if (!editingItem) {
      return;
    }

    updateItemMutation.mutate(
      {
        requisitionId:
          requisition.id,
        itemId: editingItem.id,
        input: values,
      },
      {
        onSuccess: () => {
          setEditingItem(
            undefined,
          );
        },
      },
    );
  }

  function handleItemSubmit(
  values:
    | MaterialRequisitionItemCreateInput
    | MaterialRequisitionItemUpdateInput,
) {
  if (editingItem) {
    handleUpdateItem(
      values as MaterialRequisitionItemUpdateInput,
    );
    return;
  }

  handleCreateItem(
    values as MaterialRequisitionItemCreateInput,
  );
}

  function handleDeleteItem(
    item: MaterialRequisitionItem,
  ) {
    const confirmed =
      window.confirm(
        `Delete ${item.material_name}?`,
      );

    if (!confirmed) {
      return;
    }

    deleteItemMutation.mutate({
      requisitionId:
        requisition.id,
      itemId: item.id,
    });
  }

  function handleSubmit() {
    submitMutation.mutate(
      requisition.id,
    );
  }

  function handleApprove(
    input: Parameters<
      typeof approveMutation.mutate
    >[0]["input"],
  ) {
    approveMutation.mutate(
      {
        requisitionId:
          requisition.id,
        input,
      },
      {
        onSuccess: () =>
          setShowApproval(false),
      },
    );
  }

  function handleReject(
    reason: string,
  ) {
    rejectMutation.mutate(
      {
        requisitionId:
          requisition.id,
        input: { reason },
      },
      {
        onSuccess: () =>
          setShowRejection(false),
      },
    );
  }

  function handleFulfill(
    input: Parameters<
      typeof fulfillMutation.mutate
    >[0]["input"],
  ) {
    fulfillMutation.mutate(
      {
        requisitionId:
          requisition.id,
        input,
      },
      {
        onSuccess: () =>
          setShowFulfillment(false),
      },
    );
  }

  function handleCancel() {
    const confirmed =
      window.confirm(
        "Cancel this material requisition?",
      );

    if (!confirmed) {
      return;
    }

    cancelMutation.mutate(
      requisition.id,
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="text-sm text-gray-500"
        >
          ← Back
        </button>

        <MaterialRequisitionActions
          requisition={
            requisition
          }
          canUpdate={
            canUpdate
          }
          canDelete={
            canDelete
          }
          canSubmit={
            canSubmit
          }
          canApprove={
            canApprove
          }
          canReject={
            canReject
          }
          canFulfill={
            canFulfill
          }
          canCancel={
            canCancel
          }
          loading={busy}
          onEdit={() =>
            setEditingRequisition(
              true,
            )
          }
          onDelete={
            handleDelete
          }
          onSubmit={
            handleSubmit
          }
          onApprove={() =>
            setShowApproval(true)
          }
          onReject={() =>
            setShowRejection(true)
          }
          onFulfill={() =>
            setShowFulfillment(
              true,
            )
          }
          onCancel={
            handleCancel
          }
        />
      </div>

      {editingRequisition ? (
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Edit Requisition
          </h2>

          <MaterialRequisitionForm
            initialValues={
              requisition
            }
            submitting={
              updateMutation.isPending
            }
            submitLabel="Update Requisition"
            onSubmit={
              handleUpdate
            }
            onCancel={() =>
              setEditingRequisition(
                false,
              )
            }
          />
        </div>
      ) : (
        <MaterialRequisitionDetails
          requisition={
            requisition
          }
          summary={
            summaryQuery.data
          }
          editable={
            canEdit
          }
          onEditItem={(item) => {
            setEditingItem(item);
            setShowItemForm(true);
          }}
          onDeleteItem={
            handleDeleteItem
          }
        />
      )}

      {canEdit && (
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Material Items
              </h2>

              <p className="text-sm text-gray-500">
                Add materials to the
                requisition before
                submitting it.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingItem(
                  undefined,
                );

                setShowItemForm(
                  true,
                );
              }}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white"
            >
              Add Item
            </button>
          </div>

          {showItemForm && (
            <div className="border-t pt-5">
              <MaterialRequisitionItemForm
                item={
                  editingItem
                }
                submitting={
                  createItemMutation.isPending ||
                  updateItemMutation.isPending
                }
                onSubmit={
                  handleItemSubmit
                }
                onCancel={() => {
                  setShowItemForm(
                    false,
                  );

                  setEditingItem(
                    undefined,
                  );
                }}
              />
            </div>
          )}
        </div>
      )}

      {showApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
            <MaterialRequisitionApprovalDialog
              requisition={
                requisition
              }
              submitting={
                approveMutation.isPending
              }
              onSubmit={
                handleApprove
              }
              onCancel={() =>
                setShowApproval(
                  false,
                )
              }
            />
          </div>
        </div>
      )}

      {showRejection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <MaterialRequisitionRejectionDialog
              submitting={
                rejectMutation.isPending
              }
              onSubmit={
                handleReject
              }
              onCancel={() =>
                setShowRejection(
                  false,
                )
              }
            />
          </div>
        </div>
      )}

      {showFulfillment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
            <MaterialRequisitionFulfillmentDialog
              requisition={
                requisition
              }
              submitting={
                fulfillMutation.isPending
              }
              onSubmit={
                handleFulfill
              }
              onCancel={() =>
                setShowFulfillment(
                  false,
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}