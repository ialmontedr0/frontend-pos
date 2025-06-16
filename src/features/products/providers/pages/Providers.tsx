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

export const Providers: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { providers, loading, error } = useAppSelector((state: RootState) => state.providers);

  useEffect(() => {
    dispatch(getAllProviders());
  }, [dispatch]);

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
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">Proveedores</h2>

      <button type="button" onClick={createProvider}>
        Nuevo Proveedor +
      </button>

      {loading && <div>Cargando...</div>}
      {!loading && providers.length === 0 && <div>No hay proveedores</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      <Table
        columns={providersColumns}
        data={providers}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20]}
        actions={providerActions}
      />
    </div>
  );
};
