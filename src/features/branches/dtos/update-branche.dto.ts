export interface UpdateBrancheDTO {
    nombre: string;
    direccion: {
        calle: string;
        ciudad: string
    }
    telefono: string;
}