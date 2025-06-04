export interface IUser {
  _id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  contrasena: string;
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
}
