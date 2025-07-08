import type { InvoiceType } from '../types/invoice-type';

export interface GenerateInvoiceDto {
  tipo: InvoiceType;
  refId: string;
}
