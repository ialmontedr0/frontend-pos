export interface CreateCustomerDTO {
  nombre: string;
  apellido?: string;
  telefono: string;
  correo?: string;
  direccion?: {
    calle: string;
    casa: string;
    ciudad: string;
  };
}
