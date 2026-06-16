import axios from 'axios';
import { API_BASE_URL } from './env';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout for all requests (IMPORTANT for mobile)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
