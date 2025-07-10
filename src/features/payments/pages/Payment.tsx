import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

import { clearSelectedPayment, getPaymentById } from '../slices/paymentsSlices';
import { Label } from '../../../components/UI/Label/Label';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiFolderOpen, BiPaperPlane, BiTrash } from 'react-icons/bi';
import { myAlertError, myAlertSuccess, parsePaymentMethod } from '../../../utils/commonFunctions';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrum from '../../../components/common/PageBreadCrumb';
import { NotFound } from '../../../pages/NotFound';
import { generateInvoice } from '../../invoices/slices/invoicesSlice';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { Error } from '../../../components/Error/components/Error';

export const Payment: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  moment.locale('es');
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
    navigate(`/sales/${codigo}`);
  };

  const handleGenerateInvoice = useCallback(
    (paymentId: string) => {
      dispatch(
        generateInvoice({
          tipo: 'pago',
          refId: paymentId,
        })
      )
        .unwrap()
        .then(() => {
          myAlertSuccess(`Factura generada`, `Se ha generado la factura exitosamente.`);
        })
        .catch((error: any) => {
          myAlertError(`Error`, `Error: ${error}`);
        });
    },
    [dispatch]
  );

  if (loading) return <Spinner />;

  if (!loading && error) {
    return <Error message={error} />;
  }

  if (!payment) {
    return <NotFound node="Pago" />;
  }

  return (
    <>
      <PageMeta title="Pago - PoS v2" description="Detalles del pago" />
      <PageBreadcrum pageTitle="Pago" />
      <div className="p-6 flex flex-col max-w-2xl m-2 md:mx-auto text-black dark:text-gray-200 bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="my-2">
          <h2 className="text-3xl font-regular">Detalles Pago</h2>
        </div>

        <div className="grid grid-cols-2 md:flex-col sm:flex-col xs:flex-col space-y-4">
          <div>
            <Label htmlFor="venta">Venta</Label>
            <p>{payment.venta.codigo ?? '-'}</p>
          </div>

          <div>
            <Label htmlFor="cliente">Cliente</Label>
            <p>{payment.cliente.nombre ?? '-'}</p>
          </div>

          <div>
            <Label htmlFor="usuario">Usuario</Label>
            <p>{payment.usuario.usuario ?? '-'}</p>
          </div>

          <div>
            <Label htmlFor="metodoPago">Metodo Pago</Label>
            <p>{parsePaymentMethod(payment.metodoPago)}</p>
          </div>

          <div>
            <Label htmlFor="montoPagado">Monto Pagado</Label>
            <p>RD$ {payment.montoPagado.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="referenciaExterna">Referencia</Label>
            <p>{payment.referenciaExterna}</p>
          </div>

          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <p>{moment(payment.fecha).format('LLLL')}</p>
          </div>
        </div>

        <div className="w-auto flex flex-wrap gap-2 my-5 justify-center md:justify-end">
          <Button
            size="sm"
            variant="outline"
            startIcon={<BiArrowBack size={20} />}
            onClick={() => navigate('/payments')}
          >
            Volver
          </Button>
          <Button
            onClick={() => viewSale(payment.venta.codigo)}
            size="sm"
            startIcon={<BiFolderOpen size={20} />}
          >
            Ver venta
          </Button>
          <Button
            size="sm"
            variant="success"
            startIcon={<BiPaperPlane size={20} />}
            onClick={() => handleGenerateInvoice(payment._id)}
          >
            Generar Factura
          </Button>
          <Button size="sm" variant="destructive" startIcon={<BiTrash size={20} />}>
            Eliminar pago
          </Button>
        </div>
      </div>
    </>
  );
};
