export const MATERIAL_REQUISITION_PERMISSIONS = {
  READ: "material_requisition:read",
  CREATE: "material_requisition:create",
  UPDATE: "material_requisition:update",
  DELETE: "material_requisition:delete",

  SUBMIT: "material_requisition:submit",
  APPROVE: "material_requisition:approve",
  REJECT: "material_requisition:reject",
  FULFILL: "material_requisition:fulfill",
  CANCEL: "material_requisition:cancel",
} as const;