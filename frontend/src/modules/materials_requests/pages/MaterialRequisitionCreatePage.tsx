import {useNavigate, useParams,
} from "react-router-dom";
import {useCreateMaterialRequisition,
} from "../hooks";
import {MaterialRequisitionForm,
} from "../components/MaterialRequisitionForm";
import type {MaterialRequisitionCreateInput,
} from "../types";

export function MaterialRequisitionCreatePage() {
  const navigate = useNavigate();

  const {
    projectId: routeProjectId,
  } = useParams<{
    projectId: string;
  }>();

  const createMutation =
    useCreateMaterialRequisition();

  if (!routeProjectId) {
    return (
      <div className="p-6">
        Project ID is required.
      </div>
    );
  }

  const projectId: string =
    routeProjectId;

  function handleSubmit(
    values: MaterialRequisitionCreateInput,
  ) {
    createMutation.mutate(
      {
        projectId,
        input: values,
      },
      {
        onSuccess: (data) => {
          navigate(
            `/projects/${projectId}/material-requisitions/${data.id}`,
          );
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          New Material Requisition
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a material request for this
          project.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <MaterialRequisitionForm
          submitting={
            createMutation.isPending
          }
          submitLabel="Create Requisition"
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(-1)
          }
        />
      </div>

      {createMutation.isError && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to create material
          requisition.
        </div>
      )}
    </div>
  );
}