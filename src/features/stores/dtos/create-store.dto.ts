export interface CreateStoreDTO {
  nombre: string;
  direccion: {
    calle: string;
    numero: string;
    ciudad: string;
  };
  telefono: string;
}
