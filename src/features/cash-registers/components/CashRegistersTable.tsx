import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch } from '../../../hooks/hooks';
import {
  clearCashRegisterError,
  closeCashRegister,
  deleteCashRegister,
  openCashRegister,
} from '../slices/cashRegisterSlice';

import { Table } from '../../../components/Table/Table';
import type { Column, Action } from '../../../components/Table/types';
import type { CashRegister } from '../interfaces/CashRegisterInterface';

import Button from '../../../components/UI/Button/Button';
import { BiFilter } from 'react-icons/bi';
import { SearchBar } from '../../../components/SearchBar/SearchBar';

import Spinner from '../../../components/UI/Spinner/Spinner';

interface CashRegisterTableProps {
  data: CashRegister[] | null;
  loading: boolean;
  error: string;
}

export const CashRegistersTable: React.FC<CashRegisterTableProps> = ({ data, loading, error }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  let openAmount: number = 0;
  let closeAmount: number = 0;

  const [showFilters, setShowFilters] = useState<boolean>(false);

  const toggleFilters = () => {
    if (showFilters === true) {
      setShowFilters(false);
    } else {
      setShowFilters(true);
    }
  };

  const onDelRegister = useCallback(
    (cashRegisterId: string) => {
      myAlert
        .fire({
          title: `Cerrar caja!`,
          text: `Estas seguro que deseas eliminar esta caja?`,
          icon: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Cerrar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCashRegister(cashRegisterId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Caja eliminada!',
                  text: `Se ha eliminado la caja con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                dispatch(clearCashRegisterError());
                navigate('/cash-registers', { replace: true });
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: `Error`,
                  text: `Error: ${error.response?.data?.message || error.message}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch, myAlert]
  );

  const cashRegistersColumns: Column<CashRegister>[] = [
    { header: 'Caja', accessor: 'codigo' },
    {
      header: 'Usuario',
      accessor: 'createdBy',
      render: (value: { _id: string; usuario: string } | null) => (value ? value.usuario : '-'),
    },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value: string) => `${value.charAt(0).toUpperCase() + value.slice(1)}`,
    },
    {
      header: 'Monto Actual',
      accessor: 'montoActual',
      render: (value: number) => `RD$ ${value.toFixed(2)}`,
    },
  ];

  const cashRegistersActions: Action<CashRegister>[] = [
    { label: 'Ver', onClick: (c) => navigate(`/cash-registers/${c.codigo}`) },
    { label: 'Editar', onClick: (c) => navigate(`/cash-registers/edit/${c.codigo}`) },
    { label: 'Eliminar', onClick: (c) => onDelRegister(c._id) },
    {
      label: 'Abrir',
      onClick: (c) => openRegister(c._id),
      render: (c) => (c.estado === 'cerrada' ? <span>Abrir</span> : null),
    },
    {
      label: 'Cerrar',
      onClick: (c) => closeRegister(c._id),
      render: (c) => (c.estado === 'abierta' ? <span>Cerrar</span> : null),
    },
  ];

  const openRegister = useCallback(
    (registerId: string) => {
      myAlert
        .fire({
          title: `Abrir caja`,
          text: `Seguro que deseas abrir esta caja?`,
          icon: 'question',
          input: 'number',
          inputValue: openAmount,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Abrir',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            openAmount = Number(result.value);
            dispatch(
              openCashRegister({
                cashRegisterId: registerId,
                openRegisterDTO: {
                  montoApertura: openAmount,
                },
              })
            )
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Caja abierta',
                  text: `Se ha abierto la caja con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: 'Error',
                  text: `Error: ${error.response?.data?.message || error.message}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
              });
          }
        });
    },
    [dispatch, myAlert, openAmount]
  );

  const closeRegister = useCallback(
    (registerId: string) => {
      myAlert
        .fire({
          title: 'Cerrar caja',
          text: `Seguro que deseas cerrar esta caja?`,
          icon: 'question',
          input: 'number',
          inputValue: closeAmount,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Cerrar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            closeAmount = Number(result.value);
            dispatch(
              closeCashRegister({
                cashRegisterId: registerId,
                closeRegisterDTO: {
                  montoCierre: closeAmount,
                },
              })
            );
          }
        });
    },
    [dispatch, myAlert, closeAmount]
  );

  return (
    <div className="border-2 border-black h-full p-4 max-w-full">
      <div className="flex flex-wrap gap-2 my-2">
        <button
          onClick={() => navigate('/cash-registers/create')}
          className="px-3 py-1 rounded-full cursor-pointer bg-blue-900 text-white text-sm font-regular"
        >
          Nueva Caja
        </button>
        <button
          onClick={toggleFilters}
          className="px-3 py-1 bg-green-900 text-white dark:text-gray-200 rounded-full text-sm font-regular"
        >
          Filtrar
        </button>
        <SearchBar />
      </div>
      {showFilters && (
        <div className="border border-black w-md h-auto p-4 flex flex-row gap-4">
          <div>
            <h2 className="text-black dark:text-gray-200 font-semibold">Filtros</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button>Cajas abiertas</button>
            <button>Cajas cerradas</button>
          </div>
        </div>
      )}

      {data ? (
        <Table
          data={data}
          columns={cashRegistersColumns}
          actions={cashRegistersActions}
          pageSizeOptions={[5, 10, 20]}
          defaultPageSize={10}
        />
      ) : (
        <div>
          <p>No hay cajas registradoras</p>
        </div>
      )}
    </div>
  );
};
