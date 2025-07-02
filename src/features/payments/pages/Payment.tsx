import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
{
}
import { clearSelectedPayment, getPaymentById } from '../slices/paymentsSlices';
import { Label } from '../../../components/UI/Label/Label';
import Button from '../../../components/UI/Button/Button';
import { BiFolderOpen, BiTrash } from 'react-icons/bi';
import { parsePaymentMethod } from '../../../utils/commonFunctions';

export const Payment: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();

  const { payment, loading, error } = useAppSelector((state: RootState) => state.payments);

  useEffect(() => {
    if (!paymentId) {
      return;
    }
    dispatch(getPaymentById(paymentId));
    return () => {
      dispatch(clearSelectedPayment());
    };
  }, [dispatch, paymentId, navigate]);

  const viewSale = (codigo: string) => {
    navigate(`/sales/${codigo}`)
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Cargando pago...</p>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      {payment && (
        <div className="p-6 flex flex-col max-w-2xl mx-auto my-4 text-black dark:text-gray-200 bg-white dark:bg-gray-900 rounded-lg shadow">
          <div className="my-2">
            <h2 className="text-3xl font-semibold">Detalles Pago</h2>
          </div>

          <div className="grid grid-cols-2 md:flex-col sm:flex-col xs:flex-col space-y-4">
            <div>
              <Label htmlFor="venta">Venta</Label>
              <p>{payment?.venta.codigo ?? '-'}</p>
            </div>

            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <p>{payment?.cliente.nombre ?? '-'}</p>
            </div>

            <div>
              <Label htmlFor="usuario">Usuario</Label>
              <p>{payment?.usuario.usuario ?? '-'}</p>
            </div>

            <div>
              <Label htmlFor="metodoPago">Metodo Pago</Label>
              <p>{parsePaymentMethod(payment.metodoPago)}</p>
            </div>

            <div>
              <Label htmlFor="montoPagado">Monto Pagado</Label>
              <p>RD$ {payment?.montoPagado.toFixed(2)}</p>
            </div>

            <div>
              <Label htmlFor="referenciaExterna">Referencia</Label>
              <p>{payment?.referenciaExterna}</p>
            </div>

            <div>
              <Label htmlFor="fecha">Fecha pago</Label>
              <p>{moment(payment?.fecha).format('DD MM YYYY, hh:mm:ss a')}</p>
            </div>
          </div>

          <div className="w-auto flex flex-wrap gap-2 my-5">
            <Button onClick={() => viewSale(payment.venta.codigo)} size='sm' startIcon={<BiFolderOpen size={24}  />}>
              Ver venta
            </Button>
            <Button size='sm' variant='destructive' startIcon={<BiTrash size={24} />}>
              Eliminar pago
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
