import React, { useCallback, useEffect } from 'react';

import type { Invoice as InvoiceInterface } from '../interfaces/InvoiceInterface';

import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  downloadInvoice,
  clearPdfUrl,
  selectInvoicePdfUrl,
  selectInvoicePreviewUrl,
  previewInvoice,
} from '../slices/invoicesSlice';
import PageMeta from '../../../components/common/PageMeta';
import { myAlertError } from '../../../utils/commonFunctions';
import { Invoice } from './Invoice';
import { useModal } from '../../../hooks/useModal';

interface InvoicesTableProps {
  data: InvoiceInterface[] | null;
  loading: boolean;
  error: string;
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ data, loading, error }) => {
  const dispatch = useAppDispatch();
  const { isOpen, openModal, closeModal } = useModal();
  const downloadUrl = useAppSelector(selectInvoicePdfUrl);
  const previewUrl = useAppSelector(selectInvoicePreviewUrl);

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

  const invoicesColumns: Column<InvoiceInterface>[] = [
    {
      header: 'Codigo',
      accessor: 'codigo',
    },
    {
      header: 'Tipo',
      accessor: 'tipo',
      render: (value: string) => `${value.charAt(0).toUpperCase() + value.slice(1)}`,
    },
    {
      header: 'Venta',
      accessor: 'venta',
      render: (value: { _id: string; codigo: string }) => (value ? value.codigo : '-'),
    },
  ];

  const invoicesActions: Action<InvoiceInterface>[] = [
    { label: 'Ver', onClick: (i) => handlePreviewInvoice(i._id) },
    { label: 'Descargar', onClick: (i) => handleDownloadInvoice(i._id) },
  ];

  const handleDownloadInvoice = useCallback(
    (invoiceId: string) => {
      dispatch(downloadInvoice(invoiceId))
        .unwrap()
        .catch((error: any) => {
          myAlertError(error);
        });
    },
    [dispatch]
  );

  const handlePreviewInvoice = useCallback(
    (invoiceId: string) => {
      dispatch(previewInvoice(invoiceId))
        .unwrap()
        .then(() => {
          openModal();
        })
        .catch((error: any) => {
          myAlertError(error);
        });
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
          <Invoice previewUrl={previewUrl} isOpen={isOpen} closeModal={closeModal} error={error!} />
        )}
      </div>
    </>
  );
};
