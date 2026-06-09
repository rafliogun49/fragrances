import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './routeTree.gen';
import { queryClient } from './lib/queryClient';
import { LangProvider } from './lib/langContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </LangProvider>
  </StrictMode>,
);
