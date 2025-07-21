import type { Sale } from '../../sales/interfaces/SaleInterface';

export interface Customer {
  _id: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  correo?: string;
  direccion?: {
    calle: string;
    casa: string;
    ciudad: string;
  };
  tipo: 'express' | 'comun';
  historialCompras: Sale[];
  createdAt: string;
  updatedAt?: string;
  createdBy?: { _id: string; usuario: string };
  updatedBy?: { _id: string; usuario: string };
}
