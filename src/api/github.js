import axios from 'axios';

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;

export const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});