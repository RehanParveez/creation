import type {BudgetCreateInput, BudgetItemCreateInput, BudgetItemUpdateInput, BudgetUpdateInput,
} from "../types/budget.types";

export type ValidationErrors =
  Record<string, string>;

export function validateBudget(
  values: BudgetCreateInput | BudgetUpdateInput,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (
    values.name !== undefined &&
    !values.name.trim()
  ) {
    errors.name = "Budget name is required.";
  }

  if (
    values.name !== undefined &&
    values.name.trim().length > 200
  ) {
    errors.name =
      "Budget name cannot exceed 200 characters.";
  }

  return errors;
}

export function validateBudgetItem(
  values:
    | BudgetItemCreateInput
    | BudgetItemUpdateInput,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (
    values.item_code !== undefined &&
    !values.item_code.trim()
  ) {
    errors.item_code =
      "Item code is required.";
  }

  if (
    values.description !== undefined &&
    !values.description.trim()
  ) {
    errors.description =
      "Description is required.";
  }

  if (
    values.unit !== undefined &&
    !values.unit.trim()
  ) {
    errors.unit = "Unit is required.";
  }

  if (
    values.planned_quantity !== undefined &&
    values.planned_quantity <= 0
  ) {
    errors.planned_quantity =
      "Quantity must be greater than zero.";
  }

  if (
    values.estimated_unit_cost !== undefined &&
    values.estimated_unit_cost < 0
  ) {
    errors.estimated_unit_cost =
      "Unit cost cannot be negative.";
  }

  return errors;
}