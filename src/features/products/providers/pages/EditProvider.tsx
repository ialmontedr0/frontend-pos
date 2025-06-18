import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {
  clearSelectedProvider,
  deleteProvider,
  getProviderById,
  updateProvider,
} from '../slices/providersSlice';
import type { RootState } from '../../../../store/store';
import { useForm } from 'react-hook-form';
import type { UpdateProviderDTO } from '../dtos/update-provider.dto';
import { Label } from '../../../../components/UI/Label/Label';
import { Input } from '../../../../components/UI/Input/Input';
import { Button } from '../../../../components/UI/Button/Button';
import { BiSave, BiTrash, BiX } from 'react-icons/bi';

export const EditProvider: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);
  const { providerId } = useParams<{ providerId: string }>();

  const { provider, loading, error } = useAppSelector((state: RootState) => state.providers);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProviderDTO>({
    defaultValues: {
      nombre: '',
      RNC: '',
      telefono: '',
      procedencia: '',
    },
  });

  useEffect(() => {
    if (provider) {
      reset({
        nombre: provider.nombre,
        RNC: provider.RNC,
        telefono: provider.telefono,
        procedencia: provider.procedencia,
      });
    }
  }, [provider, reset]);

  useEffect(() => {
    dispatch(getProviderById(providerId!));
    return () => {
      dispatch(clearSelectedProvider());
    };
  }, [dispatch, providerId, navigate]);

  const onSubmit = (updateProviderDTO: UpdateProviderDTO) => {
    myAlert
      .fire({
        title: 'Actualizar proveedor!',
        text: `Estas seguro que deseas actualizar este proveedor?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, guardar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(
            updateProvider({
              providerId: provider!._id,
              updateProviderDTO,
            })
          )
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: `Cambios guardados`,
                text: `Se ha actualizado el proveedor con exito`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
              navigate(`/products/providers/${provider?._id}`);
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
  };

  const onDelProvider = useCallback(
    (providerId: string) => {
      myAlert
        .fire({
          title: 'Eliminar proveedor',
          text: 'Estas seguro que deseas eliminar este proveedor?',
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
                  timer: 500,
                  timerProgressBar: true,
                });
                navigate('/products/providers');
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: `Error`,
                  text: `Error: ${error}`,
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

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar edicion!',
        text: 'Estas seguro que deseas cancelar la edicion del proveedor?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate('/products/providers');
        }
      });
  };

  if (loading) {
    return (
      <div>
        <p>Cargando proveedor...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div>
        <p>Producto no encontrado.</p>
        <button onClick={() => navigate('/products/providers')}>Volver</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <div className="flex w-auto">
          <h2 className="text-2xl font-semibold">Editar Proveedor</h2>
        </div>

        <div className="flex flex-col md:flex-col gap-6 items-start">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre del proveedor"
              {...register('nombre', { required: 'El campo nombre es obligarorio' })}
            />
            {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
          </div>

          <div>
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              placeholder="Telefono ej. +1 000-000-0000"
              {...register('telefono', {
                required: 'El campo telefono es obligatorio',
                pattern: /^\+1\s\d{3}-\d{3}-\d{4}$/,
              })}
            />
            {errors.telefono && <p className="text-sm text-red-500">{errors.telefono.message}</p>}
          </div>

          <div>
            <Label htmlFor="RNC">RNC</Label>
            <Input
              id="RNC"
              placeholder="RNC del proveedor"
              {...register('RNC', { required: 'El campo RNC es obligatorio' })}
            />
            {errors.RNC && <p className="text-sm text-red-500">{errors.RNC.message}</p>}
          </div>

          <div>
            <Label htmlFor="procedencia">Procedencia</Label>
            <Input
              id="procedencia"
              placeholder=""
              {...register('procedencia', { required: 'El campo procedencia es obligatorio' })}
            />
            {errors.procedencia && (
              <p className="text-sm text-red-500">{errors.procedencia.message}</p>
            )}
          </div>

          {error && <div className="text-red-600">Error: {error}</div>}

          {/** Bloque de botones para Edits REUTILIZAR */}
          <div className="flex flex-wrap justify-end gap-2 pt-4 border-t dark:border-gray-700">
            <Button
              type="submit"
              icon={<BiSave size={28} />}
              iconPosition="left"
              className="bg-transparent hover:bg-gray-200 text-black"
              aria-label="Guardar"
              title="Guardar"
            ></Button>

            <Button
              type="button"
              icon={<BiTrash size={28} />}
              variant="destructive"
              onClick={() => onDelProvider(provider._id)}
              className="bg-transparent hover:bg-gray-200 text-red-600"
              aria-label="Eliminar"
              title="Eliminar"
            ></Button>

            <Button
              type="button"
              icon={<BiX size={28} />}
              variant="outline"
              onClick={cancel}
              className="bg-transparent text-black"
            ></Button>
          </div>
        </div>
      </form>
    </div>
  );
};
