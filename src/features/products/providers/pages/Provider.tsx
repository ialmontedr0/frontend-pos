import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment';
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

export const Provider: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
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
    return <div></div>;
  }

  return (
    <>
      <PageMeta title="Proveedor - PoS v2" description="Proveedor" />
      <div className="h-screen max-h-auto p-4 h-auto">
        <div className="space-y-4 p-6 max-h-full rounded-lg shadow">
          <div className="">
            <h2 className="text-3xl md:text-2xl xs:text-2xl font-regular">{provider.nombre}</h2>
          </div>

          <div className="h-auto lg:grid lg:grid-cols-2">
            <div className="">
              <Label htmlFor="">Nombre</Label>
              <p>{provider.nombre}</p>
            </div>

            <div className="">
              <Label htmlFor="RNC">RNC</Label>
              <p>{provider.RNC}</p>
            </div>

            <div className="">
              <Label htmlFor="telefono">Telefono</Label>
              <p>{provider.telefono}</p>
            </div>

            <div className="">
              <Label htmlFor="procedencia">Procedencia</Label>
              <p>{provider.procedencia}</p>
            </div>

            {provider.createdBy && (
              <div className="">
                <Label htmlFor="createdBy">Creado por</Label>
                <p>{provider.createdBy.usuario || '-'}</p>
              </div>
            )}

            <div>
              <Label htmlFor="createdAt">Fecha creacion</Label>
              <p>{moment(provider.createdAt).format('LLLL')}</p>
            </div>

            {provider.updatedBy && (
              <div className="">
                <Label htmlFor="updatedBy">Actualizado por</Label>
                <p>{provider.updatedBy.usuario}</p>
              </div>
            )}

            {provider.updatedAt && (
              <div className="">
                <Label htmlFor="updatedAt">Fecha actualizacion</Label>
                <p>{moment(provider.updatedAt).format('LLLL')}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              size="sm"
              startIcon={<BiEdit size={20} />}
              onClick={() => navigate(`/products/providers/edit/${provider._id}`)}
              variant="primary"
            >
              Editar
            </Button>
            <Button
              size="sm"
              startIcon={<BiTrash size={20} />}
              onClick={() => handleDeleteProvider(provider._id)}
              className="bg-red-500 text-white dark:bg-red-400 hover:bg-red-700"
            >
              Eliminar
            </Button>
            <Button
              size="sm"
              startIcon={<BiArrowBack size={20} />}
              onClick={() => navigate('/products/providers')}
              variant="outline"
            >
              Volver
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
