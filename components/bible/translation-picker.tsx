import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
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
import { useColors } from "@/hooks/use-colors";
import { CommonStyles } from "@/constants/styles";

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
  const colors = useColors();
  const currentTranslation = useBibleStore((s) => s.currentTranslation);
  const setTranslation = useBibleStore((s) => s.setTranslation);
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
      <View style={[styles.container, { alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>Translation</Text>

      {remoteTranslations.map((translation) => {
        const isSelected = currentTranslation === translation.id;
        const downloaded = isDownloaded(translation.id);
        const updateAvailable = hasUpdate(translation.id);
        const isDownloading = downloading === translation.id;
        const local = getLocalTranslation(translation.id);

        return (
          <View
            key={translation.id}
            style={[
              CommonStyles.rowBetween,
              styles.row,
              { borderBottomColor: colors.border },
            ]}
          >
            <Pressable
              onPress={() => handleSelect(translation.id)}
              style={styles.selectButton}
            >
              <View
                style={[
                  styles.radio,
                  isSelected
                    ? { backgroundColor: colors.primary }
                    : { borderWidth: 1, borderColor: colors.mutedForeground },
                ]}
              >
                {isSelected && (
                  <Check size={12} color={colors.primaryForeground} />
                )}
              </View>
              <View>
                <View style={[CommonStyles.row, { gap: 8 }]}>
                  <Text
                    style={[styles.translationName, { color: colors.text }]}
                  >
                    {translation.name}
                  </Text>
                  {updateAvailable && (
                    <View
                      style={[
                        styles.updateBadge,
                        { backgroundColor: colors.muted },
                      ]}
                    >
                      <Text
                        style={[
                          styles.updateBadgeText,
                          { color: colors.primary },
                        ]}
                      >
                        Update
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[styles.statusText, { color: colors.mutedForeground }]}
                >
                  {downloaded
                    ? `v${local?.version} - Available offline`
                    : "Online only"}
                </Text>
              </View>
            </Pressable>

            {/* Action buttons */}
            {isDownloading ? (
              <View style={[CommonStyles.row, { gap: 8 }]}>
                <ActivityIndicator size="small" />
                <Text
                  style={[styles.statusText, { color: colors.mutedForeground }]}
                >
                  {progress?.progress ?? 0}%
                </Text>
              </View>
            ) : updateAvailable ? (
              <View style={CommonStyles.row}>
                <Pressable
                  onPress={() => handleUpdate(translation.id)}
                  style={styles.actionButton}
                >
                  <RefreshCw size={18} color={colors.primary} />
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(translation.id)}
                  style={styles.actionButton}
                >
                  <Trash2 size={18} color={colors.mutedForeground} />
                </Pressable>
              </View>
            ) : downloaded ? (
              <Pressable
                onPress={() => handleDelete(translation.id)}
                style={styles.actionButton}
              >
                <Trash2 size={18} color={colors.mutedForeground} />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => handleDownload(translation.id)}
                style={styles.actionButton}
              >
                <Download size={18} color={colors.primary} />
              </Pressable>
            )}
          </View>
        );
      })}

      <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
        Downloaded translations work without internet connection
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  selectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  translationName: {
    fontSize: 16,
  },
  updateBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  updateBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusText: {
    fontSize: 12,
  },
  actionButton: {
    padding: 8,
  },
  footerText: {
    fontSize: 12,
    marginTop: 12,
  },
});
