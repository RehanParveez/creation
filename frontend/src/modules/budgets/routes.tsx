import type {RouteObject,
} from "react-router-dom";
import {BudgetsPage, BudgetDetailPage, ProjectBudgetPage,
} from "./pages";

export const budgetRoutes:
  RouteObject[] = [
    {
      path: "/budgets",
      element: <BudgetsPage />,
    },
    {
      path: "/budgets/:budgetId",
      element: <BudgetDetailPage />,
    },
    {
      path: "/projects/:projectId/budget",
      element: <ProjectBudgetPage />,
    },
  ];