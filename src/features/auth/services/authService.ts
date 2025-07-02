import axios from 'axios';
import type { AxiosResponse, AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import type {
  LoginDTO,
  LoginResponseDTO,
  ValidateCodeDTO,
  ChangePasswordDTO,
  RecoverPasswordDTO,
  ResetPasswordDTO,
} from '../dtos/index.dto';
import type { User } from '../../users/interfaces/UserInterface';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000';

class AuthService {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (token: string) => void;
    reject: (err: any) => void;
  }[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/auth`,
      timeout: 30000,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });

    // Agregar request interceptor para adjuntar token
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (config.url?.endsWith('/refresh')) {
        return config;
      }

      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    // Manejamos el 401
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Si no es 401
        if (
          error.response?.status !== 401 ||
          originalRequest._retry ||
          originalRequest.url?.endsWith('/refresh')
        ) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (this.isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          });
        }

        this.isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const resp = await this.client.post<{ access_token: string }>('/refresh');
            const newToken = resp.data.access_token;

            // Guardar nuevo token
            localStorage.setItem('access_token', newToken);

            // Resolver todos los pendientes
            this.failedQueue.forEach((p) => p.resolve(newToken));
            this.failedQueue = [];

            // Repetimos la peticion original con el header actualizado
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            }

            resolve(this.client(originalRequest));
          } catch (error) {
            this.failedQueue.forEach((p) => p.reject(error));
            this.failedQueue = [];
            reject(error);
          } finally {
            this.isRefreshing = false;
          }
        });
      }
    );
  }

  login(payload: LoginDTO): Promise<AxiosResponse<LoginResponseDTO>> {
    return this.client.post<LoginResponseDTO>('/login', payload);
  }

  async getCurrentUser(): Promise<AxiosResponse<User>> {
    return this.client.get(`/current-user`);
  }

  logout(): Promise<AxiosResponse<void>> {
    return this.client.post('/logout');
  }

  recoverPassword(payload: RecoverPasswordDTO): Promise<AxiosResponse<void>> {
    return this.client.post('/recover', payload);
  }

  validateCode(payload: ValidateCodeDTO): Promise<AxiosResponse<{ valid: boolean }>> {
    return this.client.post('/validate', payload);
  }

  changePassword(payload: ChangePasswordDTO): Promise<AxiosResponse<void>> {
    return this.client.post('/change', payload);
  }

  resetPassword(payload: ResetPasswordDTO): Promise<AxiosResponse<void>> {
    return this.client.post<void>('/reset', payload);
  }
}

export const authService = new AuthService();
