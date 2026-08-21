import {useMutation, useQuery, useQueryClient,
} from "@tanstack/react-query";
import { siteOperationsApi } from "../api/siteOperations.api";
import type {SiteLogCreateInput, SiteLogUpdateInput,
} from "../types/siteOperations.types";

export const siteLogKeys = {
  all: ["site-logs"] as const,

  lists: (projectId: string) =>
    [...siteLogKeys.all, "list", projectId] as const,

  detail: (
    projectId: string,
    siteLogId: string,
  ) =>
    [
      ...siteLogKeys.all,
      "detail",
      projectId,
      siteLogId,
    ] as const,

  issues: (
    projectId: string,
    siteLogId: string,
  ) =>
    [
      ...siteLogKeys.all,
      "issues",
      projectId,
      siteLogId,
    ] as const,

  attachments: (
    projectId: string,
    siteLogId: string,
  ) =>
    [
      ...siteLogKeys.all,
      "attachments",
      projectId,
      siteLogId,
    ] as const,
};

export function useSiteLogs(
  projectId?: string,
  skip = 0,
  limit = 100,
) {
  return useQuery({
    queryKey: [
      ...siteLogKeys.lists(projectId ?? ""),
      skip,
      limit,
    ],
    queryFn: () =>
      siteOperationsApi.list(
        projectId!,
        skip,
        limit,
      ),
    enabled: !!projectId,
  });
}

export function useSiteLog(
  projectId?: string,
  siteLogId?: string,
) {
  return useQuery({
    queryKey: siteLogKeys.detail(
      projectId ?? "",
      siteLogId ?? "",
    ),
    queryFn: () =>
      siteOperationsApi.get(
        projectId!,
        siteLogId!,
      ),
    enabled:
      Boolean(projectId) &&
      Boolean(siteLogId),
  });
}

export function useSiteLogIssues(
  projectId?: string,
  siteLogId?: string,
) {
  return useQuery({
    queryKey: siteLogKeys.issues(
      projectId ?? "",
      siteLogId ?? "",
    ),
    queryFn: () =>
      siteOperationsApi.listIssues(
        projectId!,
        siteLogId!,
      ),
    enabled:
      Boolean(projectId) &&
      Boolean(siteLogId),
  });
}

export function useSiteLogAttachments(
  projectId?: string,
  siteLogId?: string,
) {
  return useQuery({
    queryKey: siteLogKeys.attachments(
      projectId ?? "",
      siteLogId ?? "",
    ),
    queryFn: () =>
      siteOperationsApi.listAttachments(
        projectId!,
        siteLogId!,
      ),
    enabled:
      Boolean(projectId) &&
      Boolean(siteLogId),
  });
}

export function useCreateSiteLog() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: SiteLogCreateInput;
    }) =>
      siteOperationsApi.create(
        projectId,
        payload,
      ),

    onSuccess: (siteLog) => {
      queryClient.setQueryData(
        siteLogKeys.detail(
          siteLog.project_id,
          siteLog.id,
        ),
        siteLog,
      );

      queryClient.invalidateQueries({
        queryKey: siteLogKeys.lists(
          siteLog.project_id,
        ),
      });
    },
  });
}

export function useUpdateSiteLog() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      siteLogId,
      payload,
    }: {
      projectId: string;
      siteLogId: string;
      payload: SiteLogUpdateInput;
    }) =>
      siteOperationsApi.update(
        projectId,
        siteLogId,
        payload,
      ),

    onSuccess: (siteLog) => {
      queryClient.setQueryData(
        siteLogKeys.detail(
          siteLog.project_id,
          siteLog.id,
        ),
        siteLog,
      );

      queryClient.invalidateQueries({
        queryKey: siteLogKeys.lists(
          siteLog.project_id,
        ),
      });
    },
  });
}