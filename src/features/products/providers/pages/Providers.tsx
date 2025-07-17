import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../../store/store';
import { getAllProviders, deleteProvider } from '../slices/providersSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';

import type { Provider } from '../interfaces/ProviderInterface';
import type { Column, Action } from '../../../../components/Table/types';
import { Table } from '../../../../components/Table/Table';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import PageMeta from '../../../../components/common/PageMeta';
import Button from '../../../../components/UI/Button/Button';
import { BiPlusCircle } from 'react-icons/bi';
import { EditProvider } from '../components/EditProvider';
import { myAlertError, myAlertSuccess } from '../../../../utils/commonFunctions';
import { useModal } from '../../../../hooks/useModal';

export const Providers: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const { providers, loading, error } = useAppSelector((state: RootState) => state.providers);

  useEffect(() => {
    dispatch(getAllProviders());
  }, [dispatch]);

  const providersData: Provider[] = providers;

  const providersColumns: Column<Provider>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'RNC', accessor: 'RNC' },
    { header: 'Tefono', accessor: 'telefono' },
    { header: 'Procedencia', accessor: 'procedencia' },
  ];

  const providerActions: Action<Provider>[] = [
    { label: 'Ver', onClick: (p) => viewProvider(p._id) },
    { label: 'Editar', onClick: (provider) => editProvider(provider) },
    { label: 'Eliminar', onClick: (p) => handleDeleteProvider(p._id) },
  ];

  const createProvider = () => {
    navigate('/products/providers/create');
  };

  const viewProvider = useCallback(
    (providerId: string) => {
      navigate(`/products/providers/${providerId}`);
    },
    [navigate]
  );

  const editProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    openModal();
  };

  const handleDeleteProvider = useCallback(
    (providerId: string) => {
      myAlert
        .fire({
          title: 'Eliminar proveedor!',
          text: `Estas seguro que deseas eliminar este proveedor?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProvider(providerId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Proveedor Elimindo`, `Se ha eliminado el proveedor con exito.`);
                navigate(`/products/providers`);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch, myAlert, navigate, myAlertSuccess, myAlertError]
  );

  return (
    <>
      <PageMeta title="Proveedores - PoS v2" description="Proveedores" />
      <div className="overflow-x-auto space-y-6 p-4">
        <div className="space-y-4">
          <h2 className="text-3xl font-regular text-black dark:text-gray-200">Proveedores</h2>
          <Button startIcon={<BiPlusCircle size={24} />} type="button" onClick={createProvider}>
            Nuevo Proveedor
          </Button>
        </div>

        {loading && <Spinner />}
        {error && <div className="text-sm text-red-600">Error: {error}</div>}

        {providersData.length ? (
          <Table
            columns={providersColumns}
            data={providersData}
            defaultPageSize={10}
            pageSizeOptions={[5, 10, 20]}
            actions={providerActions}
          />
        ) : (
          <div>No hay proveedores en el sistema.</div>
        )}
      </div>
      <EditProvider
        provider={selectedProvider!}
        isOpen={isOpen}
        closeModal={closeModal}
        error={error!}
      />
    </>
  );
};
