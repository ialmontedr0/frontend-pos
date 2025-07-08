import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';

import type { Invoice } from '../interfaces/InvoiceInterface';

import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  downloadInvoice,
  clearPdfUrl,
  clearPreviewUrl,
  selectInvoicePdfUrl,
  selectInvoicePreviewUrl,
  previewInvoice,
} from '../slices/invoicesSlice';
import { toast } from '../../../components/UI/Toast/hooks/useToast';
import { Toast } from '../../../components/UI/Toast/Toast';
import PageMeta from '../../../components/common/PageMeta';
import { BiX } from 'react-icons/bi';

interface InvoicesTableProps {
  data: Invoice[] | null;
  loading: boolean;
  error: string;
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ data, loading, error }) => {
  const dispatch = useAppDispatch();
  const downloadUrl = useAppSelector(selectInvoicePdfUrl);
  const previewUrl = useAppSelector(selectInvoicePreviewUrl);
  const navigate = useNavigate();

  useEffect(() => {
    if (!downloadUrl) return;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `invoice-${new Date()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
    dispatch(clearPdfUrl());
  }, [downloadUrl, dispatch]);

  useEffect(() => {
    if (!previewUrl) return;
  }, [previewUrl]);

  const invoicesColumns: Column<Invoice>[] = [
    {
      header: 'Codigo',
      accessor: 'codigo',
    },
    {
      header: 'Tipo',
      accessor: 'tipo',
      render: (value: string) => `${value.charAt(0).toUpperCase() + value.slice(1)}`
    },
    {
      header: 'Venta',
      accessor: 'venta',
      render: (value: { _id: string; codigo: string }) => (value ? value.codigo : '-'),
    },
  ];

  const invoicesActions: Action<Invoice>[] = [
    { label: 'Ver', onClick: (i) => handlePreviewInvoice(i._id) },
    { label: 'Descargar', onClick: (i) => handleDownloadInvoice(i._id) },
  ];

  const handleDownloadInvoice = useCallback(
    (invoiceId: string) => {
      dispatch(downloadInvoice(invoiceId))
        .unwrap()
        .catch((error: any) => {});
    },
    [dispatch]
  );

  const handlePreviewInvoice = useCallback(
    (invoiceId: string) => {
      dispatch(previewInvoice(invoiceId))
        .unwrap()
        .catch((error: any) => {});
    },
    [dispatch]
  );

  return (
    <>
      <PageMeta title="Facturas - PoS v2" description="Facturas" />
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl dark:text-gray-200 font-regular">Facturas</h2>
        </div>

        {loading && <Spinner />}

        {data ? (
          <Table
            data={data}
            columns={invoicesColumns}
            actions={invoicesActions}
            pageSizeOptions={[5, 10, 20, 30]}
            defaultPageSize={10}
          />
        ) : (
          <div>No hay Facturas para mostrar</div>
        )}

        {previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-5/6 p-2 relative">
              <Button
                className="absolute top-2 right-2"
                onClick={() => dispatch(clearPreviewUrl())}
                size="icon"
                variant="icon"
                startIcon={<BiX />}
              ></Button>

              <iframe
                src={previewUrl}
                className="w-full h-full border"
                title="Vista previa Factura"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
