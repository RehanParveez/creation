import {useNavigate, useParams,
} from "react-router-dom";
import {useProjectBudget, useCreateBudget,
} from "../hooks";
import {BudgetForm,
} from "../components/BudgetForm";
import {BudgetEmptyState,
} from "../components/BudgetEmptyState";

export function ProjectBudgetPage() {
  const {
    projectId,
  } = useParams<{
    projectId: string;
  }>();

  const navigate =
    useNavigate();

  const query =
    useProjectBudget(projectId!);

  const createBudget =
    useCreateBudget();

  if (!projectId) {
    return (
      <div className="p-6">
        Invalid project.
      </div>
    );
  }

  if (query.isLoading) {
    return (
      <div className="p-6">
        Loading project budget...
      </div>
    );
  }

  if (
    query.isError &&
    (query.error as any)?.response
      ?.status !== 404
  ) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8">
          <h2 className="font-semibold">
            Unable to load project budget
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

  if (query.data) {
    navigate(
      `/budgets/${query.data.id}`,
      {
        replace: true,
      },
    );

    return null;
  }

  return (
    <div className="p-6">
      <BudgetEmptyState
        title="No Budget for This Project"
        description="Create the project's budget and begin adding BOQ items."
        action={
          <div className="mx-auto max-w-xl rounded-xl border bg-card p-6 text-left">
            <h2 className="mb-5 text-lg font-semibold">
              Create Project Budget
            </h2>

            <BudgetForm
              loading={
                createBudget.isPending
              }
              submitLabel = "Create Budget"
              onSubmit={(values) => {
                createBudget.mutate(
                 {
                  projectId: projectId!,
                  payload: {
                   name: values.name!,
                   description:
                    values.description!,
                },
              },
              {
                onSuccess: (
                 budget,
                ) => {
                 navigate(
                  `/budgets/${budget.id}`,
                );
               },
              },
             );
           }}
            />
          </div>
        }
      />
    </div>
  );
}