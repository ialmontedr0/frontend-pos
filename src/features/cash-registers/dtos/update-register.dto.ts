export interface UpdateRegisterDTO {
  estado?: 'abierta' | 'cerrada';
  montoActual?: number;
  assignedTo?: string;
}
