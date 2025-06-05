import axios from 'axios';
import type { AxiosResponse, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
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

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/auth`,
      timeout: 10000,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
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
