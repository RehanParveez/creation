interface Props {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function BudgetEmptyState({
  title = "No Budget",
  description = "No budget has been created for this project yet.",
  action,
}: Props) {
  return (
    <div className="rounded-xl border border-dashed p-12 text-center">
      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}