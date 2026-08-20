import {useMemo, useState,
} from "react";
import {useNavigate,
} from "react-router-dom";
import { useBudgets,
} from "../hooks";
import { BudgetStatusBadge,
} from "../components/BudgetStatusBadge";
import {calculateEstimatedBudget,
} from "../utils/budget.calculations";

import type {
  BudgetStatus,
} from "../types/budget.types";

export function BudgetsPage() {
  const navigate =
    useNavigate();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<
      BudgetStatus | "ALL"
    >("ALL");

  const query =
    useBudgets();

  const budgets =
    query.data ?? [];

  const filtered =
    useMemo(() => {
      const normalized =
        search
          .trim()
          .toLowerCase();

      return budgets.filter(
        (budget) => {
          const matchesSearch =
            !normalized ||
            budget.name
              .toLowerCase()
              .includes(
                normalized,
              ) ||
            budget.project_id
              .toLowerCase()
              .includes(
                normalized,
              );

          const matchesStatus =
            status === "ALL" ||
            budget.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      budgets,
      search,
      status,
    ]);

  if (query.isLoading) {
    return (
      <div className="p-6">
        Loading budgets...
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8">
          <h2 className="font-semibold">
            Unable to load budgets
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

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Budgets
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage project budgets and approval workflows.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value,
            )
          }
          placeholder="Search budgets..."
          className="flex-1 rounded-lg border px-3 py-2"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as
                | BudgetStatus
                | "ALL",
            )
          }
          className="rounded-lg border px-3 py-2"
        >
          <option value="ALL">
            All Statuses
          </option>

          <option value="DRAFT">
            Draft
          </option>

          <option value="PENDING_APPROVAL">
            Pending Approval
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h3 className="font-semibold">
            No budgets found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">
                    Budget
                  </th>

                  <th className="px-4 py-3 text-left">
                    Project
                  </th>

                  <th className="px-4 py-3 text-left">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right">
                    Estimated
                  </th>

                  <th className="px-4 py-3 text-right">
                    Items
                  </th>

                  <th className="px-4 py-3" />
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (budget) => (
                    <tr
                      key={budget.id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-4 font-medium">
                        {budget.name}
                      </td>

                      <td className="px-4 py-4 font-mono text-xs">
                        {budget.project_id}
                      </td>

                      <td className="px-4 py-4">
                        <BudgetStatusBadge
                          status={
                            budget.status
                          }
                        />
                      </td>

                      <td className="px-4 py-4 text-right">
                        {new Intl.NumberFormat(
                          undefined,
                          {
                            style:
                              "currency",
                            currency:
                              "PKR",
                          },
                        ).format(
                          calculateEstimatedBudget(
                            budget.items,
                          ),
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {budget.items.length}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(
                              `/budgets/${budget.id}`,
                            )
                          }
                          className="rounded-lg border px-3 py-1.5"
                        >
                          View
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
    </div>
  );
}