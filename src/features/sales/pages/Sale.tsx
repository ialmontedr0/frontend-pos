import React, { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { getSaleByCode, clearSelectedSale } from '../slices/salesSlice';

import { Label } from '../../../components/UI/Label/Label';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiDownload, BiMoney } from 'react-icons/bi';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import type { Payment } from '../../payments/interfaces/PaymentInterface';
import type { SaleProduct } from '../interfaces/SaleProductInterface';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrum from '../../../components/common/PageBreadCrumb';
import Badge from '../../../components/UI/Badge/Badge';
import { myAlertSuccess, parsePaymentMethod } from '../../../utils/commonFunctions';
import { generateInvoice } from '../../invoices/slices/invoicesSlice';
import { toast } from '../../../components/UI/Toast/hooks/useToast';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { Error } from '../../../components/Error/components/Error';
import { NotFound } from '../../../pages/NotFound';
import { MakePayment } from '../components/MakePayment';
import { useModal } from '../../../hooks/useModal';

export const Sale: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  moment.locale('es');
  const { codigo } = useParams<{ codigo: string }>();
  const { sale, loading, error } = useAppSelector((state: RootState) => state.sales);

  const paymentColumns: Column<Payment>[] = [
    {
      header: 'Metodo pago',
      accessor: 'metodoPago',
      render: (value: string) => `${parsePaymentMethod(value)}`,
    },
    {
      header: 'Fecha',
      accessor: 'fecha',
      render: (value: string) => `${moment(value).format('DD/MM/YYYY hh:mm a')}`,
    },
    {
      header: 'Monto',
      accessor: 'montoPagado',
      render: (value: number) => `RD$ ${value.toFixed(2)}`,
    },
  ];

  const paymentActions: Action<Payment>[] = [
    { label: 'Ver', onClick: (p) => navigate(`/payments/${p._id}`) },
  ];

  const productSaleColumns: Column<SaleProduct>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Precio', accessor: 'precio', render: (value: number) => `RD$ ${value.toFixed(2)}` },
    { header: 'ITBIS', accessor: 'itbis', render: (value: string) => `${value ? 'Si' : 'No'}` },
    { header: 'Cantidad', accessor: 'cantidad' },
    {
      header: 'ITBIS Producto',
      accessor: 'itbisProducto',
      render: (value: number) => `RD$ ${value.toFixed(2)}`,
    },
    {
      header: 'Subtotal',
      accessor: 'subtotalProducto',
      render: (value: number) => `RD ${value.toFixed(2)}`,
    },
    {
      header: 'Total',
      accessor: 'totalProducto',
      render: (value: number) => `RD$ ${value.toFixed(2)}`,
    },
  ];

  const productSaleActions: Action<SaleProduct>[] = [
    { label: 'Ver', onClick: (p) => navigate(`/products/${p.producto}`) },
  ];

  useEffect(() => {
    if (!codigo) {
      navigate('/sales');
      return;
    }
    dispatch(getSaleByCode(codigo));
    return () => {
      dispatch(clearSelectedSale());
    };
  }, [dispatch, codigo, navigate]);

  // Implementar aqui
  const makePayment = () => {
    openModal();
  };

  const handleGenerateInvoice = useCallback(
    (saleId: string) => {
      dispatch(
        generateInvoice({
          tipo: 'venta',
          refId: saleId,
        })
      )
        .unwrap()
        .then(() => {
          myAlertSuccess(`Factura generada`, 'Se ha generado la factura con exito');
        })
        .catch((error: any) => {
          toast({
            title: 'Error',
            description: `Error al generar la factura: ${error}`,
            variant: 'destructive',
          });
        });
    },
    [dispatch]
  );

  if (loading) {
    return <Spinner />;
  }

  if (!loading && error) {
    return <Error message={error} />;
  }

  if (!sale) {
    return <NotFound node="Venta" />;
  }

  return (
    <>
      <PageMeta title="Venta - PoS v2" description="Detalles de la venta" />
      <PageBreadcrum pageTitle="Venta" />
      <div className="p-6 max-w-6xl m-2 md:mx-auto bg-white dark:bg-gray-900 rounded-lg shadow text-black dark:text-gray-200">
        <div>
          <h2 className="text-2xl md:text-3xl font-regular mb-4">Detalles Venta</h2>
        </div>

        <div className="grid grid-cols-2 space-y-4">
          <div>
            <Label htmlFor="codigo">Codigo</Label>
            <p>{sale.codigo}</p>
          </div>

          <div>
            <Label htmlFor="usuario">Usuario</Label>
            <p>{sale.usuario?.usuario ?? '-'}</p>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="cliente">Cliente</Label>
            <p>{sale.cliente?.nombre ?? '-'}</p>
          </div>

          <div>
            <Label htmlFor="caja">Caja</Label>
            <p>{sale.caja.codigo}</p>
          </div>

          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <p>{moment(sale.fecha).format('LLLL')}</p>
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            {sale.estado === 'completada' ? (
              <Badge color="success">Completada</Badge>
            ) : (
              <Badge color="warning">Pendiente</Badge>
            )}
          </div>

          <div>
            <Label htmlFor="metodoPago">Metodo Pago</Label>
            <p>{parsePaymentMethod(sale.metodoPago)}</p>
          </div>

          <div>
            <Label htmlFor="pagoVenta">Pago Venta</Label>
            <p>RD$ {sale.pagoVenta.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="montoPendiente">Monto Pendiente</Label>
            <p>RD$ {sale.montoPendiente.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="subtotalVenta">Subtotal</Label>
            <p>RD$ {sale.subtotalVenta.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="itbisVenta">ITBIS</Label>
            <p>RD$ {sale.itbisVenta.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="descuento">Descuento</Label>
            <p>RD$ {sale.descuento.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="totalVenta">Total</Label>
            <p>RD$ {sale.totalVenta.toFixed(2)}</p>
          </div>
        </div>

        {sale.pagos.length ? (
          <div className="mt-6">
            <h3 className="text-lg font-regular mb-3">Pagos</h3>
            <Table
              columns={paymentColumns}
              data={sale.pagos}
              defaultPageSize={5}
              pageSizeOptions={[5, 10]}
              actions={paymentActions}
            />
          </div>
        ) : (
          <p className="mt-6 text-gray-500">Esta venta aun no tiene pagos adjudicados.</p>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-regular mb-3">Productos</h3>
          {sale.productos && (
            <Table
              columns={productSaleColumns}
              actions={productSaleActions}
              data={sale.productos}
              defaultPageSize={10}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          )}
        </div>

        <div className="my-6 flex flex-wrap w-auto gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/sales')}
            startIcon={<BiArrowBack className="" size={20} />}
          >
            Volver
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={makePayment}
            startIcon={<BiMoney size={20} />}
          >
            Realizar Pago
          </Button>
          <Button
            onClick={() => handleGenerateInvoice(sale._id)}
            size="sm"
            variant="success"
            startIcon={<BiDownload size={20} />}
          >
            Generar Factura
          </Button>
        </div>
      </div>
      <MakePayment
        sale={sale}
        isOpen={isOpen}
        closeModal={closeModal}
        error={error!}
      />
    </>
  );
};
