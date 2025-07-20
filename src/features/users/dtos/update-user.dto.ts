import type { Estado } from "../interfaces/UserInterface";

export interface UpdateUserDTO {
  nombre?: string;
  apellido?: string;
  usuario?: string;
  correo?: string;
  telefono?: string;
  direccion?: {
    calle: string;
    casa: string;
    ciudad: string;
  };
  rol?: string;
  estado?: Estado;
  configuracion?: {
    tema?: string;
    idioma?: string;
    moneda?: string;
    tamanoTexto?: string;
    zonaHoraria?: string;
  };
  foto?: string;
  updatedAt?: string;
}
