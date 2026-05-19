import React, { useEffect } from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications';

// Internal Imports
import RepoListScreen from './src/screens/RepoListScreen';
import CommitScreen from './src/screens/CommitScreen';
import CommitDetailScreen from './src/screens/CommitDetailScreen';
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

// Configure how notifications behave when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Please enable notifications to track commits!');
      }
    };
    requestPermissions();
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
            <Stack.Screen 
              name="Repositories" 
              component={RepoListScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen name="Commits" component={CommitScreen} />
            <Stack.Screen name="CommitDetail" component={CommitDetailScreen} options={{ title: 'Review Changes' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}