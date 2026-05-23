import { type ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store/store';
import { queryClient } from '../lib/query/queryClient';
import { Toaster } from 'react-hot-toast';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position='top-right' />
    </QueryClientProvider>
  </ReduxProvider>
);
