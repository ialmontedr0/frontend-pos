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
import moment from 'moment';

export const Sales: React.FC = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();

  const { sales, loading, error } = useAppSelector((state: RootState) => state.sales);

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
      render: (val: string | Date) => `${moment(val).format('DD-MM-YYYY, hh:mm A')}`,
    },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value: string) => {
        const base = `px-2 py-1 rounded-full text-white text-xs font-semibold`;
        const color =
          value === 'completada' ? 'bg-green-600' : 'bg-amber-500';
          return <span className={`${base} ${color}`}>{value}</span>
      },
    },
    { header: 'Total', accessor: 'totalVenta', render: (value: number) => `RD$ ${value.toFixed(2)}` },
  ];

  const saleActions: Action<Sale>[] = [
    { label: 'Ver', onClick: (s) => navigate(`/sales/${s.codigo}`) },
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
