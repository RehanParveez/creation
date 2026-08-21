import {useMemo, useState,
} from "react";
import {useNavigate, useParams,
} from "react-router-dom";
import {useCreateSiteLog, useSiteLogs,
} from "../hooks";
import {SiteLogForm,
} from "../components/SiteLogForm";
import {SiteLogStatusBadge,
} from "../components/SiteLogStatusBadge";
import type {SiteLogCreateInput, SiteLogStatus,
} from "../types/siteOperations.types";
import {useAuthStore,
} from "@/app/store";
import { SITE_LOG_PERMISSIONS,
} from "../types/siteOperations.types";

export function SiteLogsPage() {
  const { projectId } =
    useParams<{
      projectId: string;
    }>();

  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user,
  );

  const permissions =
    user?.permissions ?? [];

  const query = useSiteLogs(
    projectId,
  );

  const createSiteLog =
    useCreateSiteLog();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<
      SiteLogStatus | "ALL"
    >("ALL");

  const [formOpen, setFormOpen] =
    useState(false);

  const reports =
    query.data ?? [];

  const filtered =
    useMemo(() => {
      const normalized =
        search
          .trim()
          .toLowerCase();

      return reports.filter(
        (report) => {
          const matchesSearch =
            !normalized ||
            report.report_date
              .toLowerCase()
              .includes(normalized) ||
            report.work_completed
              ?.toLowerCase()
              .includes(normalized) ||
            report.blockers
              ?.toLowerCase()
              .includes(normalized);

          const matchesStatus =
            status === "ALL" ||
            report.status === status;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      reports,
      search,
      status,
    ]);

  if (!projectId) {
    return (
      <div className="p-6">
        Project ID is missing.
      </div>
    );
  }

  const validProjectId = projectId;

  if (query.isLoading) {
    return (
      <div className="p-6">
        Loading site reports...
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8">
          <h2 className="font-semibold">
            Unable to load site reports
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

  function handleCreate(
  payload: SiteLogCreateInput,
) {
  createSiteLog.mutate(
    {
      projectId: validProjectId,
      payload,
    },
    {
      onSuccess: (siteLog) => {
        setFormOpen(false);

        navigate(
          `/projects/${validProjectId}/site-logs/${siteLog.id}`,
        );
      },
    },
  );
}

  const canCreate =
    permissions.includes(
      SITE_LOG_PERMISSIONS.CREATE,
    );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Site Reports
          </h1>

          <p className="mt-1 text-muted-foreground">
            Daily construction site reports,
            progress and operational issues.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() =>
              setFormOpen(true)
            }
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            New Site Report
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search reports..."
          className="w-full rounded-lg border px-3 py-2 md:max-w-md"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as
                | SiteLogStatus
                | "ALL",
            )
          }
          className="rounded-lg border px-3 py-2"
        >
          <option value="ALL">
            All statuses
          </option>
          <option value="DRAFT">
            Draft
          </option>
          <option value="SUBMITTED">
            Submitted
          </option>
          <option value="REVIEWED">
            Reviewed
          </option>
          <option value="RETURNED">
            Returned
          </option>
          <option value="APPROVED">
            Approved
          </option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="font-semibold">
            No site reports found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create the first daily site report
            for this project.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Weather
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Workers
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Progress
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3" />
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (report) => (
                    <tr
                      key={report.id}
                      className="border-b last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-4 py-4 font-medium">
                        {report.report_date}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {report.weather
                          ?.replace(
                            "_",
                            " ",
                          ) ??
                          "—"}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {report.workers_count}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium">
                        {report.progress_percent}%
                      </td>

                      <td className="px-4 py-4">
                        <SiteLogStatusBadge
                          status={
                            report.status
                          }
                        />
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(
                              `/projects/${projectId}/site-logs/${report.id}`,
                            )
                          }
                          className="rounded-lg border px-3 py-1.5 text-sm"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SiteLogForm
        open={formOpen}
        loading={
          createSiteLog.isPending
        }
        onClose={() =>
          setFormOpen(false)
        }
        onCreate={handleCreate}
        onUpdate={() => {}}
      />
    </div>
  );
}