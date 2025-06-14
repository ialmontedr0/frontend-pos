export interface UpdateProductDTO {
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  stock?: number;
  precioCompra?: number;
  precioVenta?: number;
  itbis?: boolean;
  proveedor?: string;
  foto?: string;
}
