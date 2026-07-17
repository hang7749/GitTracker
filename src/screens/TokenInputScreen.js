import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from '../api/github';
import { Colors } from '../theme/colors';

export default function TokenInputScreen({ navigation }) {
  const [token, setToken] = useState('');

  // Load existing token on boot if available
  useEffect(() => {
    async function loadToken() {
      const savedToken = await SecureStore.getItemAsync('user_github_token');
      if (savedToken) {
        setToken(savedToken);
        setAuthToken(savedToken);
      }
    }
    loadToken();
  }, []);

  const handleSaveToken = async () => {
    if (!token.trim()) {
      Alert.alert("Error", "Please enter a valid GitHub token.");
      return;
    }

    try {
      // 1. Save locally for next app launch
      await SecureStore.setItemAsync('user_github_token', token.trim());
      
      // 2. Update current Axios instances active headers
      setAuthToken(token.trim());

      Alert.alert("Success", "Token saved successfully!", [
        { text: "OK", onPress: () => navigation.goBack() } // or redirect to your repo screen
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save the token safely.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>GitHub Personal Access Token</Text>
      <TextInput
        style={styles.input}
        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
        placeholderTextColor={Colors.muted}
        value={token}
        onChangeText={setToken}
        secureTextEntry={true} // Obscures the token for privacy
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveToken}>
        <Text style={styles.buttonText}>Save Token</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    color: Colors.muted,
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#fff', // Or adapt to your theme palette
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});