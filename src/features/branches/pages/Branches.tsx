import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';

import { getAllBranches } from '../slices/branchesSlice';

import type { Branche } from '../interfaces/branche.interface';
import type { Action, Column } from '../../../components/Table/types';
import { Table } from '../../../components/Table/Table';
import { useModal } from '../../../hooks/useModal';
import PageMeta from '../../../components/common/PageMeta';
import Button from '../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import { EditBranche } from '../components/EditBranche';
import Spinner from '../../../components/UI/Spinner/Spinner';

export default function Branches() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();

  const [selectedBranche, setSelectedBranche] = useState<Branche | null>(null);

  const { branches, loading, error } = useAppSelector((state: RootState) => state.branches);

  useEffect(() => {
    dispatch(getAllBranches());
  }, [dispatch]);

  const branchesColumns: Column<Branche>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    {
      header: 'Direccion',
      accessor: 'direccion',
      render: (value: Branche['direccion']) => value.calle + `, ` + value.ciudad,
    },
    { header: 'Telefono', accessor: 'telefono' },
  ];

  const branchesActions: Action<Branche>[] = [
    { label: 'Ver', onClick: (b) => viewBranche(b._id) },
    { label: 'Editar', onClick: (b) => editBranche(b) },
  ];

  const branchesData = branches;

  const newBranche = () => {
    navigate('/branches/create');
  };

  const viewBranche = (brancheId: string) => {
    navigate(`/branches/${brancheId}`);
  };

  const editBranche = (branche: Branche) => {
    setSelectedBranche(branche);
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

      <EditBranche branche={selectedBranche!} isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}
