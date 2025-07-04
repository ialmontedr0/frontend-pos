import type { UserSettings } from './UserSettingsInterface';

export type UserRole = 'admin' | 'cajero' | 'inventarista';
export type Estado = 'activo' | 'inactivo';

export interface User {
  _id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  contrasena: string;
  correo: string;
  telefono: string;
  direccion?: string;
  rol: UserRole;
  estado: string;
  configuracion: UserSettings;
  foto?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: { _id: string; usuario: string };
  updatedBy?: { _id: string; usuario: string };
}
