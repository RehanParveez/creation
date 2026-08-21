export type SiteLogStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "REVIEWED"
  | "RETURNED"
  | "APPROVED";

export type WeatherCondition =
  | "SUNNY"
  | "PARTLY_CLOUDY"
  | "CLOUDY"
  | "RAIN"
  | "HEAVY_RAIN"
  | "STORM"
  | "EXTREME_HEAT"
  | "OTHER";

export type IssueSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type IssueStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface SiteLogIssue {
  id: string;
  site_log_id: string;
  title: string;
  description: string | null;
  severity: IssueSeverity;
  status: IssueStatus;
  resolution: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteLogAttachment {
  id: string;
  site_log_id: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
}

export interface SiteLog {
  id: string;
  project_id: string;
  report_date: string;
  status: SiteLogStatus;

  weather: WeatherCondition | null;
  weather_notes: string | null;

  workers_count: number;

  work_completed: string | null;
  material_summary: string | null;
  equipment_summary: string | null;

  progress_percent: number;

  blockers: string | null;
  reviewer_notes: string | null;

  submitted_by_id: string;
  reviewed_by_id: string | null;

  created_at: string;
  updated_at: string;

  issues: SiteLogIssue[];
  attachments: SiteLogAttachment[];
}

export interface SiteLogCreateInput {
  report_date: string;
  weather?: WeatherCondition | null;
  weather_notes?: string | null;
  workers_count: number;
  work_completed?: string | null;
  material_summary?: string | null;
  equipment_summary?: string | null;
  progress_percent: number;
  blockers?: string | null;
}

export interface SiteLogUpdateInput {
  weather?: WeatherCondition | null;
  weather_notes?: string | null;
  workers_count?: number;
  work_completed?: string | null;
  material_summary?: string | null;
  equipment_summary?: string | null;
  progress_percent?: number;
  blockers?: string | null;
}

export interface SiteLogReviewInput {
  notes?: string | null;
}

export interface SiteLogReturnInput {
  notes: string;
}

export interface SiteLogIssueCreateInput {
  title: string;
  description?: string | null;
  severity: IssueSeverity;
}

export interface SiteLogIssueUpdateInput {
  title?: string | null;
  description?: string | null;
  severity?: IssueSeverity | null;
  status?: IssueStatus | null;
  resolution?: string | null;
}

export interface SiteLogAttachmentCreateInput {
  file_name: string;
  storage_key: string;
  content_type: string;
  size_bytes: number;
}

export const SITE_LOG_PERMISSIONS = {
  READ: "site_log:read",
  CREATE: "site_log:create",
  UPDATE: "site_log:update",
  SUBMIT: "site_log:submit",
  REVIEW: "site_log:review",
  APPROVE: "site_log:approve",
  RETURN: "site_log:return",

  ISSUE_READ: "site_log_issue:read",
  ISSUE_CREATE: "site_log_issue:create",
  ISSUE_UPDATE: "site_log_issue:update",
  ISSUE_RESOLVE: "site_log_issue:resolve",

  ATTACHMENT_CREATE: "site_log_attachment:create",
  ATTACHMENT_DELETE: "site_log_attachment:delete",
} as const;

export const WEATHER_OPTIONS: {
  value: WeatherCondition;
  label: string;
}[] = [
  { value: "SUNNY", label: "Sunny" },
  { value: "PARTLY_CLOUDY", label: "Partly Cloudy" },
  { value: "CLOUDY", label: "Cloudy" },
  { value: "RAIN", label: "Rain" },
  { value: "HEAVY_RAIN", label: "Heavy Rain" },
  { value: "STORM", label: "Storm" },
  { value: "EXTREME_HEAT", label: "Extreme Heat" },
  { value: "OTHER", label: "Other" },
];

export const ISSUE_SEVERITY_OPTIONS: {
  value: IssueSeverity;
  label: string;
}[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export const ISSUE_STATUS_OPTIONS: {
  value: IssueStatus;
  label: string;
}[] = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];