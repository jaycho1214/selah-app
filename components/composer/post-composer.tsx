import { forwardRef } from "react";
import { isLiquidGlassAvailable } from "expo-glass-effect";

import { PostComposerLegacy } from "./post-composer-legacy";
import { PostComposerGlass } from "./post-composer-glass";
import type { PostComposerRef, PostComposerProps } from "./use-composer-state";

export type { PostComposerRef, PostComposerProps } from "./use-composer-state";

const hasGlass = isLiquidGlassAvailable();

export const PostComposer = forwardRef<PostComposerRef, PostComposerProps>(
  function PostComposer(props, ref) {
    if (hasGlass) {
      return <PostComposerGlass ref={ref} {...props} />;
    }
    return <PostComposerLegacy ref={ref} {...props} />;
  },
);
