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
import { SearchBar } from '../../../components/SearchBar/SearchBar';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import { BiFilter, BiPlusCircle, BiTrash } from 'react-icons/bi';
import PageMeta from '../../../components/common/PageMeta';

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
          title: `Eliminar caja!`,
          text: `Estas seguro que deseas eliminar esta caja?`,
          iconHtml: <BiTrash />,
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
                myAlertSuccess(`Caja eliminada`, `Se ha eliminado la caja exitosamente!`);
                dispatch(clearCashRegisterError());
                navigate('/cash-registers', { replace: true });
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
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
                myAlertSuccess(`Caja abierta`, `Se ha abierto la caja con exito`);
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <PageMeta title="Cajas Registradoras PoS v2" description="Cajas Registradoras" />
      <div className="p-4 space-y-6 h-screen max-h-full p-4 max-w-full">
        <div className="flex-col space-y-4">
          <h2 className="text-3xl font-regular">Cajas</h2>
          <div className="flex flex-wrap gap-2 my-2">
            <Button
              size="sm"
              startIcon={<BiPlusCircle size={24} />}
              onClick={() => navigate('/cash-registers/create')}
              variant="primary"
            >
              Nueva Caja
            </Button>
            <Button
              size="sm"
              startIcon={<BiFilter size={24} />}
              onClick={toggleFilters}
              variant="outline"
              className="px-3 py-1 bg-green-900 text-black dark:text-gray-200 rounded-full text-sm font-regular"
            >
              Filtrar
            </Button>
            <SearchBar />
          </div>
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

        {loading && <Spinner />}

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
    </>
  );
};
