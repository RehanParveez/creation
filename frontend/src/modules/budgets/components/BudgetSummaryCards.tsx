import type {BudgetSummary,
} from "../types/budget.types";

interface Props {
  summary: BudgetSummary;
  currency?: string;
}

function formatCurrency(
  value: number,
  currency = "PKR",
) {
  return new Intl.NumberFormat(
    undefined,
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    },
  ).format(value);
}

export function BudgetSummaryCards({
  summary,
  currency = "PKR",
}: Props) {
  const cards = [
    {
      label: "Estimated Budget",
      value: formatCurrency(
        summary.estimatedBudget,
        currency,
      ),
    },
    {
      label: "Approved Budget",
      value: formatCurrency(
        summary.approvedBudget,
        currency,
      ),
    },
    {
      label: "Actual Cost",
      value: formatCurrency(
        summary.actualCost,
        currency,
      ),
    },
    {
      label: "Committed Cost",
      value: formatCurrency(
        summary.committedCost,
        currency,
      ),
    },
    {
      label: "Remaining Budget",
      value: formatCurrency(
        summary.remainingBudget,
        currency,
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border bg-card p-5"
        >
          <p className="text-sm text-muted-foreground">
            {card.label}
          </p>

          <p className="mt-2 text-xl font-semibold">
            {card.value}
          </p>
        </div>
      ))}

      <div className="rounded-xl border bg-card p-5 sm:col-span-2 lg:col-span-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Budget Utilization
          </p>

          <p className="text-sm font-semibold">
            {summary.usagePercentage.toFixed(2)}%
          </p>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${Math.min(
                Math.max(
                  summary.usagePercentage,
                  0,
                ),
                100,
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}