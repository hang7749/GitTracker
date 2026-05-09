import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export default function RepoCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.repoCard} onPress={onPress}>
      <View style={styles.repoHeader}>
        <Text style={styles.repoName}>{item.name}</Text>
        {item.private && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Private</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.repoDesc} numberOfLines={2}>
        {item.description || "No description provided."}
      </Text>
      
      <View style={styles.repoFooter}>
        <Text style={styles.repoInfoText}>{item.language || "Plain Text"}</Text>
        <Text style={styles.repoInfoText}>⭐ {item.stargazers_count}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  repoCard: { 
    backgroundColor: Colors.card, 
    marginHorizontal: 15, 
    marginTop: 12, 
    padding: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: Colors.border 
  },
  repoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  repoName: { fontSize: 18, fontWeight: 'bold', color: Colors.accent },
  badge: { backgroundColor: '#21262D', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  badgeText: { color: Colors.muted, fontSize: 10, fontWeight: '600' },
  repoDesc: { color: Colors.muted, fontSize: 14, marginVertical: 8 },
  repoFooter: { flexDirection: 'row', gap: 15 },
  repoInfoText: { color: Colors.text, fontSize: 12 },
});