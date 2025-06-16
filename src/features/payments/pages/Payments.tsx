/* import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { getAllPayments, deletePayment } from '../slices/paymentsSlices';

import type { Payment } from '../interfaces/PaymentInterface';

import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';

import { Button } from '../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import moment from 'moment';

export const Payments: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { payments, loading, error } = useAppSelector((state: RootState) => state.payments);

  const paymentsColumns: Column<Payment>[] = [
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
      render: (value: string) => `${value.toLocaleUpperCase()}`,
    },
    {
      header: 'Monto',
      accessor: 'montoPagado',
      render: (value: number) => `RD$ ${value.toFixed(2)}`,
    },
    {
      header: 'Fecha',
      accessor: 'fecha',
      render: (value: string) => `${moment(value).format('DD MM YYYY, hh:mm A')}`,
    },
  ];

  const paymentsActions: Action<Payment>[] = [
    { label: 'Ver', onClick: (p) => navigate(`/payments/${p._id}`) },
    { label: 'Eliminar', onClick: (p) => onDelPayment(p._id) },
  ];

  useEffect(() => {
    dispatch(getAllPayments());
  }, [dispatch]);

  const onDelPayment = useCallback(
    (paymentId: string) => {
      myAlert
        .fire({
          title: `Eliminar pago`,
          text: `Estas seguro que deseas eliminar este pago?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deletePayment(paymentId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: `Pago eliminado`,
                  text: `Se ha eliminado este pago con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate('/payments');
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: `Error`,
                  text: `Error: ${error.response?.data?.message || error.message}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch]
  );

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Cargando pagos...</p>
      </div>
    );
  }

  if (!loading && error) {
    <div className="p-6">
      <p className="text-red-500">Error: {error}</p>
    </div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap w-auto">
        <h2 className="text-3xl font-semibold my-4">Pagos</h2>
        <Button icon={<BiPlusCircle size={24} />}>Registrar pago</Button>
      </div>

      <div>
        <Table
          columns={paymentsColumns}
          data={payments}
          actions={paymentsActions}
          defaultPageSize={5}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
    </div>
  );
};
 */

import { withFetchByRole } from '../../../hocs/withFetchByRole';
import { getAllPayments, getAllPaymentsForCurrentUser } from '../slices/paymentsSlices';
import { PaymentsTable } from '../components/PaymentsTable';

export default withFetchByRole(PaymentsTable, {
  adminFetchThunk: getAllPayments,
  selfFetchThunk: getAllPaymentsForCurrentUser,
});
