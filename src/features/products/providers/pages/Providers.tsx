import React, { useEffect, useCallback } from 'react';
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

export const Providers: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

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
    { label: 'Editar', onClick: (p) => editProvider(p._id) },
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

  const editProvider = useCallback(
    (providerId: string) => {
      navigate(`/products/providers/edit/${providerId}`);
    },
    [navigate]
  );

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
                myAlert.fire({
                  title: 'Proveedor eliminado',
                  text: `Se ha eliminado el proveedor con exito`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate(`/products/providers`);
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
    [dispatch, myAlert, navigate]
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
    </>
  );
};
