import {useMutation, useQueryClient,
} from "@tanstack/react-query";
import { siteOperationsApi } from "../api/siteOperations.api";
import { siteLogKeys } from "./useSiteLogs";
import type {SiteLogAttachmentCreateInput, SiteLogIssueCreateInput, SiteLogIssueUpdateInput, SiteLogReturnInput, SiteLogReviewInput,
} from "../types/siteOperations.types";

function refreshSiteLog(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
  siteLogId: string,
  siteLog?: unknown,
) {
  if (siteLog) {
    queryClient.setQueryData(
      siteLogKeys.detail(
        projectId,
        siteLogId,
      ),
      siteLog,
    );
  }

  queryClient.invalidateQueries({
    queryKey:
      siteLogKeys.lists(projectId),
  });
}

export function useSubmitSiteLog() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      siteLogId,
    }: {
      projectId: string;
      siteLogId: string;
    }) =>
      siteOperationsApi.submit(
        projectId,
        siteLogId,
      ),

    onSuccess: (siteLog) => {
      refreshSiteLog(
        queryClient,
        siteLog.project_id,
        siteLog.id,
        siteLog,
      );
    },
  });
}

export function useReviewSiteLog() {
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
      payload: SiteLogReviewInput;
    }) =>
      siteOperationsApi.review(
        projectId,
        siteLogId,
        payload,
      ),

    onSuccess: (siteLog) => {
      refreshSiteLog(
        queryClient,
        siteLog.project_id,
        siteLog.id,
        siteLog,
      );
    },
  });
}

export function useReturnSiteLog() {
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
      payload: SiteLogReturnInput;
    }) =>
      siteOperationsApi.return(
        projectId,
        siteLogId,
        payload,
      ),

    onSuccess: (siteLog) => {
      refreshSiteLog(
        queryClient,
        siteLog.project_id,
        siteLog.id,
        siteLog,
      );
    },
  });
}

export function useApproveSiteLog() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      siteLogId,
    }: {
      projectId: string;
      siteLogId: string;
    }) =>
      siteOperationsApi.approve(
        projectId,
        siteLogId,
      ),

    onSuccess: (siteLog) => {
      refreshSiteLog(
        queryClient,
        siteLog.project_id,
        siteLog.id,
        siteLog,
      );
    },
  });
}

export function useCreateSiteLogIssue() {
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
      payload: SiteLogIssueCreateInput;
    }) =>
      siteOperationsApi.createIssue(
        projectId,
        siteLogId,
        payload,
      ),

    onSuccess: (
      _issue,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: siteLogKeys.detail(
          variables.projectId,
          variables.siteLogId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: siteLogKeys.issues(
          variables.projectId,
          variables.siteLogId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: siteLogKeys.lists(
          variables.projectId,
        ),
      });
    },
  });
}

export function useUpdateSiteLogIssue() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      siteLogId,
      issueId,
      payload,
    }: {
      projectId: string;
      siteLogId: string;
      issueId: string;
      payload: SiteLogIssueUpdateInput;
    }) =>
      siteOperationsApi.updateIssue(
        projectId,
        siteLogId,
        issueId,
        payload,
      ),

    onSuccess: (
      _issue,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: siteLogKeys.detail(
          variables.projectId,
          variables.siteLogId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: siteLogKeys.issues(
          variables.projectId,
          variables.siteLogId,
        ),
      });
    },
  });
}

export function useResolveSiteLogIssue() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      siteLogId,
      issueId,
      resolution,
    }: {
      projectId: string;
      siteLogId: string;
      issueId: string;
      resolution: string;
    }) =>
      siteOperationsApi.resolveIssue(
        projectId,
        siteLogId,
        issueId,
        resolution,
      ),

    onSuccess: (
      _issue,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: siteLogKeys.detail(
          variables.projectId,
          variables.siteLogId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: siteLogKeys.issues(
          variables.projectId,
          variables.siteLogId,
        ),
      });
    },
  });
}

export function useCreateSiteLogAttachment() {
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
      payload: SiteLogAttachmentCreateInput;
    }) =>
      siteOperationsApi.createAttachment(
        projectId,
        siteLogId,
        payload,
      ),

    onSuccess: (
      _attachment,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          siteLogKeys.detail(
            variables.projectId,
            variables.siteLogId,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          siteLogKeys.attachments(
            variables.projectId,
            variables.siteLogId,
          ),
      });
    },
  });
}

export function useDeleteSiteLogAttachment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      siteLogId,
      attachmentId,
    }: {
      projectId: string;
      siteLogId: string;
      attachmentId: string;
    }) =>
      siteOperationsApi.deleteAttachment(
        projectId,
        siteLogId,
        attachmentId,
      ),

    onSuccess: (
      _,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          siteLogKeys.detail(
            variables.projectId,
            variables.siteLogId,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          siteLogKeys.attachments(
            variables.projectId,
            variables.siteLogId,
          ),
      });
    },
  });
}