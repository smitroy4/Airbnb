import axios from "axios";

import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "../utils/tokenUtils";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      removeAccessToken();
    }

    return Promise.reject(error);
  }
);

export default api;