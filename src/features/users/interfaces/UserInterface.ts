import type { UserSettings } from './UserSettingsInterface';

export interface User {
  _id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  contrasena: string;
  correo: string;
  telefono: string;
  direccion?: string;
  rol: string;
  estado: string;
  configuracion: UserSettings;
  foto?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
