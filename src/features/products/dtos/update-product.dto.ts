export interface UpdateProductDTO {
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  stock?: number;
  disponible?: boolean;
  precioCompra?: number;
  precioVenta?: number;
  itbis?: boolean;
  proveedor?: string;
}
