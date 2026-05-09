import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Colors } from '../theme/colors';

export default function CommitItem({ item }) {
  return (
    <View style={styles.commitCard}>
      <View style={styles.commitIndicator} />
      <View style={styles.commitContent}>
        <Text style={styles.message} numberOfLines={2}>
          {item.commit.message}
        </Text>
        <View style={styles.commitMeta}>
          <Text style={styles.authorName}>{item.commit.author.name}</Text>
          <Text style={styles.commitDate}>
            {format(new Date(item.commit.author.date), 'MMM d, h:mm a')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commitCard: { 
    flexDirection: 'row', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#21262D' 
  },
  commitIndicator: { width: 4, backgroundColor: Colors.success, borderRadius: 2, marginRight: 15 },
  commitContent: { flex: 1 },
  message: { color: Colors.text, fontSize: 15, fontWeight: '500' },
  commitMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  authorName: { color: Colors.accent, fontSize: 13 },
  commitDate: { color: Colors.muted, fontSize: 12 }
});