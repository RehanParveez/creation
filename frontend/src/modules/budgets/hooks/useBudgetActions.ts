import {useMutation, useQueryClient,
} from "@tanstack/react-query";
import { budgetsApi } from "../api/budgets.api";
import { budgetKeys } from "./useBudget";

export function useSubmitBudget() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (budgetId: string) =>
      budgetsApi.submit(budgetId),

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

export function useApproveBudget() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (budgetId: string) =>
      budgetsApi.approve(budgetId),

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

export function useRejectBudget() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      reason,
    }: {
      budgetId: string;
      reason: string;
    }) =>
      budgetsApi.reject(
        budgetId,
        reason,
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