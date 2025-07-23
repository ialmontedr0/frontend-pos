import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch } from '../../../hooks/hooks';
import { deletePayment } from '../slices/paymentsSlices';

import type { Payment } from '../interfaces/PaymentInterface';
import type { Column, Action } from '../../../components/Table/types';

import Button from '../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import moment from 'moment';
import { Table } from '../../../components/Table/Table';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { myAlertError, myAlertSuccess, parsePaymentMethod } from '../../../utils/commonFunctions';

interface PaymentsTableProps {
  data: Payment[] | null;
  loading: boolean;
  error: string;
  emptyMessage?: string;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  data,
  loading,
  error,
  emptyMessage = 'No hay Pagos para mostrar',
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const paymentColumns: Column<Payment>[] = [
    {
      header: 'Codigo',
      accessor: 'codigo',
      render: (value: string) => (value ? value : '-'),
    },
    {
      header: 'Venta',
      accessor: 'venta',
      render: (value: { _id: string; codigo: string } | null) => (value ? value.codigo : '-'),
    },
    {
      header: 'Usuario',
      accessor: 'usuario',
      render: (value: { _id: string; usuario: string } | null) => (value ? value.usuario : '-'),
    },
    {
      header: 'Cliente',
      accessor: 'cliente',
      render: (value: { _id: string; nombre: string } | null) => (value ? value.nombre : '-'),
    },
    {
      header: 'Metodo Pago',
      accessor: 'metodoPago',
      render: (value: string) => `${parsePaymentMethod(value)}`,
    },
    {
      header: 'Monto',
      accessor: 'montoPagado',
      render: (value: number) => `RD$ ${value.toFixed(2)}`,
    },
    {
      header: 'Fecha',
      accessor: 'fecha',
      render: (value: string) => `${moment(value).format('DD/MM/YYYY, hh:mm a')}`,
    },
  ];

  const paymentActions: Action<Payment>[] = [
    { label: 'Ver', onClick: (p) => navigate(`/payments/${p._id}`) },
    { label: 'Eliminar', onClick: (p) => onDelPayment(p._id) },
  ];

  if (data?.length === 0) return <div>{emptyMessage}</div>;

  const onDelPayment = useCallback(
    (paymentId: string) => {
      myAlert
        .fire({
          title: 'Eliminar pago!',
          text: `Seguro que deseas eliminar este pago?`,
          icon: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deletePayment(paymentId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Pago eliminado`, `Se ha eliminado el pago exitosamente!`);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch, myAlert]
  );

  if (!loading && error) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-6">
        <h2 className="text-3xl font-medium text-black dark:text-gray-200">Pagos</h2>
        <div className="w-auto flex flex-wrap gap-4 my-2">
          <Button
            onClick={() => navigate('/payments/create')}
            startIcon={<BiPlusCircle size={20} />}
            type="button"
          >
            Nuevo Pago
          </Button>
        </div>
      </div>

      {loading && <Spinner />}

      {data ? (
        <Table
          columns={paymentColumns}
          data={data}
          defaultPageSize={10}
          pageSizeOptions={[5, 10]}
          actions={paymentActions}
        />
      ) : (
        <div>No hay ventas en el sistema!</div>
      )}
    </div>
  );
};
