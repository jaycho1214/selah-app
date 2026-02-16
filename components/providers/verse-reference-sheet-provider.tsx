import React, { createContext, useCallback, useContext, useRef } from "react";
import { useRelayEnvironment } from "react-relay";
import {
  VerseReferenceSheet,
  VerseReferenceSheetRef,
} from "@/components/verse/verse-reference-sheet";

interface VerseReferenceSheetContextValue {
  openVerseReference: (verseId: string, label: string) => void;
}

const VerseReferenceSheetContext =
  createContext<VerseReferenceSheetContextValue | null>(null);

export function VerseReferenceSheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const sheetRef = useRef<VerseReferenceSheetRef>(null);
  const environment = useRelayEnvironment();

  const openVerseReference = useCallback(
    (verseId: string, label: string) => {
      sheetRef.current?.present({ verseId, label });
    },
    [],
  );

  return (
    <VerseReferenceSheetContext.Provider value={{ openVerseReference }}>
      {children}
      <VerseReferenceSheet ref={sheetRef} environment={environment} />
    </VerseReferenceSheetContext.Provider>
  );
}

export function useVerseReferenceSheet() {
  const context = useContext(VerseReferenceSheetContext);
  if (!context) {
    throw new Error(
      "useVerseReferenceSheet must be used within a VerseReferenceSheetProvider",
    );
  }
  return context;
}
