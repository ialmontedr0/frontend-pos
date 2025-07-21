import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

import { getAllStores } from '../slices/storesSlice';

import type { Store } from '../interfaces/store.interface';
import type { Action, Column } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import { useModal } from '../../../hooks/useModal';
import PageMeta from '../../../components/common/PageMeta';
import Button from '../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import { EditStore } from '../components/EditStore';
import Spinner from '../../../components/UI/Spinner/Spinner';

export default function Stores() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();

  const [selectedBranche, setSelectedBranche] = useState<Store | null>(null);

  const { stores, loading, error } = useAppSelector((state: RootState) => state.stores);

  useEffect(() => {
    dispatch(getAllStores());
  }, [dispatch]);

  const branchesColumns: Column<Store>[] = [
    { header: 'Codigo', accessor: 'codigo' },
    { header: 'Nombre', accessor: 'nombre' },
    {
      header: 'Direccion',
      accessor: 'direccion',
      render: (value: Store['direccion']) => value.calle + `, ` + value.ciudad,
    },
    { header: 'Telefono', accessor: 'telefono' },
  ];

  const branchesActions: Action<Store>[] = [
    { label: 'Ver', onClick: (s) => viewStore(s.codigo) },
    { label: 'Editar', onClick: (s) => editStore(s) },
  ];

  const branchesData = stores;

  const newBranche = () => {
    navigate('/stores/create');
  };

  const viewStore = (codigo: string) => {
    navigate(`/stores/${codigo}`);
  };

  const editStore = (store: Store) => {
    setSelectedBranche(store);
    openModal();
  };

  return (
    <>
      <PageMeta title="Sucursales - PoS v2" description="Sucursales" />
      <div className="p-6 space-y-4 text-black dark:text-gray-200">
        <div className="space-y-6">
          <div className="my-2 flex flex-col gap-2 w-fit">
            <h2 className="text-2xl md:text-3xl font-medium">Sucursales</h2>
            <Button size="sm" variant="primary" startIcon={<BiPlusCircle />} onClick={newBranche}>
              Nueva Sucursal
            </Button>
          </div>

          {loading && <Spinner />}

          {error && <div>Error: {error}</div>}

          {branchesData ? (
            <Table
              data={branchesData}
              columns={branchesColumns}
              actions={branchesActions}
              pageSizeOptions={[5, 10]}
              defaultPageSize={5}
            />
          ) : (
            <div>No hay sucursales para mostrar</div>
          )}
        </div>
      </div>

      <EditStore store={selectedBranche!} isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}
