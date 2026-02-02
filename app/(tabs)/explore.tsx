import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RichTextEditor, RichTextRenderer } from '@/components/rich-text';

export default function ExploreScreen() {
  const [showEditor, setShowEditor] = useState(false);
  const [content, setContent] = useState('<p>Hello, <strong>world</strong>!</p>');

  if (showEditor) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row justify-between items-center p-4 border-b border-border bg-background">
          <Text className="text-lg font-semibold">Rich Text Editor</Text>
          <TouchableOpacity
            className="py-2 px-4"
            onPress={() => setShowEditor(false)}
          >
            <Text className="text-primary font-semibold">Done</Text>
          </TouchableOpacity>
        </View>
        <RichTextEditor
          initialContent={content}
          onContentChange={setContent}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <Text className="text-2xl font-bold">Rich Text POC</Text>
        <Text className="text-muted-foreground mt-2 mb-6">
          Proof-of-concept for verse post creation
        </Text>

        {/* Card: Rendered Content */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Rendered Content</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[60px]">
            <RichTextRenderer html={content} />
          </CardContent>
        </Card>

        {/* Edit Button */}
        <Button
          className="mb-6"
          onPress={() => setShowEditor(true)}
        >
          Edit Content
        </Button>

        {/* Raw HTML Display */}
        <View className="bg-muted rounded-lg p-4">
          <Text className="text-xs font-mono opacity-60 mb-2">Raw HTML:</Text>
          <Text className="text-xs font-mono">{content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
