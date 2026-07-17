import React, { useEffect } from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';

// Internal Imports
import RepoListScreen from './src/screens/RepoListScreen';
import CommitScreen from './src/screens/CommitScreen';
import CommitDetailScreen from './src/screens/CommitDetailScreen';
import TokenInputScreen from './src/screens/TokenInputScreen'; // 1. Import your new screen
import { Colors } from './src/theme/colors';

const Stack = createStackNavigator();

const MyDarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    card: Colors.card,
    text: Colors.text,
    border: Colors.border,
  },
};

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar barStyle="light-content" />
        <NavigationContainer theme={MyDarkTheme}>
          <Stack.Navigator 
            screenOptions={{
              headerStyle: { backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
              headerTintColor: Colors.text,
            }}
          >
            {/* Main Application Flow */}
            <Stack.Screen 
              name="Repositories" 
              component={RepoListScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen name="Commits" component={CommitScreen} />
            <Stack.Screen name="CommitDetail" component={CommitDetailScreen} options={{ title: 'Review Changes' }} />
            
            {/* 2. Added the Token Setup Screen as a Modal */}
            <Stack.Screen 
              name="TokenInput" 
              component={TokenInputScreen} 
              options={{ 
                title: 'GitHub Authentication',
                presentation: 'modal', // Makes it slide up from the bottom on iOS
              }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}