export interface Category {
  _id: string;
  nombre: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
