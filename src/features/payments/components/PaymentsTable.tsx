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
import { parsePaymentMethod } from '../../../utils/commonFunctions';

interface PaymentsTableProps {
  data: Payment[] | null;
  loading: boolean;
  error: string;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ data, loading, error }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const paymentColumns: Column<Payment>[] = [
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
                myAlert.fire({
                  title: 'Pago eliminado',
                  text: `Se ha eliminado el pago con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: 'Error',
                  text: `Error: ${error.response?.data?.message || error.message}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch, myAlert]
  );

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Cargando pagos...</p>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Pagos</h2>
        <div className="w-auto flex flex-wrap gap-4 my-2">
          <Button
            onClick={() => navigate('/payments/create')}
            startIcon={<BiPlusCircle size={24} />}
            type="button"
            className="border border-gray-900 px-4 py-1 rounded-full text-white bg-blue-900 dark:bg-blue-400 cursor-pointer hover:bg-blue-800 transition-colors"
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
