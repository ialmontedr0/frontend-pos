import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch } from '../../../hooks/hooks';
import { clearCashRegisterError, deleteCashRegister } from '../slices/cashRegisterSlice';

import { Table } from '../../../components/Table/Table';
import type { Column, Action } from '../../../components/Table/types';
import type { CashRegister } from '../interfaces/CashRegisterInterface';

import Button from '../../../components/UI/Button/Button';
import { SearchBar } from '../../../components/SearchBar/SearchBar';

import Spinner from '../../../components/UI/Spinner/Spinner';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import { BiFilter, BiPlusCircle, BiTrash } from 'react-icons/bi';
import PageMeta from '../../../components/common/PageMeta';
import Badge from '../../../components/UI/Badge/Badge';
import { useModal } from '../../../hooks/useModal';
import { EditRegister } from './EditRegister';
import { OpenAndCloseRegister } from './OpenAndCloseRegister';

interface CashRegisterTableProps {
  data: CashRegister[] | null;
  loading: boolean;
  error: string;
}

export const CashRegistersTable: React.FC<CashRegisterTableProps> = ({ data, loading, error }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const {
    isOpen: isOpenOrClose,
    openModal: openOpenOrCloseModal,
    closeModal: closeOpenOrCloseModal,
  } = useModal();
  const [actionType, setActionType] = useState<'open' | 'close'>('open');

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedRegister, setSelectedRegister] = useState<CashRegister | null>(null);

  const toggleFilters = () => {
    if (showFilters === true) {
      setShowFilters(false);
    } else {
      setShowFilters(true);
    }
  };

  const onEditRegister = (register: CashRegister) => {
    setSelectedRegister(register);
    openEditModal();
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
                myAlertError(error);
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
      render: (value: string) => {
        return value === 'abierta' ? (
          <Badge color="success">Abierta</Badge>
        ) : (
          <Badge color="error">Cerrada</Badge>
        );
      },
    },
    {
      header: 'Monto Actual',
      accessor: 'montoActual',
      render: (value: number) => `RD$ ${value.toFixed(2)}`,
    },
  ];

  const cashRegistersActions: Action<CashRegister>[] = [
    { label: 'Ver', onClick: (c) => navigate(`/cash-registers/${c.codigo}`) },
    {
      label: 'Abrir',
      onClick: (register) => {
        setSelectedRegister(register);
        setActionType('open');
        openOpenOrCloseModal();
      },
      render: (c) => (c.estado === 'cerrada' ? <span>Abrir</span> : null),
    },
    {
      label: 'Cerrar',
      onClick: (register: CashRegister) => {
        setSelectedRegister(register);
        setActionType('close');
        openOpenOrCloseModal();
      },
      render: (c) => (c.estado === 'abierta' ? <span>Cerrar</span> : null),
    },
    { label: 'Editar', onClick: (cashRegister) => onEditRegister(cashRegister) },
    { label: 'Eliminar', onClick: (c) => onDelRegister(c._id) },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <PageMeta title="Cajas Registradoras PoS v2" description="Cajas Registradoras" />
      <div className="p-4 space-y-6 h-screen max-h-full p-4 max-w-full text-black dark:text-gray-200">
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
          <div className="rounded-lg w-fit h-auto p-4 flex flex-row justify-start shadow-theme-md bg-gray-100/50 gap-4">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline">
                Cajas abiertas
              </Button>
              <Button size="sm" variant="outline">
                Cajas cerradas
              </Button>
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
      <EditRegister
        cashRegister={selectedRegister!}
        isOpen={isEditOpen}
        closeModal={closeEditModal}
        error={error!}
      />
      <OpenAndCloseRegister
        cashRegister={selectedRegister!}
        isOpen={isOpenOrClose}
        closeModal={closeOpenOrCloseModal}
        actionType={actionType}
        error={error!}
      />
    </>
  );
};
