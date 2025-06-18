import type { Sale } from '../../sales/interfaces/SaleInterface';

export interface Customer {
  _id: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  correo?: string;
  direccion?: string;
  tipo: 'express' | 'comun';
  historialCompras: Sale[];
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
