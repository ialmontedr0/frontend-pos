export interface Product {
  _id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  proveedor: string;
  descripcion?: string;
  stock: number;
  disponible: boolean;
  precioCompra: number;
  precioVenta: number;
  itbis: boolean;
  foto?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
