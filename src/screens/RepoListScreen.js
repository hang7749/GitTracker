import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../api/github';
import { Colors } from '../theme/colors';
import RepoCard from '../components/RepoCard';

export default function RepoListScreen({ navigation }) {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lastSeenData, setLastSeenData] = useState({}); // To store seen SHAs

  useEffect(() => {
    fetchRepos();
    loadSeenStatus();
  }, []);

  const loadSeenStatus = async () => {
    const seenData = await SecureStore.getItemAsync('seen_commits');
    if (seenData) setLastSeenData(JSON.parse(seenData));
  };

  const fetchRepos = async () => {
    try {
      const response = await api.get('/user/repos?sort=updated&per_page=100');
      setRepos(response.data);
      setFilteredRepos(response.data); // Initialize the filtered list too!
    } catch (err) {
      alert("Failed to load repositories.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    // Filter the original 'repos' and save result to 'filteredRepos'
    const filtered = repos.filter(r => 
      r.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRepos(filtered);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerSection}>
        <Text style={styles.headerText}>Repositories</Text>
        <TextInput 
          style={styles.searchBar}
          placeholder="Search repositories..."
          placeholderTextColor={Colors.muted}
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.accent} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={filteredRepos} // <--- Using the state here
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            
            const isUnread = lastSeenData[item.full_name] !== item.pushed_at;

            return (
              <RepoCard 
                item={item} 
                isUnread={isUnread} // Pass it to the component
                onPress={() => {
                  navigation.navigate('Commits', { fullName: item.full_name });
                }}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerSection: { 
    paddingHorizontal: 15, 
    paddingBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.border 
  },
  headerText: { 
    color: Colors.text, 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginVertical: 10 
  },
  searchBar: { 
    backgroundColor: Colors.card, 
    color: Colors.text, 
    padding: 10, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: Colors.border, 
    height: 45 
  },
});