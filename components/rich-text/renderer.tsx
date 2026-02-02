import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import WebView from 'react-native-webview';

interface RichTextRendererProps {
  html: string;
}

/**
 * Renders HTML content produced by RichTextEditor.
 * Uses WebView for consistent cross-platform rendering.
 */
export function RichTextRenderer({ html }: RichTextRendererProps) {
  const { width } = useWindowDimensions();

  const wrappedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #1a1a1a;
          padding: 0;
          margin: 0;
        }
        p {
          margin-bottom: 12px;
        }
        p:last-child {
          margin-bottom: 0;
        }
        strong {
          font-weight: 600;
        }
        em {
          font-style: italic;
        }
        ul, ol {
          margin-left: 20px;
          margin-bottom: 12px;
        }
        blockquote {
          border-left: 3px solid #e0e0e0;
          padding-left: 12px;
          margin-left: 0;
          color: #666;
        }
        code {
          background-color: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SF Mono', Menlo, Monaco, monospace;
          font-size: 14px;
        }
        a {
          color: #0066cc;
          text-decoration: none;
        }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `;

  return (
    <View style={[styles.container, { width: width - 32 }]}>
      <WebView
        source={{ html: wrappedHtml }}
        style={styles.webview}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    backgroundColor: 'transparent',
  },
  webview: {
    backgroundColor: 'transparent',
    minHeight: 60,
  },
});
