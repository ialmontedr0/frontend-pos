import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispath, useAppSelector } from '../../../../hooks/hooks';
import type { RootState } from '../../../../store/store';
import { getProviderById, deleteProvider, clearSelectedProvider } from '../slices/providersSlice';

import type { User } from '../../../users/interfaces/UserInterface';
import { usersService } from '../../../users/services/usersService';

export const Provider: React.FC = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { providerId } = useParams<{ providerId: string }>();

  const { provider, loading, error } = useAppSelector((state: RootState) => state.providers);

  const [creator, setCreator] = useState<User | null>(null);
  const [updater, setUpdater] = useState<User | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!providerId) {
      navigate('/products/providers');
      return;
    }
    dispatch(getProviderById(providerId));
    return () => {
      dispatch(clearSelectedProvider());
      setCreator(null);
      setUpdater(null);
      setFetchError(null);
    };
  }, [dispatch, providerId, navigate]);

  useEffect(() => {
    if (!provider) return;

    setFetchError(null);
    const loadById = async (userId: string, setter: (u: User | null) => void) => {
      try {
        const userResponse = await usersService.getById(userId);
        setter(userResponse.data);
      } catch (error: any) {
        setter(null);
        setFetchError(`No se pudo obtener el usuario con el ID: ${userId}`);
      }
    };

    if (provider.createdBy) {
      loadById(provider.createdBy, setCreator);
    }

    if (provider.updatedBy) {
      loadById(provider.updatedBy, setUpdater);
    }
  }, [providerId]);

  const handleDeleteProvider = useCallback(
    (providerId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Categoria',
          text: `Estas seguro que deseas eliminar este proveedor?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar!',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProvider(providerId))
              .unwrap()
              .then(() => {
                myAlert.fire({
                  title: 'Proveedor eliminada',
                  text: `Se ha eliminado el proveedor con exito!`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
                navigate('/products/providers');
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
    [dispatch, navigate, myAlert]
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Cargando proveedor...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-red-600 dark:text-red-40">Error: {error}</p>
        <button
          onClick={() => navigate('/products/providers')}
          className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          Volver
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Proveedor {provider?.nombre}
          </h2>

          <div className="grid grid-cols sm:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">RNC</p>
              <p className="text-gray-800 dark:text-gray-200">{provider?.RNC}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Telefono</p>
              <p className="text-gray-800 dark:text-gray-200">{provider?.telefono}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Procedencia</p>
              <p className="text-gray-800 dark:text-gray-200">{provider?.procedencia}</p>
            </div>

            {provider?.createdBy && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Creado por</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {creator ? `${creator.usuario}` : 'Cargando...'}
                </p>
              </div>
            )}

            {provider?.updatedBy && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Actualizado por</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {updater ? `${updater.usuario}` : 'Cargando...'}
                </p>
              </div>
            )}

            {fetchError && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{fetchError}</div>
            )}

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Fecha creacion</p>
              <p className="text-gray-800 dark:text-gray-200">
                {moment(provider?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Ultima Actualizacion</p>
              <p className="text-gray-800 dark:text-gray-200">
                {moment(provider?.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
              </p>
            </div>
          </div>
          <div className="mt-6 flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/products/providers')}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              ← Volver
            </button>
            <button
              onClick={() => navigate(`/products/providers/edit/${provider!._id}`)}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800"
            >
              Editar
            </button>
            <button
              onClick={() => handleDeleteProvider(provider!._id)}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
