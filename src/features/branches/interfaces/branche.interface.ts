export interface Branche {
  _id: string;
  nombre: string;
  direccion: {
    calle: string;
    ciudad: string;
  };
  telefono: string;
  createdBy: {
    _id: string;
    usuario: string;
  };
  updatedBy?: { _id: string; usuario: string };
  createdAt: string;
  updatedAt?: string;
}
