export interface CreateRegisterDTO {
  estado?: 'abierta' | 'cerrada';
  assignedTo?: string;
  montoActual?: number;
}
