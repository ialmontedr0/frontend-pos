export interface Transaction {
  _id: string;
  tipo: 'entrada' | 'salida';
  motivo: string;
  monto: number;
  usuario: { _id: string; usuario: string };
  fecha: string;
}
