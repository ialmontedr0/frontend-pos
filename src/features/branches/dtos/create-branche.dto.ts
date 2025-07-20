export interface CreateBrancheDTO {
    nombre: string;
    direccion: {
        calle: string;
        ciudad: string
    }
    telefono: string;
}