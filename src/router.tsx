import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ({ error, reset }) => (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Error</h1>
        <pre>{error.message}</pre>
        <button onClick={reset}>Reintentar</button>
      </div>
    ),
    defaultNotFoundComponent: () => (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>404</h1>
        <p>Página no encontrada</p>
      </div>
    ),
  });

  return router;
};
