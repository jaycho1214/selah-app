import { Platform } from "react-native";
import type { SelectedImage } from "@/components/verse/image-picker-grid";
import { authClient } from "@/lib/auth-client";

const API_URL = __DEV__
  ? (process.env.EXPO_PUBLIC_API_URL ?? "https://selah.kr")
  : "https://selah.kr";

interface UploadResult {
  id: string;
  url: string;
  fileName: string;
}

/**
 * Uploads selected images to the server and returns their asset IDs.
 * Uses the same cookie-based auth as the Relay network layer.
 */
export async function uploadPostImages(
  images: SelectedImage[],
): Promise<string[]> {
  if (images.length === 0) return [];

  const cookie = Platform.OS === "web" ? "" : (authClient.getCookie() ?? "");

  const results = await Promise.all(
    images.map(async (image) => {
      const formData = new FormData();
      formData.append("file", {
        uri: image.uri,
        type: image.mimeType ?? "image/jpeg",
        name: `post-image.${getExtension(image.mimeType)}`,
      } as unknown as Blob);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          ...(cookie ? { cookie } : {}),
        },
        credentials: Platform.OS === "web" ? "include" : "omit",
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.code ?? "Upload failed");
      }
      return data.data as UploadResult;
    }),
  );

  return results.map((r) => r.id);
}

function getExtension(mimeType?: string): string {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}
