export interface CreateRegisterDTO {
  estado?: 'abierta' | 'cerrada';
  assignedTo?: string;
  sucursal: string;
  montoActual?: number;
}
