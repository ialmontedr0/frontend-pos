import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import Badge from '../../../components/UI/Badge/Badge';

import type { Sale } from '../interfaces/SaleInterface';
import { getAllSales } from '../slices/salesSlice';
import Button from '../../../components/UI/Button/Button';
import { BiDotsHorizontal, BiFilter } from 'react-icons/bi';

export const RecentSales: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sales } = useAppSelector((state: RootState) => state.sales);

  const saleColumns: Column<Sale>[] = [
    { header: 'Venta', accessor: 'codigo' },
    {
      header: 'Cliente',
      accessor: 'cliente',
      render: (value: { _id: string; nombre: string }) => (value ? value.nombre : '-'),
    },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value: any) => {
        if (value === 'completada') {
          return <Badge color="success">Completada</Badge>;
        } else {
          return <Badge color="error">Pendiente</Badge>;
        }
      },
    },
  ];

  const saleActions: Action<Sale>[] = [{ label: 'Ver', onClick: (sale) => viewSale(sale.codigo) }];

  const viewSale = (codigo: string) => {
    navigate(`/sales/${codigo}`);
  };

  const tableData: Sale[] = sales;

  useEffect(() => {
    dispatch(getAllSales());
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium my-2 text-gray-800 dark:text-white/90">
            Ventas recientes
          </h3>
        </div>

        <div className="flex items-center gap-2 my-2">
          <Button size="sm" variant="outline" startIcon={<BiFilter />}>
            Filtros
          </Button>
          <Button
            size="sm"
            variant="outline"
            startIcon={<BiDotsHorizontal />}
            onClick={() => navigate('/sales')}
          >
            Ver mas
          </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          {tableData && (
            <Table
              columns={saleColumns}
              actions={saleActions}
              data={tableData}
              pageSizeOptions={[5, 10, 15]}
              defaultPageSize={10}
            />
          )}
        </div>
      </div>
    </div>
  );
};
