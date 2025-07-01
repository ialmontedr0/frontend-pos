export interface Provider {
  _id: string;
  nombre: string;
  RNC: string;
  telefono: string;
  procedencia: string;
  createdBy?: { _id: string; usuario: string };
  updatedBy?: { _id: string; usuario: string };
  createdAt: string;
  updatedAt: string;
}
