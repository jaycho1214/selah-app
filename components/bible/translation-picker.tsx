import { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Check, Download, Trash2, RefreshCw } from "lucide-react-native";
import { useBibleStore } from "@/lib/stores/bible-store";
import {
  getRemoteTranslations,
  getDownloadedTranslations,
  downloadTranslation,
  updateTranslation,
  deleteTranslation,
  DownloadProgress,
  RemoteTranslation,
} from "@/lib/bible/offline";

interface TranslationPickerProps {
  onClose?: () => void;
}

interface LocalTranslation {
  id: string;
  name: string;
  version: string | null;
  downloadedAt: Date | null;
}

export function TranslationPicker({ onClose }: TranslationPickerProps) {
  const { currentTranslation, setTranslation } = useBibleStore();
  const [remoteTranslations, setRemoteTranslations] = useState<
    RemoteTranslation[]
  >([]);
  const [localTranslations, setLocalTranslations] = useState<
    LocalTranslation[]
  >([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch remote translations and check local status on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [remote, local] = await Promise.all([
          getRemoteTranslations(),
          getDownloadedTranslations(),
        ]);
        setRemoteTranslations(remote);
        setLocalTranslations(local);
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getLocalTranslation = (id: string) =>
    localTranslations.find((t) => t.id === id);

  const isDownloaded = (id: string) => {
    const local = getLocalTranslation(id);
    return local && local.downloadedAt !== null;
  };

  const hasUpdate = (id: string) => {
    const local = getLocalTranslation(id);
    const remote = remoteTranslations.find((t) => t.id === id);
    return local && remote && local.version !== remote.version;
  };

  const handleSelect = (translationId: string) => {
    setTranslation(translationId);
    onClose?.();
  };

  const handleDownload = async (translationId: string) => {
    setDownloading(translationId);
    try {
      await downloadTranslation(translationId, setProgress);
      // Refresh local translations list
      const local = await getDownloadedTranslations();
      setLocalTranslations(local);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(null);
      setProgress(null);
    }
  };

  const handleUpdate = async (translationId: string) => {
    setDownloading(translationId);
    try {
      await updateTranslation(translationId, setProgress);
      // Refresh local translations list
      const local = await getDownloadedTranslations();
      setLocalTranslations(local);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setDownloading(null);
      setProgress(null);
    }
  };

  const handleDelete = async (translationId: string) => {
    try {
      await deleteTranslation(translationId);
      setLocalTranslations((prev) =>
        prev.filter((t) => t.id !== translationId),
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return (
      <View className="p-4 items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="p-4">
      <Text className="text-foreground text-base font-semibold mb-3">
        Translation
      </Text>

      {remoteTranslations.map((translation) => {
        const isSelected = currentTranslation === translation.id;
        const downloaded = isDownloaded(translation.id);
        const updateAvailable = hasUpdate(translation.id);
        const isDownloading = downloading === translation.id;
        const local = getLocalTranslation(translation.id);

        return (
          <View
            key={translation.id}
            className="flex-row items-center justify-between py-3 border-b border-border"
          >
            <Pressable
              onPress={() => handleSelect(translation.id)}
              className="flex-1 flex-row items-center"
            >
              <View
                className={`w-5 h-5 rounded-full mr-3 items-center justify-center ${
                  isSelected ? "bg-primary" : "border border-muted-foreground"
                }`}
              >
                {isSelected && (
                  <Check size={12} className="text-primary-foreground" />
                )}
              </View>
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-foreground text-base">
                    {translation.name}
                  </Text>
                  {updateAvailable && (
                    <View className="bg-primary/20 px-1.5 py-0.5 rounded">
                      <Text className="text-primary text-xs font-medium">
                        Update
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-muted-foreground text-xs">
                  {downloaded
                    ? `v${local?.version} - Available offline`
                    : "Online only"}
                </Text>
              </View>
            </Pressable>

            {/* Action buttons */}
            {isDownloading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" />
                <Text className="text-muted-foreground text-xs">
                  {progress?.progress ?? 0}%
                </Text>
              </View>
            ) : updateAvailable ? (
              <View className="flex-row items-center">
                <Pressable
                  onPress={() => handleUpdate(translation.id)}
                  className="p-2"
                >
                  <RefreshCw size={18} className="text-primary" />
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(translation.id)}
                  className="p-2"
                >
                  <Trash2 size={18} className="text-muted-foreground" />
                </Pressable>
              </View>
            ) : downloaded ? (
              <Pressable
                onPress={() => handleDelete(translation.id)}
                className="p-2"
              >
                <Trash2 size={18} className="text-muted-foreground" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => handleDownload(translation.id)}
                className="p-2"
              >
                <Download size={18} className="text-primary" />
              </Pressable>
            )}
          </View>
        );
      })}

      <Text className="text-muted-foreground text-xs mt-3">
        Downloaded translations work without internet connection
      </Text>
    </View>
  );
}
