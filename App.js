import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, TextInput, StatusBar 
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { format } from 'date-fns';

const Stack = createStackNavigator();

// Dark Theme Configuration for Navigation
const MyDarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0D1117',
    card: '#161B22',
    text: '#C9D1D9',
    border: '#30363D',
  },
};

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

// --- SCREEN 1: REPO LIST ---
function RepoListScreen({ navigation }) {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const response = await api.get('/user/repos?sort=updated&per_page=100');
      setRepos(response.data);
      setFilteredRepos(response.data);
    } catch (err) {
      alert("Failed to load repositories.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = repos.filter(r => r.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredRepos(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerSection}>
        <TextInput 
          style={styles.searchBar}
          placeholder="Search repositories..."
          placeholderTextColor="#8B949E"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#58A6FF" style={{flex: 1}} />
      ) : (
        <FlatList
          data={filteredRepos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.repoCard} 
              onPress={() => navigation.navigate('Commits', { fullName: item.full_name })}
            >
              <View style={styles.repoHeader}>
                <Text style={styles.repoName}>{item.name}</Text>
                {item.private && <View style={styles.badge}><Text style={styles.badgeText}>Private</Text></View>}
              </View>
              <Text style={styles.repoDesc} numberOfLines={2}>
                {item.description || "No description provided."}
              </Text>
              <View style={styles.repoFooter}>
                <Text style={styles.repoLang}>{item.language || "Plain Text"}</Text>
                <Text style={styles.repoStars}>⭐ {item.stargazers_count}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// --- SCREEN 2: COMMIT DETAILS ---
function CommitScreen({ route }) {
  const { fullName } = route.params;
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/repos/${fullName}/commits`)
      .then(res => setCommits(res.data))
      .catch(() => alert("Error loading commits"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#58A6FF" style={{flex: 1}} />
      ) : (
        <FlatList
          data={commits}
          keyExtractor={(item) => item.sha}
          ListHeaderComponent={() => (
            <Text style={styles.listHeader}>Recent Activity ({commits.length})</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.commitCard}>
              <View style={styles.commitIndicator} />
              <View style={styles.commitContent}>
                <Text style={styles.message} numberOfLines={2}>{item.commit.message}</Text>
                <View style={styles.commitMeta}>
                  <Text style={styles.authorName}>{item.commit.author.name}</Text>
                  <Text style={styles.commitDate}>
                    {format(new Date(item.commit.author.date), 'MMM d, h:mm a')}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  headerSection: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#30363D' },
  searchBar: { 
    backgroundColor: '#161B22', 
    color: '#C9D1D9', 
    padding: 12, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#30363D' 
  },
  repoCard: { 
    backgroundColor: '#161B22', 
    marginHorizontal: 15, 
    marginTop: 15, 
    padding: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#30363D' 
  },
  repoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  repoName: { fontSize: 18, fontWeight: 'bold', color: '#58A6FF' },
  badge: { backgroundColor: '#21262D', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, borderWidth: 1, borderColor: '#30363D' },
  badgeText: { color: '#8B949E', fontSize: 10, fontWeight: '600' },
  repoDesc: { color: '#8B949E', fontSize: 14, marginVertical: 8 },
  repoFooter: { flexDirection: 'row', gap: 15 },
  repoLang: { color: '#C9D1D9', fontSize: 12 },
  repoStars: { color: '#C9D1D9', fontSize: 12 },
  
  listHeader: { color: '#8B949E', fontSize: 13, textTransform: 'uppercase', padding: 15, letterSpacing: 1 },
  commitCard: { 
    flexDirection: 'row', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#21262D' 
  },
  commitIndicator: { width: 4, backgroundColor: '#238636', borderRadius: 2, marginRight: 15 },
  commitContent: { flex: 1 },
  message: { color: '#C9D1D9', fontSize: 15, fontWeight: '500' },
  commitMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  authorName: { color: '#58A6FF', fontSize: 13 },
  commitDate: { color: '#8B949E', fontSize: 12 }
});

export default function App() {
  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#161B22', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#30363D' },
          headerTintColor: '#C9D1D9',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Repositories" component={RepoListScreen} />
        <Stack.Screen name="Commits" component={CommitScreen} options={({ route }) => ({ title: route.params.fullName.split('/')[1] })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}