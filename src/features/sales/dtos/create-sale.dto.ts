import type { Customer } from "../../customers/interfaces/CustomerInterface";
import type { User } from "../../users/interfaces/UserInterface";
import type { CreateSaleProductDTO } from "./create-sale-product.dto";

export interface CreateSaleDTO {
    usuario: string | User;
    cliente: string | Customer;
    productos: CreateSaleProductDTO[];
    pagoVenta: number;
    metodoPago: 'efectivo' | 'credito' | 'tarjeta_credito_debito' | 'puntos';
    
}