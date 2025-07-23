export interface UpdateRegisterDTO {
  estado?: 'abierta' | 'cerrada';
  sucursal?: string;
  montoActual?: number;
  assignedTo?: any;
}
