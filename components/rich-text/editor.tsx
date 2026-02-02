import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RichText,
  Toolbar,
  useEditorBridge,
  TenTapStartKit,
  CoreBridge,
} from '@10play/tentap-editor';

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange?: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  initialContent = '',
  onContentChange,
  placeholder = 'Start writing...',
}: RichTextEditorProps) {
  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: initialContent || `<p>${placeholder}</p>`,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(`
        body {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          padding: 16px;
        }
      `),
    ],
    onChange: async () => {
      if (onContentChange) {
        const html = await editor.getHTML();
        onContentChange(html);
      }
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.editorContainer}>
        <RichText editor={editor} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editorContainer: {
    flex: 1,
  },
  keyboardView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
