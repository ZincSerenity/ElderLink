// src/router.tsx
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { queryClient } from './queryClient';

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

export const getRouter = () => router;

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}