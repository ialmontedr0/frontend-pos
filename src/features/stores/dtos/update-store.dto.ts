export interface UpdateStoreDTO {
    nombre: string;
    direccion: {
        calle: string;
        numero: string;
        ciudad: string
    }
    telefono: string;
}