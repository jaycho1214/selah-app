import { ReactNode } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { environment } from '@/lib/relay/environment';

interface RelayProviderProps {
  children: ReactNode;
}

export function RelayProvider({ children }: RelayProviderProps) {
  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
