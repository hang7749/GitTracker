// github.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

// Call this function when the app boots up or when the user enters a new token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};