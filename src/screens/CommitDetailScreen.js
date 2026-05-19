import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { api } from '../api/github';
import { Colors } from '../theme/colors';

export default function CommitDetailScreen({ route }) {
  const { fullName, sha } = route.params;
  const [commitDetails, setCommitDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/repos/${fullName}/commits/${sha}`)
      .then(res => setCommitDetails(res.data))
      .catch(() => alert("Error loading code changes"))
      .finally(() => setLoading(false));
  }, [sha]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.accent} style={{ flex: 1, backgroundColor: Colors.background }} />;
  }

  const renderFileDiff = ({ item }) => {
    // GitHub provides line changes in a single string split by newlines (\n)
    const lines = item.patch ? item.patch.split('\n') : [];

    return (
      <View style={styles.fileCard}>
        <Text style={styles.fileName}>📄 {item.filename}</Text>
        <Text style={styles.fileStats}>
          ++{item.additions}  --{item.deletions}
        </Text>
        
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.patchContainer}>
            {lines.map((line, index) => {
              // Color code based on git standard syntax
              let backgroundColor = 'transparent';
              let textColor = Colors.text;

              if (line.startsWith('+')) {
                backgroundColor = '#14321A'; // Light green background
                textColor = '#3FB950';       // Green text
              } else if (line.startsWith('-')) {
                backgroundColor = '#3C1618'; // Light red background
                textColor = '#F85149';       // Red text
              } else if (line.startsWith('@@')) {
                backgroundColor = '#161B22'; // Code block location header
                textColor = Colors.muted;
              }

              return (
                <View key={index} style={[styles.codeLineWrapper, { backgroundColor }]}>
                  <Text style={[styles.codeLineText, { color: textColor }]}>
                    {line}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={commitDetails?.files || []}
        keyExtractor={(item) => item.filename}
        ListHeaderComponent={() => (
          <View style={styles.metaHeader}>
            <Text style={styles.commitMessage}>{commitDetails?.commit?.message}</Text>
            <Text style={styles.authorText}>By {commitDetails?.commit?.author?.name}</Text>
          </View>
        )}
        renderItem={renderFileDiff}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  metaHeader: { padding: 15, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.card },
  commitMessage: { color: Colors.text, fontSize: 16, fontWeight: 'bold' },
  authorText: { color: Colors.muted, fontSize: 13, marginTop: 5 },
  fileCard: { backgroundColor: Colors.card, margin: 10, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  fileName: { color: Colors.accent, fontWeight: 'bold', padding: 10, fontSize: 14, backgroundColor: '#21262D' },
  fileStats: { color: Colors.muted, fontSize: 11, paddingHorizontal: 10, paddingBottom: 5, backgroundColor: '#21262D' },
  patchContainer: { paddingVertical: 5, minWidth: 500 },
  codeLineWrapper: { paddingHorizontal: 10, py: 2, width: '100%' },
  codeLineText: { fontFamily: 'Courier', fontSize: 12 },
});