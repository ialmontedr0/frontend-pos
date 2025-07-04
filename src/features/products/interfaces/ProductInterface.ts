export interface Product {
  _id: string;
  codigo: string;
  nombre: string;
  categoria: { _id: string; nombre: string };
  proveedor: { _id: string; nombre: string };
  descripcion?: string;
  stock: number;
  disponible: boolean;
  precioCompra: number;
  precioVenta: number;
  itbis: boolean;
  foto?: string;
  soldCount: number;
  createdBy?: { _id: string; usuario: string };
  updatedBy?: { _id: string; usuario: string };
  createdAt?: string;
  updatedAt?: string;
}
