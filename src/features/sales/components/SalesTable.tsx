import type React from 'react';
import { useNavigate } from 'react-router-dom';

import type { Sale } from '../interfaces/SaleInterface';

import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';

import Button from '../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import moment from 'moment/min/moment-with-locales';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { Error } from '../../../components/Error/components/Error';
import Badge from '../../../components/UI/Badge/Badge';

interface SalesTableProps {
  data: Sale[] | null;
  loading: boolean;
  error: string;
}

export const SalesTable: React.FC<SalesTableProps> = ({ data, loading, error }) => {
  const navigate = useNavigate();
  moment.locale('es');

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
        if (value === 'completada') {
          return <Badge color="success">Completada</Badge>;
        } else if (value === 'pendiente') {
          return <Badge color="error">Pendiente</Badge>;
        }
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

  if (!loading && error) {
    return <Error message={error} />;
  }

  return (
    <div className="p-4 space-y-6 text-black dark:text-gray-200">
      <div className="space-y-4">
        <h2 className="text-3xl dark:text-gray-200 font-regular">Ventas</h2>
        <div className="w-auto flex flex-wrap gap-2">
          <Button
            startIcon={<BiPlusCircle size={24} />}
            type="button"
            variant="primary"
            onClick={() => navigate('/sales/create')}
          >
            Nueva venta
          </Button>
        </div>
      </div>

      {loading && <Spinner />}

      {data ? (
        <Table
          columns={saleColumns}
          data={data}
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 20]}
          actions={saleActions}
        />
      ) : (
        <div>No hay ventas en el sistema!</div>
      )}
    </div>
  );
};
