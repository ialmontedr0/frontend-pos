import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import moment from 'moment';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { getSaleByCode, clearSelectedSale } from '../slices/salesSlice';

import { Label } from '../../../components/UI/Label/Label';
import { Button } from '../../../components/UI/Button/Button';
import { BiArrowBack } from 'react-icons/bi';
import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import type { Payment } from '../../payments/interfaces/PaymentInterface';
import type { SaleProduct } from '../interfaces/SaleProductInterface';

export const Sale: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { codigo } = useParams<{ codigo: string }>();

  const { sale, loading, error } = useAppSelector((state: RootState) => state.sales);

  const paymentColumns: Column<Payment>[] = [
    { header: 'Metodo pago', accessor: 'metodoPago' },
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Monto', accessor: 'montoPagado' },
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
        <Button icon={<BiArrowBack size={20} />}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="m-6 p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <div>
        <h2 className="text-3xl font-semibold my-4">Detalles Venta</h2>
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
          <p>{moment(sale.fecha).format('DD-MM-YYYY, hh:mm:ss A')}</p>
        </div>

        <div>
          <Label htmlFor="estado">Estado</Label>
          <p
            className={`w-auto px-2 py-1 rounded-full text-white text-xs font-semibold
                ${sale.estado === 'completada' ? 'bg-green-600' : 'bg-amber-500'}`}
          >
            {sale.estado}
          </p>
        </div>

        <div>
          <Label htmlFor="metodoPago">Metodo Pago</Label>
          <p>{sale.metodoPago}</p>
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

      <div className="my-6 flex flex-wrap w-auto">
        <Button
          className="px-3 py-1 rounded-full"
          onClick={() => navigate('/sales')}
          icon={<BiArrowBack className="" size={20} />}
        >
          Volver
        </Button>
      </div>
    </div>
  );
};
