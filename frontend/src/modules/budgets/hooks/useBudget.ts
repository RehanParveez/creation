import {useMutation, useQuery, useQueryClient,
} from "@tanstack/react-query";
import { budgetsApi } from "../api/budgets.api";
import type {BudgetCreateInput, BudgetItemCreateInput, BudgetItemUpdateInput, BudgetUpdateInput,
} from "../types/budget.types";

export const budgetKeys = {
  all: ["budgets"] as const,

  lists: () =>
    [...budgetKeys.all, "list"] as const,

  detail: (id: string) =>
    [...budgetKeys.all, "detail", id] as const,

  project: (projectId: string) =>
    [...budgetKeys.all, "project", projectId] as const,

  items: (budgetId: string) =>
    [...budgetKeys.all, "items", budgetId] as const,
};

export function useBudgets(
  skip = 0,
  limit = 100,
) {
  return useQuery({
    queryKey: [
      ...budgetKeys.lists(),
      skip,
      limit,
    ],
    queryFn: () =>
      budgetsApi.list(skip, limit),
  });
}

export function useBudget(
  budgetId?: string,
) {
  return useQuery({
    queryKey: budgetKeys.detail(
      budgetId ?? "",
    ),
    queryFn: () =>
      budgetsApi.get(budgetId!),
    enabled: Boolean(budgetId),
  });
}

export function useProjectBudget(
  projectId?: string,
) {
  return useQuery({
    queryKey: budgetKeys.project(
      projectId ?? "",
    ),
    queryFn: () =>
      budgetsApi.getByProject(projectId!),
    enabled: Boolean(projectId),
  });
}

export function useBudgetItems(
  budgetId?: string,
) {
  return useQuery({
    queryKey: budgetKeys.items(
      budgetId ?? "",
    ),
    queryFn: () =>
      budgetsApi.listItems(budgetId!),
    enabled: Boolean(budgetId),
  });
}

export function useCreateBudget() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: BudgetCreateInput;
    }) =>
      budgetsApi.create(
        projectId,
        payload,
      ),

    onSuccess: (budget) => {
      queryClient.setQueryData(
        budgetKeys.detail(budget.id),
        budget,
      );

      queryClient.setQueryData(
        budgetKeys.project(
          budget.project_id,
        ),
        budget,
      );

      queryClient.invalidateQueries({
        queryKey: budgetKeys.lists(),
      });
    },
  });
}

export function useUpdateBudget() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      payload,
    }: {
      budgetId: string;
      payload: BudgetUpdateInput;
    }) =>
      budgetsApi.update(
        budgetId,
        payload,
      ),

    onSuccess: (budget) => {
      queryClient.setQueryData(
        budgetKeys.detail(budget.id),
        budget,
      );

      queryClient.setQueryData(
        budgetKeys.project(
          budget.project_id,
        ),
        budget,
      );

      queryClient.invalidateQueries({
        queryKey: budgetKeys.lists(),
      });
    },
  });
}

export function useDeleteBudget() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (budgetId: string) =>
      budgetsApi.remove(budgetId),

    onSuccess: (
      _,
      budgetId,
    ) => {
      queryClient.removeQueries({
        queryKey:
          budgetKeys.detail(
            budgetId,
          ),
      });

      queryClient.invalidateQueries({
        queryKey: budgetKeys.all,
      });
    },
  });
}

export function useCreateBudgetItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      payload,
    }: {
      budgetId: string;
      payload: BudgetItemCreateInput;
    }) =>
      budgetsApi.createItem(
        budgetId,
        payload,
      ),

    onSuccess: (item) => {
      queryClient.invalidateQueries({
        queryKey: budgetKeys.detail(
          item.budget_id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: budgetKeys.items(
          item.budget_id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: budgetKeys.lists(),
      });
    },
  });
}

export function useUpdateBudgetItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      itemId,
      payload,
    }: {
      budgetId: string;
      itemId: string;
      payload: BudgetItemUpdateInput;
    }) =>
      budgetsApi.updateItem(
        budgetId,
        itemId,
        payload,
      ),

    onSuccess: (item) => {
      queryClient.invalidateQueries({
        queryKey: budgetKeys.detail(
          item.budget_id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: budgetKeys.items(
          item.budget_id,
        ),
      });
    },
  });
}

export function useDeleteBudgetItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      itemId,
    }: {
      budgetId: string;
      itemId: string;
    }) =>
      budgetsApi.removeItem(
        budgetId,
        itemId,
      ),

    onSuccess: (
      _,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: budgetKeys.detail(
          variables.budgetId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: budgetKeys.items(
          variables.budgetId,
        ),
      });
    },
  });
}