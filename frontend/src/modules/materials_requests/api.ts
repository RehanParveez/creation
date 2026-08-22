import type {MaterialRequisition, MaterialRequisitionCreateInput, MaterialRequisitionUpdateInput, MaterialRequisitionItem, MaterialRequisitionItemCreateInput, MaterialRequisitionItemUpdateInput, MaterialRequisitionApproveInput,
  MaterialRequisitionRejectInput, MaterialRequisitionFulfillInput, MaterialRequisitionSummary, MaterialRequisitionListParams,
} from "./types";
import { api } from "../../services/api";

const BASE_URL = "/material-requisitions";

function buildQuery(params?: MaterialRequisitionListParams) {
  if (!params) return "";

  const search = new URLSearchParams();

  if (params.skip !== undefined) {
    search.set("skip", String(params.skip));
  }

  if (params.limit !== undefined) {
    search.set("limit", String(params.limit));
  }

  const query = search.toString();

  return query ? `?${query}` : "";
}

export const materialRequisitionApi = {
  async list(
    params?: MaterialRequisitionListParams,
  ): Promise<MaterialRequisition[]> {
    const response = await api.client.get(
      `${BASE_URL}/${buildQuery(params)}`,
    );

    return response.data;
  },

  async listByProject(
    projectId: string,
    params?: MaterialRequisitionListParams,
  ): Promise<MaterialRequisition[]> {
    const response = await api.client.get(
      `${BASE_URL}/projects/${projectId}${buildQuery(params)}`,
    );

    return response.data;
  },

  async get(
    requisitionId: string,
  ): Promise<MaterialRequisition> {
    const response = await api.client.get(
      `${BASE_URL}/${requisitionId}`,
    );

    return response.data;
  },

  async create(
    projectId: string,
    input: MaterialRequisitionCreateInput,
  ): Promise<MaterialRequisition> {
    const response = await api.client.post(
      `${BASE_URL}/projects/${projectId}`,
      input,
    );

    return response.data;
  },

  async update(
    requisitionId: string,
    input: MaterialRequisitionUpdateInput,
  ): Promise<MaterialRequisition> {
    const response = await api.client.patch(
      `${BASE_URL}/${requisitionId}`,
      input,
    );

    return response.data;
  },

  async remove(
    requisitionId: string,
  ): Promise<void> {
    await api.client.delete(
      `${BASE_URL}/${requisitionId}`,
    );
  },

  async getItems(
    requisitionId: string,
  ): Promise<MaterialRequisitionItem[]> {
    const response = await api.client.get(
      `${BASE_URL}/${requisitionId}/items`,
    );

    return response.data;
  },

  async createItem(
    requisitionId: string,
    input: MaterialRequisitionItemCreateInput,
  ): Promise<MaterialRequisitionItem> {
    const response = await api.client.post(
      `${BASE_URL}/${requisitionId}/items`,
      input,
    );

    return response.data;
  },

  async updateItem(
    requisitionId: string,
    itemId: string,
    input: MaterialRequisitionItemUpdateInput,
  ): Promise<MaterialRequisitionItem> {
    const response = await api.client.patch(
      `${BASE_URL}/${requisitionId}/items/${itemId}`,
      input,
    );

    return response.data;
  },

  async removeItem(
    requisitionId: string,
    itemId: string,
  ): Promise<void> {
    await api.client.delete(
      `${BASE_URL}/${requisitionId}/items/${itemId}`,
    );
  },

  async submit(
    requisitionId: string,
  ): Promise<MaterialRequisition> {
    const response = await api.client.post(
      `${BASE_URL}/${requisitionId}/submit`,
    );

    return response.data;
  },

  async approve(
    requisitionId: string,
    input: MaterialRequisitionApproveInput,
  ): Promise<MaterialRequisition> {
    const response = await api.client.post(
      `${BASE_URL}/${requisitionId}/approve`,
      input,
    );

    return response.data;
  },

  async reject(
    requisitionId: string,
    input: MaterialRequisitionRejectInput,
  ): Promise<MaterialRequisition> {
    const response = await api.client.post(
      `${BASE_URL}/${requisitionId}/reject`,
      input,
    );

    return response.data;
  },

  async fulfill(
    requisitionId: string,
    input: MaterialRequisitionFulfillInput,
  ): Promise<MaterialRequisition> {
    const response = await api.client.post(
      `${BASE_URL}/${requisitionId}/fulfill`,
      input,
    );

    return response.data;
  },

  async cancel(
    requisitionId: string,
  ): Promise<MaterialRequisition> {
    const response = await api.client.post(
      `${BASE_URL}/${requisitionId}/cancel`,
    );

    return response.data;
  },

  async summary(
    requisitionId: string,
  ): Promise<MaterialRequisitionSummary> {
    const response = await api.client.get(
      `${BASE_URL}/${requisitionId}/summary`,
    );

    return response.data;
  },
};