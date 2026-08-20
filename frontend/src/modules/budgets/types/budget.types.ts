export type BudgetStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type BudgetItemCategory =
  | "MATERIALS"
  | "LABOUR"
  | "EQUIPMENT"
  | "SUBCONTRACTOR"
  | "OTHER";

export interface BudgetItem {
  id: string;
  budget_id: string;
  item_code: string;
  description: string;
  category: BudgetItemCategory;
  unit: string;
  planned_quantity: string | number;
  estimated_unit_cost: string | number;
  estimated_total_cost: string | number;
  actual_cost: string | number;
  created_at: string;
}

export interface Budget {
  id: string;
  organization_id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: BudgetStatus;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  items: BudgetItem[];
}

export interface BudgetCreateInput {
  name: string;
  description?: string | null;
}

export interface BudgetUpdateInput {
  name?: string;
  description?: string | null;
}

export interface BudgetItemCreateInput {
  item_code: string;
  description: string;
  category: BudgetItemCategory;
  unit: string;
  planned_quantity: number;
  estimated_unit_cost: number;
}

export interface BudgetItemUpdateInput {
  item_code?: string;
  description?: string;
  category?: BudgetItemCategory;
  unit?: string;
  planned_quantity?: number;
  estimated_unit_cost?: number;
}

export interface BudgetSummary {
  estimatedBudget: number;
  approvedBudget: number;
  actualCost: number;
  committedCost: number;
  remainingBudget: number;
  usagePercentage: number;
}