import RepoCard from '../components/RepoCard'; // Import the new component

// Inside the FlatList:
<FlatList
  data={filteredRepos}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <RepoCard 
      item={item} 
      onPress={() => navigation.navigate('Commits', { fullName: item.full_name })} 
    />
  )}
/>