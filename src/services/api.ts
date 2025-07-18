/** src/services/api.ts */
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Variables de estado para coordinar refresh ----
let isRefreshing: boolean = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.endsWith('/auth/refresh')) {
        processQueue(error, null)

        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise(( resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        })
      }
      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            { withCredentials: true }
          )
          const newToken = response.data.access_token;
          localStorage.setItem('access_token', newToken)

          processQueue(null, newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          resolve(api(originalRequest))
        } catch (error) {
          processQueue(error, null)

          reject(error)
        } finally {
          isRefreshing = false;
        }
      })

      /* const refreshToken = localStorage.getItem('refresh_token');
      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      const newAccessToken = response.data.access_token;
      localStorage.setItem('access_token', newAccessToken);
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return api(originalRequest); */
    }
    return Promise.reject(error);
  }
);

export default api;
