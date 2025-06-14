import type { Category } from "../categories/interfaces/CategoryInterface";
import type { Provider } from "../providers/interfaces/ProviderInterface";

export interface Product {
  _id: string;
  codigo: string;
  nombre: string;
  categoria: string | Category;
  proveedor: string | Provider;
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
