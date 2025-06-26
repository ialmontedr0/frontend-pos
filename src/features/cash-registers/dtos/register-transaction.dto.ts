export interface RegisterTransactionDTO {
  tipo: 'entrada' | 'salida';
  motivo: string;
  monto: number;
}
