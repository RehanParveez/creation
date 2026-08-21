import {useState,
} from "react";
import {useParams, useNavigate,
} from "react-router-dom";
import {useAuthStore,
} from "@/app/store";
import {useSiteLog, useUpdateSiteLog, useCreateSiteLogIssue, useUpdateSiteLogIssue, useResolveSiteLogIssue, useCreateSiteLogAttachment, useDeleteSiteLogAttachment,
} from "../hooks";
import {useSubmitSiteLog, useReviewSiteLog, useReturnSiteLog, useApproveSiteLog,
} from "../hooks";
import {SiteLogStatusBadge,
} from "../components/SiteLogStatusBadge";
import {IssueSeverityBadge,
} from "../components/IssueSeverityBadge";
import {IssueStatusBadge,
} from "../components/IssueStatusBadge";
import {SiteLogForm,
} from "../components/SiteLogForm";
import {SiteLogIssueForm,
} from "../components/SiteLogIssueForm";
import {SiteLogAttachmentForm,
} from "../components/SiteLogAttachmentForm";
import {SubmitSiteLogDialog,
} from "../components/SubmitSiteLogDialog";
import {ReviewSiteLogDialog,
} from "../components/ReviewSiteLogDialog";
import {ReturnSiteLogDialog,
} from "../components/ReturnSiteLogDialog";
import {ApproveSiteLogDialog,
} from "../components/ApproveSiteLogDialog";
import type {SiteLogAttachmentCreateInput, SiteLogCreateInput, SiteLogIssue, SiteLogIssueCreateInput, SiteLogIssueUpdateInput, SiteLogUpdateInput,
} from "../types/siteOperations.types";
import {SITE_LOG_PERMISSIONS,
} from "../types/siteOperations.types";

export function SiteLogDetailPage() {
  const {
    projectId,
    siteLogId,
  } = useParams<{
    projectId: string;
    siteLogId: string;
  }>();

  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user,
  );

  const permissions =
    user?.permissions ?? [];

  const query = useSiteLog(
    projectId,
    siteLogId,
  );

  const updateSiteLog =
    useUpdateSiteLog();

  const submitSiteLog =
    useSubmitSiteLog();

  const reviewSiteLog =
    useReviewSiteLog();

  const returnSiteLog =
    useReturnSiteLog();

  const approveSiteLog =
    useApproveSiteLog();

  const createIssue =
    useCreateSiteLogIssue();

  const updateIssue =
    useUpdateSiteLogIssue();

  const resolveIssue =
    useResolveSiteLogIssue();

  const createAttachment =
    useCreateSiteLogAttachment();

  const deleteAttachment =
    useDeleteSiteLogAttachment();

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  const [
    submitOpen,
    setSubmitOpen,
  ] = useState(false);

  const [
    reviewOpen,
    setReviewOpen,
  ] = useState(false);

  const [
    returnOpen,
    setReturnOpen,
  ] = useState(false);

  const [
    approveOpen,
    setApproveOpen,
  ] = useState(false);

  const [
    issueFormOpen,
    setIssueFormOpen,
  ] = useState(false);

  const [
    editingIssue,
    setEditingIssue,
  ] = useState<
    SiteLogIssue | undefined
  >();

  const [
    attachmentFormOpen,
    setAttachmentFormOpen,
  ] = useState(false);

  const [
    resolvingIssue,
    setResolvingIssue,
  ] = useState<
    SiteLogIssue | undefined
  >();

  const [
    resolution,
    setResolution,
  ] = useState("");

  if (query.isLoading) {
    return (
      <div className="p-6">
        Loading site report...
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8">
          <h2 className="font-semibold">
            Unable to load site report
          </h2>

          <button
            onClick={() =>
              query.refetch()
            }
            className="mt-4 rounded-lg border px-4 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const siteLog =
    query.data;

  if (!siteLog) {
    return (
      <div className="p-6">
        Site report not found.
      </div>
    );
  }

  const validSiteLog = siteLog;

  const canUpdate =
    permissions.includes(
      SITE_LOG_PERMISSIONS.UPDATE,
    );

  const canSubmit =
    permissions.includes(
      SITE_LOG_PERMISSIONS.SUBMIT,
    );

  const canReview =
    permissions.includes(
      SITE_LOG_PERMISSIONS.REVIEW,
    );

  const canReturn =
    permissions.includes(
      SITE_LOG_PERMISSIONS.RETURN,
    );

  const canApprove =
    permissions.includes(
      SITE_LOG_PERMISSIONS.APPROVE,
    );

  const canCreateIssue =
    permissions.includes(
      SITE_LOG_PERMISSIONS.ISSUE_CREATE,
    );

  const canUpdateIssue =
    permissions.includes(
      SITE_LOG_PERMISSIONS.ISSUE_UPDATE,
    );

  const canResolveIssue =
    permissions.includes(
      SITE_LOG_PERMISSIONS.ISSUE_RESOLVE,
    );

  const canCreateAttachment =
    permissions.includes(
      SITE_LOG_PERMISSIONS.ATTACHMENT_CREATE,
    );

  const canDeleteAttachment =
    permissions.includes(
      SITE_LOG_PERMISSIONS.ATTACHMENT_DELETE,
    );

  const editable =
    siteLog.status === "DRAFT" ||
    siteLog.status === "RETURNED";

  const canCreateIssueNow =
    siteLog.status !== "APPROVED";

  const canModifyAttachments =
    siteLog.status !== "APPROVED";

  function handleUpdate(
    payload: SiteLogUpdateInput,
  ) {
    updateSiteLog.mutate({
      projectId: projectId!,
      siteLogId: validSiteLog.id,
      payload,
    }, {
      onSuccess: () =>
        setEditOpen(false),
    });
  }

  function handleSubmit() {
    submitSiteLog.mutate({
      projectId: projectId!,
      siteLogId: validSiteLog.id,
    }, {
      onSuccess: () =>
        setSubmitOpen(false),
    });
  }

  function handleReview(
    notes: string,
  ) {
    reviewSiteLog.mutate({
      projectId: projectId!,
      siteLogId: validSiteLog.id,
      payload: {
        notes: notes || null,
      },
    }, {
      onSuccess: () =>
        setReviewOpen(false),
    });
  }

  function handleReturn(
    notes: string,
  ) {
    returnSiteLog.mutate({
      projectId: projectId!,
      siteLogId: validSiteLog.id,
      payload: {
        notes,
      },
    }, {
      onSuccess: () =>
        setReturnOpen(false),
    });
  }

  function handleApprove() {
    approveSiteLog.mutate({
      projectId: projectId!,
      siteLogId: validSiteLog.id,
    }, {
      onSuccess: () =>
        setApproveOpen(false),
    });
  }

  function handleCreateIssue(
    payload: SiteLogIssueCreateInput,
  ) {
    createIssue.mutate({
      projectId: projectId!,
      siteLogId: validSiteLog.id,
      payload,
    }, {
      onSuccess: () => {
        setIssueFormOpen(false);
      },
    });
  }

  function handleUpdateIssue(
    payload: SiteLogIssueUpdateInput,
  ) {
    if (!editingIssue) return;

    updateIssue.mutate({
      projectId: projectId!,
      siteLogId: validSiteLog.id,
      issueId: editingIssue.id,
      payload,
    }, {
      onSuccess: () => {
        setIssueFormOpen(false);
        setEditingIssue(
          undefined,
        );
      },
    });
  }

  function handleResolveIssue() {
    if (
      !resolvingIssue ||
      !resolution.trim()
    ) {
      return;
    }

    resolveIssue.mutate({
      projectId: projectId!,
      siteLogId: validSiteLog.id,
      issueId: resolvingIssue.id,
      resolution:
        resolution.trim(),
    }, {
      onSuccess: () => {
        setResolvingIssue(
          undefined,
        );
        setResolution("");
      },
    });
  }

  function handleCreateAttachment(
    payload: SiteLogAttachmentCreateInput,
  ) {
    createAttachment.mutate({
      projectId: projectId!,
      siteLogId: validSiteLog.id,
      payload,
    }, {
      onSuccess: () =>
        setAttachmentFormOpen(
          false,
        ),
    });
  }

  return (
    <div className="space-y-6 p-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            onClick={() =>
              navigate(
                `/projects/${projectId}/site-logs`,
              )
            }
            className="mb-3 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Site Reports
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">
              Site Report
            </h1>

            <SiteLogStatusBadge
              status={
                siteLog.status
              }
            />
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Report date:{" "}
            <strong>
              {siteLog.report_date}
            </strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canUpdate &&
            editable && (
              <button
                onClick={() =>
                  setEditOpen(true)
                }
                className="rounded-lg border px-4 py-2"
              >
                Edit
              </button>
            )}

          {canSubmit &&
            editable && (
              <button
                onClick={() =>
                  setSubmitOpen(true)
                }
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
              >
                Submit
              </button>
            )}

          {canReview &&
            siteLog.status ===
              "SUBMITTED" && (
              <button
                onClick={() =>
                  setReviewOpen(true)
                }
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
              >
                Review
              </button>
            )}

          {canReturn &&
            (siteLog.status ===
              "SUBMITTED" ||
              siteLog.status ===
                "REVIEWED") && (
              <button
                onClick={() =>
                  setReturnOpen(true)
                }
                className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground"
              >
                Return
              </button>
            )}

          {canApprove &&
            siteLog.status ===
              "REVIEWED" && (
              <button
                onClick={() =>
                  setApproveOpen(true)
                }
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
              >
                Approve
              </button>
            )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Workers
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {siteLog.workers_count}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Progress
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {siteLog.progress_percent}%
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Issues
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {siteLog.issues.length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Attachments
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {siteLog.attachments.length}
          </p>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="flex justify-between">
          <h2 className="font-semibold">
            Overall Progress
          </h2>

          <span className="font-semibold">
            {siteLog.progress_percent}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${Math.min(
                Math.max(
                  siteLog.progress_percent,
                  0,
                ),
                100,
              )}%`,
            }}
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Daily Site Report
        </h2>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Weather
            </p>

            <p className="mt-1 font-medium">
              {siteLog.weather
                ?.replace(
                  "_",
                  " ",
                ) ?? "Not specified"}
            </p>

            {siteLog.weather_notes && (
              <p className="mt-1 text-sm text-muted-foreground">
                {siteLog.weather_notes}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Workers Present
            </p>

            <p className="mt-1 font-medium">
              {siteLog.workers_count}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">
              Work Completed
            </p>

            <p className="mt-2 whitespace-pre-wrap">
              {siteLog.work_completed ||
                "No work summary provided."}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Material Summary
            </p>

            <p className="mt-2 whitespace-pre-wrap">
              {siteLog.material_summary ||
                "No material summary provided."}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Equipment Summary
            </p>

            <p className="mt-2 whitespace-pre-wrap">
              {siteLog.equipment_summary ||
                "No equipment summary provided."}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">
              Blockers
            </p>

            <p className="mt-2 whitespace-pre-wrap">
              {siteLog.blockers ||
                "No blockers reported."}
            </p>
          </div>
        </div>
      </section>

      {siteLog.reviewer_notes && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">
            Reviewer Notes
          </h2>

          <p className="mt-2 whitespace-pre-wrap text-sm text-amber-900">
            {siteLog.reviewer_notes}
          </p>
        </section>
      )}

      <section className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Issues & Blockers
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Operational issues associated with
              this site report.
            </p>
          </div>

          {canCreateIssue &&
            canCreateIssueNow && (
              <button
                onClick={() => {
                  setEditingIssue(
                    undefined,
                  );
                  setIssueFormOpen(
                    true,
                  );
                }}
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
              >
                Add Issue
              </button>
            )}
        </div>

        {siteLog.issues.length ===
        0 ? (
          <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No issues recorded.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {siteLog.issues.map(
              (issue) => (
                <div
                  key={issue.id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {issue.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <IssueSeverityBadge
                          severity={
                            issue.severity
                          }
                        />

                        <IssueStatusBadge
                          status={
                            issue.status
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {canUpdateIssue &&
                        canCreateIssueNow && (
                          <button
                            onClick={() => {
                              setEditingIssue(
                                issue,
                              );
                              setIssueFormOpen(
                                true,
                              );
                            }}
                            className="rounded-lg border px-3 py-1.5 text-sm"
                          >
                            Edit
                          </button>
                        )}

                      {canResolveIssue &&
                        issue.status !==
                          "RESOLVED" &&
                        issue.status !==
                          "CLOSED" && (
                          <button
                            onClick={() => {
                              setResolvingIssue(
                                issue,
                              );
                              setResolution(
                                "",
                              );
                            }}
                            className="rounded-lg border px-3 py-1.5 text-sm"
                          >
                            Resolve
                          </button>
                        )}
                    </div>
                  </div>

                  {issue.description && (
                    <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
                      {issue.description}
                    </p>
                  )}

                  {issue.resolution && (
                    <div className="mt-4 rounded-lg bg-muted/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Resolution
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-sm">
                        {issue.resolution}
                      </p>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Attachments
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Files registered against this
              site report.
            </p>
          </div>

          {canCreateAttachment &&
            canModifyAttachments && (
              <button
                onClick={() =>
                  setAttachmentFormOpen(
                    true,
                  )
                }
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
              >
                Add Attachment
              </button>
            )}
        </div>

        {siteLog.attachments.length ===
        0 ? (
          <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No attachments recorded.
          </div>
        ) : (
          <div className="mt-6 divide-y rounded-lg border">
            {siteLog.attachments.map(
              (attachment) => (
                <div
                  key={attachment.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {attachment.file_name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {
                        attachment.content_type
                      }{" "}
                      ·{" "}
                      {formatBytes(
                        attachment.size_bytes,
                      )}
                    </p>
                  </div>

                  {canDeleteAttachment &&
                    canModifyAttachments && (
                      <button
                        onClick={() =>
                          deleteAttachment.mutate(
                            {
                              projectId:
                                projectId!,
                              siteLogId:
                                siteLog.id,
                              attachmentId:
                                attachment.id,
                            },
                          )
                        }
                        disabled={
                          deleteAttachment.isPending
                        }
                        className="rounded-lg border border-destructive/30 px-3 py-1.5 text-sm text-destructive"
                      >
                        Delete
                      </button>
                    )}
                </div>
              ),
            )}
          </div>
        )}
      </section>

      <SiteLogForm
        open={editOpen}
        siteLog={siteLog}
        loading={
          updateSiteLog.isPending
        }
        onClose={() =>
          setEditOpen(false)
        }
        onCreate={(
          _payload: SiteLogCreateInput,
        ) => {}}
        onUpdate={handleUpdate}
      />

      <SubmitSiteLogDialog
        open={submitOpen}
        siteLog={siteLog}
        loading={
          submitSiteLog.isPending
        }
        onClose={() =>
          setSubmitOpen(false)
        }
        onConfirm={handleSubmit}
      />

      <ReviewSiteLogDialog
        open={reviewOpen}
        siteLog={siteLog}
        loading={
          reviewSiteLog.isPending
        }
        onClose={() =>
          setReviewOpen(false)
        }
        onConfirm={handleReview}
      />

      <ReturnSiteLogDialog
        open={returnOpen}
        siteLog={siteLog}
        loading={
          returnSiteLog.isPending
        }
        onClose={() =>
          setReturnOpen(false)
        }
        onConfirm={handleReturn}
      />

      <ApproveSiteLogDialog
        open={approveOpen}
        siteLog={siteLog}
        loading={
          approveSiteLog.isPending
        }
        onClose={() =>
          setApproveOpen(false)
        }
        onConfirm={handleApprove}
      />

      <SiteLogIssueForm
        open={issueFormOpen}
        issue={editingIssue}
        loading={
          createIssue.isPending ||
          updateIssue.isPending
        }
        onClose={() => {
          setIssueFormOpen(false);
          setEditingIssue(
            undefined,
          );
        }}
        onCreate={handleCreateIssue}
        onUpdate={handleUpdateIssue}
      />

      <SiteLogAttachmentForm
        open={attachmentFormOpen}
        loading={
          createAttachment.isPending
        }
        onClose={() =>
          setAttachmentFormOpen(
            false,
          )
        }
        onSubmit={
          handleCreateAttachment
        }
      />

      {resolvingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              Resolve Issue
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {resolvingIssue.title}
            </p>

            <textarea
              value={resolution}
              onChange={(e) =>
                setResolution(
                  e.target.value,
                )
              }
              rows={5}
              placeholder="Describe how this issue was resolved..."
              className="mt-5 w-full rounded-lg border px-3 py-2"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setResolvingIssue(
                    undefined,
                  );
                  setResolution("");
                }}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleResolveIssue
                }
                disabled={
                  resolveIssue.isPending ||
                  !resolution.trim()
                }
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
              >
                {resolveIssue.isPending
                  ? "Resolving..."
                  : "Resolve Issue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatBytes(
  bytes: number,
) {
  if (bytes === 0) return "0 Bytes";

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) /
      Math.log(1024),
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}