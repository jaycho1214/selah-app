import { useCallback } from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { X, ImagePlus } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { Text } from "@/components/ui/text";

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface SelectedImage {
  uri: string;
  width: number;
  height: number;
  mimeType?: string;
}

interface ImagePickerGridProps {
  images: SelectedImage[];
  onImagesChange: (images: SelectedImage[]) => void;
  colors: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
  };
}

export function ImagePickerGrid({
  images,
  onImagesChange,
  colors,
}: ImagePickerGridProps) {
  const pickImages = useCallback(async () => {
    try {
      if (images.length >= MAX_IMAGES) {
        Alert.alert(
          "Limit Reached",
          `You can only attach up to ${MAX_IMAGES} images.`,
        );
        return;
      }

      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to attach images.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: MAX_IMAGES - images.length,
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const validImages: SelectedImage[] = [];

        for (const asset of result.assets) {
          // Validate asset has required properties
          if (!asset.uri || !asset.width || !asset.height) {
            continue;
          }

          // Check file size (rough estimate from dimensions)
          if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
            Alert.alert(
              "Image Too Large",
              "One or more images exceed the 10MB limit.",
            );
            continue;
          }

          validImages.push({
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
            mimeType: asset.mimeType,
          });
        }

        if (validImages.length > 0) {
          onImagesChange([...images, ...validImages].slice(0, MAX_IMAGES));
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  }, [images, onImagesChange]);

  const removeImage = useCallback(
    (index: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onImagesChange(images.filter((_, i) => i !== index));
    },
    [images, onImagesChange],
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={styles.container}
    >
      <View style={styles.grid}>
        {images.map((image, index) => (
          <Animated.View
            key={image.uri}
            layout={Layout.springify()}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={[
              styles.imageContainer,
              images.length === 1 && styles.singleImage,
              images.length === 2 && styles.doubleImage,
              images.length >= 3 && styles.gridImage,
            ]}
          >
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
            <Pressable
              onPress={() => removeImage(index)}
              style={[styles.removeButton, { backgroundColor: colors.bg }]}
              hitSlop={8}
            >
              <X size={14} color={colors.text} />
            </Pressable>
          </Animated.View>
        ))}

        {/* Add more button if under limit */}
        {images.length > 0 && images.length < MAX_IMAGES && (
          <Animated.View
            layout={Layout.springify()}
            entering={FadeIn.duration(200)}
            style={[
              styles.addMoreContainer,
              images.length === 1 && styles.doubleImage,
              images.length >= 2 && styles.gridImage,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <Pressable onPress={pickImages} style={styles.addMoreButton}>
              <ImagePlus size={24} color={colors.textMuted} />
              <Text style={[styles.addMoreText, { color: colors.textMuted }]}>
                {images.length}/{MAX_IMAGES}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

// Standalone button to trigger image picker
export function ImagePickerButton({
  onImagesSelected,
  currentCount,
  colors,
}: {
  onImagesSelected: (images: SelectedImage[]) => void;
  currentCount: number;
  colors: {
    textMuted: string;
    accent: string;
  };
}) {
  const handlePress = useCallback(async () => {
    try {
      if (currentCount >= MAX_IMAGES) {
        Alert.alert(
          "Limit Reached",
          `You can only attach up to ${MAX_IMAGES} images.`,
        );
        return;
      }

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to attach images.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: MAX_IMAGES - currentCount,
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const validImages: SelectedImage[] = result.assets
          .filter((asset) => asset.uri && asset.width && asset.height)
          .map((asset) => ({
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
            mimeType: asset.mimeType,
          }));

        if (validImages.length > 0) {
          onImagesSelected(validImages);
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  }, [currentCount, onImagesSelected]);

  const isDisabled = currentCount >= MAX_IMAGES;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={{ opacity: isDisabled ? 0.5 : 1 }}
    >
      <ImagePlus
        size={22}
        color={currentCount > 0 ? colors.accent : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  singleImage: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  doubleImage: {
    width: "48%",
    aspectRatio: 1,
  },
  gridImage: {
    width: "31%",
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  addMoreContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  addMoreButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addMoreText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
