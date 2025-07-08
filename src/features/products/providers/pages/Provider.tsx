import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import type { RootState } from '../../../../store/store';
import { getProviderById, deleteProvider, clearSelectedProvider } from '../slices/providersSlice';

import { myAlertError, myAlertSuccess } from '../../../../utils/commonFunctions';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import { Label } from '../../../../components/UI/Label/Label';
import Button from '../../../../components/UI/Button/Button';
import { BiArrowBack, BiEdit, BiTrash } from 'react-icons/bi';
import PageMeta from '../../../../components/common/PageMeta';
import PageBreadcrum from '../../../../components/common/PageBreadCrumb';
import { NotFound } from '../../../../pages/NotFound';

export const Provider: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  moment.locale('es');
  const { providerId } = useParams<{ providerId: string }>();

  const { provider, loading, error } = useAppSelector((state: RootState) => state.providers);

  useEffect(() => {
    if (!providerId) {
      navigate('/products/providers');
      return;
    }
    dispatch(getProviderById(providerId));
    return () => {
      dispatch(clearSelectedProvider());
    };
  }, [dispatch, providerId, navigate]);

  // Eliminar un proveedor
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
                myAlertSuccess(`Proveedor eliminado`, `Se ha eliminado el proveedor exitosamente!`);
                navigate('/products/providers');
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    },
    [dispatch, navigate, myAlert]
  );

  if (loading) return <Spinner />;

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

  if (!provider) {
    return <NotFound node="Proveedor" />;
  }

  return (
    <>
      <PageMeta title="Proveedor - PoS v2" description="Proveedor" />
      <PageBreadcrum pageTitle="Proveedor" />
      <div className="m-2 mx-2 p-4 max-2-2xl bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-regular text-gray-800 dark:text-gray-100">
            {provider.nombre}
          </h2>

          <div className="grid grid-cols sm:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <Label>RNC</Label>
              <p className="text-gray-800 dark:text-gray-200">{provider.RNC}</p>
            </div>

            <div>
              <Label>Telefono</Label>
              <p className="text-gray-800 dark:text-gray-200">{provider.telefono}</p>
            </div>

            <div>
              <Label>Procedencia</Label>
              <p className="text-gray-800 dark:text-gray-200">{provider.procedencia}</p>
            </div>

            <div>
              <Label>Creado por</Label>
              <p className="text-gray-700 dark:text-gray-200">{provider.createdBy.usuario}</p>
            </div>

            <div>
              <Label>Fecha creacion</Label>
              <p className="text-gray-800 dark:text-gray-200">
                {moment(provider.createdAt).format('LLLL')}
              </p>
            </div>

            {provider.updatedBy && (
              <div>
                <Label htmlFor="updatedBy">Actualizado por</Label>
                <p>{provider.updatedBy.usuario}</p>
              </div>
            )}

            {provider.updatedAt && (
              <div>
                <Label>Fecha Actualizacion</Label>
                <p className="text-gray-800 dark:text-gray-200">
                  {moment(provider.updatedAt).format('LLLL')}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-center md:justify-end mt-4">
            <Button
              onClick={() => navigate('/products/providers')}
              size="sm"
              variant="primary"
              startIcon={<BiArrowBack size={24} />}
            >
              Volver
            </Button>
            <Button
              onClick={() => navigate(`/products/providers/edit/${provider._id}`)}
              size="sm"
              variant="outline"
              startIcon={<BiEdit size={24} />}
            >
              Editar
            </Button>
            <Button
              onClick={() => handleDeleteProvider(provider._id)}
              size="sm"
              variant="destructive"
              startIcon={<BiTrash size={24} />}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
