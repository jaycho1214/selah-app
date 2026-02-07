import {
  createContext,
  useContext,
  useRef,
  useCallback,
  PropsWithChildren,
} from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { authClient, useSession as useAuthSession } from "@/lib/auth-client";
import { SignInSheet } from "@/components/auth/sign-in-sheet";

type Session = ReturnType<typeof useAuthSession>["data"];

interface SessionContextValue {
  session: Session;
  isLoading: boolean;
  signOut: () => Promise<void>;
  /** Present sign-in sheet for protected actions */
  presentSignIn: () => void;
  /** Returns true if user is authenticated */
  isAuthenticated: boolean;
  /**
   * Require authentication for an action.
   * If authenticated, executes the action immediately.
   * If not, presents sign-in sheet.
   */
  requireAuth: (action: () => void) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const { data: session, isPending } = useAuthSession();
  const signInSheetRef = useRef<BottomSheetModal>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const isAuthenticated = !!session;

  const signOut = async () => {
    await authClient.signOut();
  };

  const presentSignIn = useCallback(() => {
    signInSheetRef.current?.present();
  }, []);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        pendingActionRef.current = action;
        presentSignIn();
      }
    },
    [isAuthenticated, presentSignIn],
  );

  const handleSignInSuccess = useCallback(() => {
    // Execute pending action after successful sign-in
    if (pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading: isPending,
        signOut,
        presentSignIn,
        isAuthenticated,
        requireAuth,
      }}
    >
      {children}
      <SignInSheet ref={signInSheetRef} onSignInSuccess={handleSignInSuccess} />
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
