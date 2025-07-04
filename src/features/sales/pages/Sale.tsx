import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import moment from 'moment';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { getSaleByCode, clearSelectedSale } from '../slices/salesSlice';

import { Label } from '../../../components/UI/Label/Label';
import Button from '../../../components/UI/Button/Button';
import { BiArrowBack, BiDownload } from 'react-icons/bi';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import type { Payment } from '../../payments/interfaces/PaymentInterface';
import type { SaleProduct } from '../interfaces/SaleProductInterface';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrum from '../../../components/common/PageBreadCrumb';

export const Sale: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { codigo } = useParams<{ codigo: string }>();

  const { sale, loading, error } = useAppSelector((state: RootState) => state.sales);

  const paymentColumns: Column<Payment>[] = [
    {
      header: 'Metodo pago',
      accessor: 'metodoPago',
      render: (value: string) => `${renderPaymentMethod(value)}`,
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

  if (loading) {
    return (
      <div>
        <p>Cargando venta...</p>
      </div>
    );
  }

  const renderPaymentMethod = (method: string) => {
    switch (method) {
      case 'efectivo':
        return 'Efectivo';
      case 'credito':
        return 'Credito';
      case 'tarjetaCreditoDebito':
        return 'Tarjeta';
      case 'puntos':
        return 'Puntos';
      default:
        'Unknown';
    }
  };

  if (!loading && error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="p-6">
        <p className="text-gray-600">No existe la venta..</p>
        <Button startIcon={<BiArrowBack size={20} />}>Volver</Button>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Venta - PoS v2" description="Detalles de la venta" />
      <PageBreadcrum pageTitle="Venta" />
      <div className="m-6 p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow text-black dark:text-gray-200">
        <div>
          <h2 className="text-3xl font-regular my-4">Detalles Venta</h2>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-col sm:flex sm:flex-col xs:flex xs:flex-col">
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
            <Label htmlFor="fecha">Fecha</Label>
            <p>{moment(sale.fecha).locale('es-do').format('llll')}</p>
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            <p
              className={`w-fit px-4 py-1 rounded-full text-white text-xs font-semibold
                ${sale.estado === 'completada' ? 'bg-green-600' : 'bg-amber-500'}`}
            >
              {sale.estado.charAt(0).toUpperCase() + sale.estado.slice(1)}
            </p>
          </div>

          <div>
            <Label htmlFor="metodoPago">Metodo Pago</Label>
            <p>{renderPaymentMethod(sale.metodoPago)}</p>
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
            <Label htmlFor="totalVenta">Total</Label>
            <p>RD$ {sale.totalVenta.toFixed(2)}</p>
          </div>
        </div>

        {sale.pagos.length ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Pagos</h3>
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
          <h3 className="text-lg font-semibold mb-3">Productos</h3>
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
            className="px-3 py-1 rounded-full"
            onClick={() => navigate('/sales')}
            startIcon={<BiArrowBack className="" size={20} />}
          >
            Volver
          </Button>

          <Button
            className="bg-green-600 text-white hover:bg-green-700 transition-colors px-3 py-1 rounded-full"
            startIcon={<BiDownload size={20} />}
          >
            Descargar Factura
          </Button>
        </div>
      </div>
    </>
  );
};
