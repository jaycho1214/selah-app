import React, { Suspense, useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useLazyLoadQuery } from 'react-relay';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RichTextEditor, RichTextRenderer } from '@/components/rich-text';
import type { exploreTestQuery } from '@/lib/relay/__generated__/exploreTestQuery.graphql';

// Test query to verify GraphQL connection
// Uses bibleVersePosts connection to test connectivity
const TestQuery = graphql`
  query exploreTestQuery {
    bibleVersePosts(first: 1) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

function GraphQLStatus() {
  const data = useLazyLoadQuery<exploreTestQuery>(TestQuery, {});
  const postCount = data.bibleVersePosts?.edges?.length ?? 0;

  return (
    <View className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 mb-4 flex-row items-center gap-2">
      <Text className="text-green-700 dark:text-green-400 font-medium">
        GraphQL: Connected (fetched {postCount} post{postCount !== 1 ? 's' : ''})
      </Text>
    </View>
  );
}

function GraphQLStatusLoading() {
  return (
    <View className="bg-muted rounded-lg p-3 mb-4 flex-row items-center gap-2">
      <ActivityIndicator size="small" />
      <Text className="text-muted-foreground">Connecting to GraphQL...</Text>
    </View>
  );
}

function GraphQLStatusError({ error }: { error: Error }) {
  return (
    <View className="bg-red-100 dark:bg-red-900/20 rounded-lg p-3 mb-4">
      <Text className="text-red-700 dark:text-red-400">
        GraphQL: {error.message || 'Connection error'}
      </Text>
    </View>
  );
}

class GraphQLStatusErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <GraphQLStatusError error={this.state.error} />;
    }
    return this.props.children;
  }
}

function GraphQLStatusContainer() {
  return (
    <GraphQLStatusErrorBoundary>
      <Suspense fallback={<GraphQLStatusLoading />}>
        <GraphQLStatus />
      </Suspense>
    </GraphQLStatusErrorBoundary>
  );
}

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

        {/* GraphQL Connection Status */}
        <GraphQLStatusContainer />

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
