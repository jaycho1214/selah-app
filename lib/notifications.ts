import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { commitMutation, graphql, type Environment } from "relay-runtime";

// ---------------------------------------------------------------------------
// GraphQL mutations
// ---------------------------------------------------------------------------

const RegisterTokenMutation = graphql`
  mutation notificationsRegisterTokenMutation($token: String!) {
    registerExpoPushToken(token: $token)
  }
`;

const UnregisterTokenMutation = graphql`
  mutation notificationsUnregisterTokenMutation($token: String!) {
    unregisterExpoPushToken(token: $token)
  }
`;

// ---------------------------------------------------------------------------
// Push token registration
// ---------------------------------------------------------------------------

/**
 * Request permissions, set up Android channel, and return an Expo push token.
 * Returns null on simulator or when permission is denied.
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device");
    return null;
  }

  // Set up Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return tokenData.data;
}

// ---------------------------------------------------------------------------
// Server registration / unregistration
// ---------------------------------------------------------------------------

export function registerTokenWithServer(
  environment: Environment,
  token: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: RegisterTokenMutation,
      variables: { token },
      onCompleted: () => resolve(),
      onError: (error) => reject(error),
    });
  });
}

export function unregisterTokenFromServer(
  environment: Environment,
  token: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: UnregisterTokenMutation,
      variables: { token },
      onCompleted: () => resolve(),
      onError: (error) => reject(error),
    });
  });
}
