import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
{
}
import { clearSelectedPayment, getPaymentById } from '../slices/paymentsSlices';
import { Label } from '../../../components/UI/Label/Label';
import { Button } from '../../../components/UI/Button/Button';
import { BiFolderOpen, BiTrash } from 'react-icons/bi';

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
    <div className="p-6 flex flex-col max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="my-2">
        <h2 className="text-3xl font-semibold">Detalles Pago</h2>
      </div>

      <div className="grid grid-cols-2 md:flex-col sm:flex-col xs:flex-col">
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
          <p>{payment?.metodoPago}</p>
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

      <div className="w-auto flex flex-wrap gap-2">
        <Button icon={<BiFolderOpen size={20} className="px-2 py-1 rounded-full" />}>
          Ver venta
        </Button>
        <Button icon={<BiTrash size={20} className="px-2 py-1 rounded-full" />}>
          Eliminar pago
        </Button>
      </div>
    </div>
  );
};
