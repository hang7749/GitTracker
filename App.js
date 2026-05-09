import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TextInput, 
  TouchableOpacity, ActivityIndicator, SafeAreaView 
} from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';

export default function App() {
  const [repo, setRepo] = useState('facebook/react-native');
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCommits = async () => {
    setLoading(true);
    setError('');
    try {
      // GitHub API Call
      const response = await axios.get(`https://api.github.com/repos/${repo}/commits`);
      setCommits(response.data);
    } catch (err) {
      setError('Repository not found or API limit reached!');
      setCommits([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.commitCard}>
      <Text style={styles.message} numberOfLines={2}>{item.commit.message}</Text>
      <View style={styles.footer}>
        <Text style={styles.author}>{item.commit.author.name}</Text>
        <Text style={styles.date}>
          {format(new Date(item.commit.author.date), 'MMM do, yyyy')}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Git Commit Tracker</Text>
      
      <View style={styles.searchBox}>
        <TextInput 
          style={styles.input}
          placeholder="owner/repository"
          value={repo}
          onChangeText={setRepo}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={fetchCommits}>
          <Text style={styles.buttonText}>Track</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={commits}
          keyExtractor={(item) => item.sha}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
  searchBox: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginLeft: 10, justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  commitCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  message: { fontSize: 16, fontWeight: '600', color: '#333' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  author: { fontSize: 13, color: '#007AFF' },
  date: { fontSize: 12, color: '#888' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 }
});