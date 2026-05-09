import React, { useState, useEffect } from 'react';
// Added FlatList to this line below
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'; 
import { api } from '../api/github';
import { Colors } from '../theme/colors';
import CommitItem from '../components/CommitItem';

export default function CommitScreen({ route }) {
  const { fullName } = route.params;
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/repos/${fullName}/commits`)
      .then(res => setCommits(res.data))
      .catch(() => alert("Error loading commits"))
      .finally(() => setLoading(false));
  }, [fullName]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.accent} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={commits}
          keyExtractor={(item) => item.sha}
          ListHeaderComponent={() => (
            <Text style={styles.listHeader}>Recent Activity ({commits.length})</Text>
          )}
          renderItem={({ item }) => <CommitItem item={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  listHeader: { 
    color: Colors.muted, 
    fontSize: 13, 
    textTransform: 'uppercase', 
    padding: 15, 
    letterSpacing: 1 
  },
});