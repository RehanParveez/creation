import {useMutation, useQuery, useQueryClient,
} from "@tanstack/react-query";
import { materialRequisitionApi } from "./api";
import type {MaterialRequisitionCreateInput, MaterialRequisitionUpdateInput, MaterialRequisitionItemCreateInput, MaterialRequisitionItemUpdateInput, MaterialRequisitionApproveInput, MaterialRequisitionRejectInput, MaterialRequisitionFulfillInput,
  MaterialRequisitionListParams,
} from "./types";

const keys = {
  all: ["material-requisitions"] as const,

  lists: () =>
    [...keys.all, "list"] as const,

  list: (
    params?: MaterialRequisitionListParams,
  ) =>
    [...keys.lists(), params] as const,

  project: (
    projectId: string,
  ) =>
    [...keys.all, "project", projectId] as const,

  detail: (
    id: string,
  ) =>
    [...keys.all, "detail", id] as const,

  items: (
    id: string,
  ) =>
    [...keys.detail(id), "items"] as const,

  summary: (
    id: string,
  ) =>
    [...keys.detail(id), "summary"] as const,
};

export function useMaterialRequisitions(
  params?: MaterialRequisitionListParams,
) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () =>
      materialRequisitionApi.list(params),
  });
}

export function useProjectMaterialRequisitions(
  projectId: string | undefined,
  params?: MaterialRequisitionListParams,
) {
  return useQuery({
    queryKey: projectId
      ? keys.project(projectId)
      : [...keys.lists(), "empty"],
    queryFn: () =>
      materialRequisitionApi.listByProject(
        projectId!,
        params,
      ),
    enabled: Boolean(projectId),
  });
}

export function useMaterialRequisition(
  requisitionId: string | undefined,
) {
  return useQuery({
    queryKey: requisitionId
      ? keys.detail(requisitionId)
      : [...keys.all, "empty"],
    queryFn: () =>
      materialRequisitionApi.get(
        requisitionId!,
      ),
    enabled: Boolean(requisitionId),
  });
}

export function useMaterialRequisitionItems(
  requisitionId: string | undefined,
) {
  return useQuery({
    queryKey: requisitionId
      ? keys.items(requisitionId)
      : [...keys.all, "empty-items"],
    queryFn: () =>
      materialRequisitionApi.getItems(
        requisitionId!,
      ),
    enabled: Boolean(requisitionId),
  });
}

export function useMaterialRequisitionSummary(
  requisitionId: string | undefined,
) {
  return useQuery({
    queryKey: requisitionId
      ? keys.summary(requisitionId)
      : [...keys.all, "empty-summary"],
    queryFn: () =>
      materialRequisitionApi.summary(
        requisitionId!,
      ),
    enabled: Boolean(requisitionId),
  });
}

export function useCreateMaterialRequisition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      input,
    }: {
      projectId: string;
      input: MaterialRequisitionCreateInput;
    }) =>
      materialRequisitionApi.create(
        projectId,
        input,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: keys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: keys.project(
          variables.projectId,
        ),
      });
    },
  });
}

export function useUpdateMaterialRequisition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requisitionId,
      input,
    }: {
      requisitionId: string;
      input: MaterialRequisitionUpdateInput;
    }) =>
      materialRequisitionApi.update(
        requisitionId,
        input,
      ),

    onSuccess: (data) => {
      queryClient.setQueryData(
        keys.detail(data.id),
        data,
      );

      queryClient.invalidateQueries({
        queryKey: keys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: keys.project(
          data.project_id,
        ),
      });
    },
  });
}

export function useDeleteMaterialRequisition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      requisitionId: string,
    ) =>
      materialRequisitionApi.remove(
        requisitionId,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.lists(),
      });
    },
  });
}

export function useCreateMaterialRequisitionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requisitionId,
      input,
    }: {
      requisitionId: string;
      input: MaterialRequisitionItemCreateInput;
    }) =>
      materialRequisitionApi.createItem(
        requisitionId,
        input,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: keys.detail(
          variables.requisitionId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: keys.items(
          variables.requisitionId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: keys.summary(
          variables.requisitionId,
        ),
      });
    },
  });
}

export function useUpdateMaterialRequisitionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requisitionId,
      itemId,
      input,
    }: {
      requisitionId: string;
      itemId: string;
      input: MaterialRequisitionItemUpdateInput;
    }) =>
      materialRequisitionApi.updateItem(
        requisitionId,
        itemId,
        input,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: keys.detail(
          variables.requisitionId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: keys.items(
          variables.requisitionId,
        ),
      });
    },
  });
}

export function useDeleteMaterialRequisitionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requisitionId,
      itemId,
    }: {
      requisitionId: string;
      itemId: string;
    }) =>
      materialRequisitionApi.removeItem(
        requisitionId,
        itemId,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: keys.detail(
          variables.requisitionId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: keys.items(
          variables.requisitionId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: keys.summary(
          variables.requisitionId,
        ),
      });
    },
  });
}

function useLifecycleMutation(
  mutationFn: (
    requisitionId: string,
  ) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: (data: any) => {
      if (!data?.id) return;

      queryClient.setQueryData(
        keys.detail(data.id),
        data,
      );

      queryClient.invalidateQueries({
        queryKey: keys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: keys.project(
          data.project_id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: keys.summary(data.id),
      });
    },
  });
}

export function useSubmitMaterialRequisition() {
  return useLifecycleMutation(
    materialRequisitionApi.submit,
  );
}

export function useCancelMaterialRequisition() {
  return useLifecycleMutation(
    materialRequisitionApi.cancel,
  );
}

export function useApproveMaterialRequisition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requisitionId,
      input,
    }: {
      requisitionId: string;
      input: MaterialRequisitionApproveInput;
    }) =>
      materialRequisitionApi.approve(
        requisitionId,
        input,
      ),

    onSuccess: (data) => {
      queryClient.setQueryData(
        keys.detail(data.id),
        data,
      );

      queryClient.invalidateQueries({
        queryKey: keys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: keys.summary(data.id),
      });
    },
  });
}

export function useRejectMaterialRequisition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requisitionId,
      input,
    }: {
      requisitionId: string;
      input: MaterialRequisitionRejectInput;
    }) =>
      materialRequisitionApi.reject(
        requisitionId,
        input,
      ),

    onSuccess: (data) => {
      queryClient.setQueryData(
        keys.detail(data.id),
        data,
      );

      queryClient.invalidateQueries({
        queryKey: keys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: keys.summary(data.id),
      });
    },
  });
}

export function useFulfillMaterialRequisition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requisitionId,
      input,
    }: {
      requisitionId: string;
      input: MaterialRequisitionFulfillInput;
    }) =>
      materialRequisitionApi.fulfill(
        requisitionId,
        input,
      ),

    onSuccess: (data) => {
      queryClient.setQueryData(
        keys.detail(data.id),
        data,
      );

      queryClient.invalidateQueries({
        queryKey: keys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: keys.summary(data.id),
      });
    },
  });
}