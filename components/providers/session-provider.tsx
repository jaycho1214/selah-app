import { createContext, useContext, PropsWithChildren } from 'react';
import { authClient, useSession as useAuthSession } from '@/lib/auth-client';

type Session = ReturnType<typeof useAuthSession>['data'];

interface SessionContextValue {
  session: Session;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const { data: session, isPending } = useAuthSession();

  const signOut = async () => {
    await authClient.signOut();
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading: isPending,
        signOut
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
