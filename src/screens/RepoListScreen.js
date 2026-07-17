import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  ActivityIndicator, 
  StyleSheet,
  TouchableOpacity // Imported for the settings button
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native'; // Hook to detect screen focus
import * as SecureStore from 'expo-secure-store'; // Added missing SecureStore import
import { api } from '../api/github';
import { Colors } from '../theme/colors';
import RepoCard from '../components/RepoCard';

export default function RepoListScreen({ navigation }) {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lastSeenData, setLastSeenData] = useState({});

  const isFocused = useIsFocused(); // Tracks if this screen is currently visible

  // Re-run checks/fetching whenever the screen comes into focus
  useEffect(() => {
    if (isFocused) {
      checkTokenAndFetch();
    }
  }, [isFocused]);

  const checkTokenAndFetch = async () => {
    setLoading(true);
    try {
      // 1. Check if the user has setup a token yet
      const token = await SecureStore.getItemAsync('user_github_token');
      
      if (!token) {
        // Redirect to token setup if empty
        setLoading(false);
        navigation.navigate('TokenInput');
        return;
      }

      // 2. If token exists, proceed to load data
      await loadSeenStatus();
      await fetchRepos();
    } catch (err) {
      alert("Something went wrong initializing app data.");
      setLoading(false);
    }
  };

  const loadSeenStatus = async () => {
    const seenData = await SecureStore.getItemAsync('seen_commits');
    if (seenData) setLastSeenData(JSON.parse(seenData));
  };

  const fetchRepos = async () => {
    try {
      const response = await api.get('/user/repos?sort=updated&per_page=100');
      setRepos(response.data);
      setFilteredRepos(response.data);
    } catch (err) {
      // If the response is a 401 unauthorized, their token might be expired/invalid
      if (err.response && err.response.status === 401) {
        alert("Invalid or expired GitHub token. Please update it.");
        navigation.navigate('TokenInput');
      } else {
        alert("Failed to load repositories.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = repos.filter(r => 
      r.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRepos(filtered);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerSection}>
        {/* Added a row container to balance the header title and a Token settings button */}
        <View style={styles.titleRow}>
          <Text style={styles.headerText}>Repositories</Text>
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => navigation.navigate('TokenInput')}
          >
            <Text style={styles.settingsButtonText}>⚙️ Token</Text>
          </TouchableOpacity>
        </View>

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
          data={filteredRepos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isUnread = lastSeenData[item.full_name] !== item.pushed_at;

            return (
              <RepoCard 
                item={item} 
                isUnread={isUnread}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  headerText: { 
    color: Colors.text, 
    fontSize: 22, 
    fontWeight: 'bold', 
  },
  settingsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border
  },
  settingsButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600'
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