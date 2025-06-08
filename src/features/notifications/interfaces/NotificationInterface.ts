export interface Notification {
  _id: string;
  tipo: string;
  mensaje: string;
  fecha: string;
  estado: 'leida' | 'sin_leer';
  usuario: string;
}
