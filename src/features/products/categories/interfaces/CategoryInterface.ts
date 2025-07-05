export interface Category {
  _id: string;
  nombre: string;
  createdBy: { _id: string; usuario: string };
  updatedBy?: { _id: string; usuario: string };
  createdAt: Date;
  updatedAt: Date;
}
