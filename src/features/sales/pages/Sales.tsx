import type React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispath } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { getAllSales } from '../slices/salesSlice';
import type { Sale } from '../interfaces/SaleInterface';

import type { Column, Action } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';

import { useEffect } from 'react';

import { Button } from '../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';

export const Sales: React.FC = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();

  const { sales, loading, error } = useAppSelector((state: RootState) => state.sales);

  const saleColumns: Column<Sale>[] = [
    { header: 'Codigo', accessor: 'codigo' },
    { header: 'Usuario', accessor: 'usuario' },
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Estado', accessor: 'estado' },
    { header: 'Total', accessor: 'totalVenta' },
  ];

  const saleActions: Action<Sale>[] = [
    { label: 'Ver', onClick: (s) => navigate(`/sales/${s._id}`) },
    {
      label: 'Descargar Factura',
      onClick: (s) => console.log(`Descargando factura de venta con codigo ${s.codigo}`),
    },
  ];

  useEffect(() => {
    dispatch(getAllSales());
  }, [dispatch]);

  const back = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div>
        <p>Cargando ventas...</p>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div>
        <p className="text-red-500">Error al cargar las ventas: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-semibold">Ventas</h2>
        <div className="w-auto flex flex-wrap">
          <Button
            icon={<BiPlusCircle size={24} />}
            iconPosition="right"
            type="button"
            className="border border-gray-900 px-4 py-1 rounded-md text-white bg-blue-900 dark:bg-blue-400 cursor-pointer hover:bg-blue-800 transition-colors"
            onClick={() => navigate('/sales/create')}
          >
            Nueva venta
          </Button>
          <button onClick={back}>Atras</button>
        </div>
      </div>

      <Table
        columns={saleColumns}
        data={sales}
        defaultPageSize={5}
        pageSizeOptions={[5, 10]}
        actions={saleActions}
      />
    </div>
  );
};
