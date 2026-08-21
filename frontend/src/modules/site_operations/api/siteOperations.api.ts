import { api } from "@/services/api";
import type {SiteLog, SiteLogAttachment, SiteLogAttachmentCreateInput, SiteLogCreateInput, SiteLogIssue, SiteLogIssueCreateInput, SiteLogIssueUpdateInput, SiteLogReturnInput, SiteLogReviewInput, SiteLogUpdateInput,
} from "../types/siteOperations.types";

const BASE_URL = "/projects";

export const siteOperationsApi = {
  async list(
    projectId: string,
    skip = 0,
    limit = 100,
  ): Promise<SiteLog[]> {
    const response = await api.client.get<SiteLog[]>(
      `${BASE_URL}/${projectId}/site-logs`,
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
    projectId: string,
    siteLogId: string,
  ): Promise<SiteLog> {
    const response = await api.client.get<SiteLog>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}`,
    );

    return response.data;
  },

  async create(
    projectId: string,
    payload: SiteLogCreateInput,
  ): Promise<SiteLog> {
    const response = await api.client.post<SiteLog>(
      `${BASE_URL}/${projectId}/site-logs`,
      payload,
    );

    return response.data;
  },

  async update(
    projectId: string,
    siteLogId: string,
    payload: SiteLogUpdateInput,
  ): Promise<SiteLog> {
    const response = await api.client.patch<SiteLog>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}`,
      payload,
    );

    return response.data;
  },

  async submit(
    projectId: string,
    siteLogId: string,
  ): Promise<SiteLog> {
    const response = await api.client.post<SiteLog>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/submit`,
    );

    return response.data;
  },

  async review(
    projectId: string,
    siteLogId: string,
    payload: SiteLogReviewInput,
  ): Promise<SiteLog> {
    const response = await api.client.post<SiteLog>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/review`,
      payload,
    );

    return response.data;
  },

  async return(
    projectId: string,
    siteLogId: string,
    payload: SiteLogReturnInput,
  ): Promise<SiteLog> {
    const response = await api.client.post<SiteLog>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/return`,
      payload,
    );

    return response.data;
  },

  async approve(
    projectId: string,
    siteLogId: string,
  ): Promise<SiteLog> {
    const response = await api.client.post<SiteLog>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/approve`,
    );

    return response.data;
  },

  async listIssues(
    projectId: string,
    siteLogId: string,
  ): Promise<SiteLogIssue[]> {
    const response = await api.client.get<SiteLogIssue[]>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/issues`,
    );

    return response.data;
  },

  async createIssue(
    projectId: string,
    siteLogId: string,
    payload: SiteLogIssueCreateInput,
  ): Promise<SiteLogIssue> {
    const response = await api.client.post<SiteLogIssue>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/issues`,
      payload,
    );

    return response.data;
  },

  async updateIssue(
    projectId: string,
    siteLogId: string,
    issueId: string,
    payload: SiteLogIssueUpdateInput,
  ): Promise<SiteLogIssue> {
    const response = await api.client.patch<SiteLogIssue>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/issues/${issueId}`,
      payload,
    );

    return response.data;
  },

  async resolveIssue(
    projectId: string,
    siteLogId: string,
    issueId: string,
    resolution: string,
  ): Promise<SiteLogIssue> {
    const response = await api.client.post<SiteLogIssue>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/issues/${issueId}/resolve`,
      undefined,
      {
        params: {
          resolution,
        },
      },
    );

    return response.data;
  },

  async listAttachments(
    projectId: string,
    siteLogId: string,
  ): Promise<SiteLogAttachment[]> {
    const response = await api.client.get<SiteLogAttachment[]>(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/attachments`,
    );

    return response.data;
  },

  async createAttachment(
    projectId: string,
    siteLogId: string,
    payload: SiteLogAttachmentCreateInput,
  ): Promise<SiteLogAttachment> {
    const response =
      await api.client.post<SiteLogAttachment>(
        `${BASE_URL}/${projectId}/site-logs/${siteLogId}/attachments`,
        payload,
      );

    return response.data;
  },

  async deleteAttachment(
    projectId: string,
    siteLogId: string,
    attachmentId: string,
  ): Promise<void> {
    await api.client.delete(
      `${BASE_URL}/${projectId}/site-logs/${siteLogId}/attachments/${attachmentId}`,
    );
  },
};