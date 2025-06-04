export interface LoginResponseDTO {
  access_token: string;
  refresh_token: string;
  user: {
    _id: string;
    nombre: string;
    apellido: string;
    usuario: string;
    correo: string;
    telefono: string;
    rol: string;
    estado: string;
    configuracion: {
      tema: string;
      idioma: string;
      moneda: string;
      tamanoTexto: string;
      zonaHoraria: string;
    };
    createdAt: string;
    updatedAt: string;
    foto?: string;
  };
}
