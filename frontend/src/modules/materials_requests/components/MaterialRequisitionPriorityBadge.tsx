import type {
  MaterialRequisitionPriority,
} from "../types";
import { priorityLabel } from "../utils";

interface Props {
  priority: MaterialRequisitionPriority;
}

export function MaterialRequisitionPriorityBadge({
  priority,
}: Props) {
  const className =
    {
      LOW:
        "bg-gray-100 text-gray-700",
      NORMAL:
        "bg-blue-100 text-blue-700",
      HIGH:
        "bg-orange-100 text-orange-700",
      URGENT:
        "bg-red-100 text-red-700",
    }[priority];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {priorityLabel(priority)}
    </span>
  );
}