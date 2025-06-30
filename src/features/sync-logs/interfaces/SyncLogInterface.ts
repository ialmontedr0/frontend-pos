export interface SyncLog {
  _id: string;
  acciones: Record<string, any>;
  clienteTempId: string;
  resuelto: boolean;
  createdBy: { _id: string; usuario: string };
  createdAt: string;
  updatedAt?: string;
  resolvedBy?: { _id: string; usuario: string };
}
