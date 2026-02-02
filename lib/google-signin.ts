import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';

/**
 * Configure Google Sign-In with web client ID for server verification.
 * Must be called once before any sign-in attempts (e.g., in app startup).
 */
export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false, // We only need idToken for server verification
  });
}

/**
 * Sign in with Google and return the idToken for server verification.
 * @returns idToken string if successful, null if cancelled
 * @throws Error if sign-in fails for reasons other than cancellation
 */
export async function signInWithGoogle(): Promise<string | null> {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      return response.data.idToken ?? null;
    }

    return null;
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // User cancelled - not an error
          return null;
        case statusCodes.IN_PROGRESS:
          // Sign-in already in progress
          return null;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          throw new Error('Google Play Services not available');
        default:
          throw error;
      }
    }
    throw error;
  }
}

/**
 * Sign out from Google (client-side only).
 * Call this alongside Better Auth signOut for complete logout.
 */
export async function signOutFromGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore sign-out errors - user may not be signed in with Google
  }
}
