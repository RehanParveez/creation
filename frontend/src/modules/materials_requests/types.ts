export type MaterialRequisitionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "CANCELLED";

export type MaterialRequisitionPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

export interface MaterialRequisitionItem {
  id: string;
  requisition_id: string;

  item_code: string;
  material_name: string;
  description: string | null;
  unit: string;

  requested_quantity: string | number;
  approved_quantity: string | number;
  fulfilled_quantity: string | number;

  notes: string | null;

  created_at: string;
}

export interface MaterialRequisition {
  id: string;

  organization_id: string;
  project_id: string;
  requested_by: string;

  requisition_number: string;

  title: string;
  description: string | null;

  priority: MaterialRequisitionPriority;
  status: MaterialRequisitionStatus;

  needed_by: string | null;

  approved_by: string | null;
  approved_at: string | null;

  rejection_reason: string | null;

  created_at: string;

  items: MaterialRequisitionItem[];
}

export interface MaterialRequisitionCreateInput {
  title: string;
  description?: string | null;
  priority: MaterialRequisitionPriority;
  needed_by?: string | null;
}

export interface MaterialRequisitionUpdateInput {
  title?: string;
  description?: string | null;
  priority?: MaterialRequisitionPriority;
  needed_by?: string | null;
}

export interface MaterialRequisitionItemCreateInput {
  item_code: string;
  material_name: string;
  description?: string | null;
  unit: string;
  requested_quantity: number;
  notes?: string | null;
}

export interface MaterialRequisitionItemUpdateInput {
  item_code?: string;
  material_name?: string;
  description?: string | null;
  unit?: string;
  requested_quantity?: number;
  notes?: string | null;
}

export interface MaterialRequisitionApprovalItem {
  item_id: string;
  approved_quantity: number;
}

export interface MaterialRequisitionApproveInput {
  items: MaterialRequisitionApprovalItem[];
}

export interface MaterialRequisitionRejectInput {
  reason: string;
}

export interface MaterialRequisitionFulfillmentItem {
  item_id: string;
  fulfilled_quantity: number;
}

export interface MaterialRequisitionFulfillInput {
  items: MaterialRequisitionFulfillmentItem[];
}

export interface MaterialRequisitionSummary {
  requisition_id: string;
  project_id: string;

  status: MaterialRequisitionStatus;
  priority: MaterialRequisitionPriority;

  total_items: number;

  total_requested_quantity: string | number;
  total_approved_quantity: string | number;
  total_fulfilled_quantity: string | number;

  fulfillment_percentage: string | number;
}

export interface MaterialRequisitionListParams {
  skip?: number;
  limit?: number;
}