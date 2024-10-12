import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'http://localhost:3000/api';  // Your base API URL

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


// Attach the token dynamically
axiosInstance.interceptors.request.use(
  async config => {
    const jsonValue = await AsyncStorage.getItem('token');
    const token = jsonValue != null ? jsonValue : '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
export const axiosUnauthenticated = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});



