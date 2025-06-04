export interface UpdateUserDTO {
  nombre?: string;
  apellido?: string;
  usuario?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  rol?: string;
  estado?: string;
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
