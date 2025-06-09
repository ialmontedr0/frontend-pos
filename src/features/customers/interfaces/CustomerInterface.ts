export interface Customer {
  _id: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  correo?: string;
  direccion?: string;
  historialCompras: any[];
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
