import type {Budget, BudgetCreateInput, BudgetItem, BudgetItemCreateInput, BudgetItemUpdateInput, BudgetUpdateInput,
} from "../types/budget.types";
import { api } from "@/services/api";

const BASE_URL = "/budgets";

export const budgetsApi = {
  async list(
    skip = 0,
    limit = 100,
  ): Promise<Budget[]> {
    const response =
      await api.client.get<Budget[]>(
        BASE_URL,
        {
          params: {
            skip,
            limit,
          },
        },
      );

    return response.data;
  },

  async get(
    budgetId: string,
  ): Promise<Budget> {
    const response =
      await api.client.get<Budget>(
        `${BASE_URL}/${budgetId}`,
      );

    return response.data;
  },

  async getByProject(
    projectId: string,
  ): Promise<Budget> {
    const response =
      await api.client.get<Budget>(
        `${BASE_URL}/projects/${projectId}`,
      );

    return response.data;
  },

  async create(
    projectId: string,
    payload: BudgetCreateInput,
  ): Promise<Budget> {
    const response =
      await api.client.post<Budget>(
        `${BASE_URL}/projects/${projectId}`,
        payload,
      );

    return response.data;
  },

  async update(
    budgetId: string,
    payload: BudgetUpdateInput,
  ): Promise<Budget> {
    const response =
      await api.client.patch<Budget>(
        `${BASE_URL}/${budgetId}`,
        payload,
      );

    return response.data;
  },

  async remove(
    budgetId: string,
  ): Promise<void> {
    await api.client.delete(
      `${BASE_URL}/${budgetId}`,
    );
  },

  async listItems(
    budgetId: string,
  ): Promise<BudgetItem[]> {
    const response =
      await api.client.get<BudgetItem[]>(
        `${BASE_URL}/${budgetId}/items`,
      );

    return response.data;
  },

  async createItem(
    budgetId: string,
    payload: BudgetItemCreateInput,
  ): Promise<BudgetItem> {
    const response =
      await api.client.post<BudgetItem>(
        `${BASE_URL}/${budgetId}/items`,
        payload,
      );

    return response.data;
  },

  async updateItem(
    budgetId: string,
    itemId: string,
    payload: BudgetItemUpdateInput,
  ): Promise<BudgetItem> {
    const response =
      await api.client.patch<BudgetItem>(
        `${BASE_URL}/${budgetId}/items/${itemId}`,
        payload,
      );

    return response.data;
  },

  async removeItem(
    budgetId: string,
    itemId: string,
  ): Promise<void> {
    await api.client.delete(
      `${BASE_URL}/${budgetId}/items/${itemId}`,
    );
  },

  async submit(
    budgetId: string,
  ): Promise<Budget> {
    const response =
      await api.client.post<Budget>(
        `${BASE_URL}/${budgetId}/submit`,
      );

    return response.data;
  },

  async approve(
    budgetId: string,
  ): Promise<Budget> {
    const response =
      await api.client.post<Budget>(
        `${BASE_URL}/${budgetId}/approve`,
      );

    return response.data;
  },

  async reject(
    budgetId: string,
    reason: string,
  ): Promise<Budget> {

    const response =
      await api.client.post<Budget>(
        `${BASE_URL}/${budgetId}/reject`,
        undefined,
        {
          params: {
            reason,
          },
        },
      );

    return response.data;
  },
};