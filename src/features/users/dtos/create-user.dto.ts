import type { UserSettings } from '../interfaces/UserSettingsInterface';

export interface CreateUserDTO {
  nombre: string;
  apellido: string;
  usuario: string;
  contrasena?: string;
  correo: string;
  telefono: string;
  direccion?: string;
  rol?: string;
  estado?: string;
  foto?: string;
  configuracion?: UserSettings;
  roles?: string[]
}
