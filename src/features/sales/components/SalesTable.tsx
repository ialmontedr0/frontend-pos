import type React from 'react';
import { useNavigate } from 'react-router-dom';

import type { Sale } from '../interfaces/SaleInterface';

import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';

import Button from '../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import moment from 'moment';
import Spinner from '../../../components/UI/Spinner/Spinner';

interface SalesTableProps {
  data: Sale[] | null;
  loading: boolean;
  error: string;
}

export const SalesTable: React.FC<SalesTableProps> = ({ data, loading, error }) => {
  const navigate = useNavigate();

  const saleColumns: Column<Sale>[] = [
    { header: 'Codigo', accessor: 'codigo' },
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
      header: 'Fecha',
      accessor: 'fecha',
      render: (val: string | Date) => `${moment(val).format('DD/MM/YYYY, hh:mm A')}`,
    },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value: string) => {
        const base = `px-2 py-1 rounded-full text-white text-xs font-semibold`;
        const color = value === 'completada' ? 'bg-green-600' : 'bg-amber-500';
        return (
          <span className={`${base} ${color}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      header: 'Total',
      accessor: 'totalVenta',
      render: (value: number) => `RD$ ${value.toFixed(2)}`,
    },
  ];

  const saleActions: Action<Sale>[] = [
    { label: 'Ver', onClick: (s) => navigate(`/sales/${s.codigo}`) },
    {
      label: 'Descargar Factura',
      onClick: (s) => console.log(`Descargando factura de venta con codigo ${s.codigo}`),
    },
  ];

  const back = () => {
    navigate('/dashboard');
  };

  if (!loading && error) {
    return (
      <div>
        <p className="text-red-500 text-sm">Error al cargar las ventas: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-semibold">Ventas</h2>
        <div className="w-auto flex flex-wrap gap-2">
          <Button
            startIcon={<BiPlusCircle size={24} />}
            type="button"
            className="border border-gray-900 px-4 rounded-full py-1 rounded-md text-white bg-blue-900 dark:bg-blue-400 cursor-pointer hover:bg-blue-800 transition-colors"
            onClick={() => navigate('/sales/create')}
          >
            Nueva venta
          </Button>
          <button onClick={back}>Atras</button>
        </div>
      </div>

      {loading && <Spinner />}

      {data ? (
        <Table
          columns={saleColumns}
          data={data}
          defaultPageSize={10}
          pageSizeOptions={[5, 10]}
          actions={saleActions}
        />
      ) : (
        <div>No hay ventas en el sistema!</div>
      )}
    </div>
  );
};
