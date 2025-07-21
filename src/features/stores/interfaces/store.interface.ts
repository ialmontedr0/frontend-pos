export interface Store {
  _id: string;
  codigo: string;
  nombre: string;
  direccion: {
    calle: string;
    numero: string;
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
