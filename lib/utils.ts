import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Decode Relay global ID to get the raw database ID
 * Relay global IDs are base64 encoded "typename:id"
 */
export function decodeGlobalId(globalId: string): string {
  try {
    const decoded = atob(globalId);
    const parts = decoded.split(":");
    return parts.length > 1 ? parts[1] : globalId;
  } catch {
    return globalId;
  }
}

/**
 * Generate shareable URL for a post
 */
export function getPostShareUrl(postId: string): string {
  const rawId = decodeGlobalId(postId);
  return `https://selah.kr/post/${rawId}`;
}

/**
 * Generate shareable URL for one or more verses.
 * Accepts a single Relay global ID or an array of them.
 * Produces `/verse/1,2,3` format for multiple verses.
 */
export function getVerseShareUrl(verseGlobalIds: string | string[]): string {
  const ids = Array.isArray(verseGlobalIds) ? verseGlobalIds : [verseGlobalIds];
  const rawIds = ids.map(decodeGlobalId).join(",");
  return `https://selah.kr/verse/${rawIds}`;
}
