import type { UserRole } from '../interfaces/UserInterface';
import type { UserSettings } from '../interfaces/UserSettingsInterface';

export interface CreateUserDTO {
  nombre: string;
  apellido: string;
  usuario: string;
  contrasena?: string;
  correo: string;
  telefono: string;
  direccion?: {
    calle: string;
    casa: string;
    ciudad: string;
  };
  rol?: UserRole;
  estado?: string;
  foto?: string;
  configuracion?: UserSettings;
  roles?: string[]
}
