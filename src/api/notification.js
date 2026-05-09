import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { api } from './github';

const BACKGROUND_FETCH_TASK = 'check-new-commits';

// 1. Define the task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Replace with a specific repo you want to track, or fetch your repo list
    const repo = "your-username/your-repo"; 
    const response = await api.get(`/repos/${repo}/commits?per_page=1`);
    const latestCommit = response.data[0];
    const latestSha = latestCommit.sha;

    // 2. Get the last SHA we saw
    const lastSeenSha = await SecureStore.getItemAsync('last_seen_sha');

    if (latestSha !== lastSeenSha) {
      // 3. Trigger a System Notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Commit Detected! 🚀",
          body: `${latestCommit.commit.author.name}: ${latestCommit.commit.message}`,
          data: { repo: repo },
        },
        trigger: null, // Show immediately
      });

      // 4. Update the "Seen" SHA
      await SecureStore.setItemAsync('last_seen_sha', latestSha);
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// 2. Register the task
export async function registerBackgroundFetch() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // Check every 15 minutes
    stopOnTerminate: false,   // Continue after app is closed
    startOnBoot: true,        // Start when phone restarts
  });
}