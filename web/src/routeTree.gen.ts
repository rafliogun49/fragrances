// Route tree for TanStack Router (manually maintained — no CLI codegen).
// Each route is registered with createFileRoute and imported here.

import { createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';
import { Route as IndexRoute } from './routes/index';
import { Route as QuizRoute } from './routes/quiz';
import { Route as QuizEmailRoute } from './routes/quiz/email';
import { Route as ResultsRoute } from './routes/results';
import { Route as AdminIndexRoute } from './routes/admin/index';
import { Route as AdminLeadsRoute } from './routes/admin/leads';
import { Route as AdminCatalogRoute } from './routes/admin/catalog';
import { Route as CatalogRoute } from './routes/catalog';

// Flat route tree — all routes are children of root.
// Quiz/email is nested under /quiz so it shares the /quiz prefix.
const routeTree = rootRoute.addChildren([
  IndexRoute,
  QuizRoute,
  QuizEmailRoute,
  ResultsRoute,
  CatalogRoute,
  AdminIndexRoute,
  AdminLeadsRoute,
  AdminCatalogRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
