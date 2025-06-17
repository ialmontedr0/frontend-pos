import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { Payment } from '../interfaces/PaymentInterface';
import type { Column, Action } from '../../../components/Table/types';

import { Button } from '../../../components/UI/Button/Button';
import { BiArrowBack, BiPlusCircle } from 'react-icons/bi';
import moment from 'moment';
import { Table } from '../../../components/Table/Table';

interface PaymentsTableProps {
  data: Payment[] | null;
  loading: boolean;
  error: string;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ data, loading, error }) => {
  const navigate = useNavigate();

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

  const paymentActions: Action<Payment>[] = [
    { label: 'Ver', onClick: (p) => navigate(`/payments/${p._id}`) },
    { label: 'Eliminar', onClick: (p) => console.log(`Eliminar ${p._id}`) },
  ];

  const back = () => {
    navigate('/payments');
  };

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

  if (!data || data.length === 0) {
    return <p className="text-gray-500">No hay pagos para mostrar</p>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-semibold">Pagos</h2>
        <div className="w-auto flex flex-wrap gap-4 my-2">
          <Button
            onClick={() => navigate('/payments/create')}
            icon={<BiPlusCircle size={24} />}
            iconPosition="right"
            type="button"
            className="border border-gray-900 px-4 py-1 rounded-md text-white bg-blue-900 dark:bg-blue-400 cursor-pointer hover:bg-blue-800 transition-colors"
          >
            Nuevo Pago
          </Button>
          <Button onClick={back} icon={<BiArrowBack size={24} />}>
            Atras
          </Button>
        </div>
      </div>

      <Table
        columns={paymentColumns}
        actions={paymentActions}
        data={data}
        defaultPageSize={5}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};
