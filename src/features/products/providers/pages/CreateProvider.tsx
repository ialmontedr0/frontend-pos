import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispatch } from '../../../../hooks/hooks';
import type { RootState } from '../../../../store/store';
import { clearProviderError, createProvider } from '../slices/providersSlice';

import type { CreateProviderDTO } from '../dtos/create-provider.dto';

import Button from '../../../../components/UI/Button/Button';
import { Label } from '../../../../components/UI/Label/Label';
import Input from '../../../../components/UI/Input/Input';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import { myAlertError, myAlertSuccess } from '../../../../utils/commonFunctions';
import { BiSave } from 'react-icons/bi';

export const CreateProvider: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const {
    loading,
    error,
    provider: createdProvider,
  } = useAppSelector((state: RootState) => state.providers);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProviderDTO>({
    defaultValues: {
      nombre: '',
      RNC: '',
      telefono: '',
      procedencia: '',
    },
  });

  useEffect(() => {
    if (createdProvider) {
      navigate('/products/providers');
    }
  }, [createdProvider, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearProviderError());
    };
  }, [dispatch]);

  const onSubmit = (createProviderDTO: CreateProviderDTO) => {
    myAlert
      .fire({
        title: 'Crear proveedor',
        text: `Estas seguro que deseas crear el nuevo proveedor?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, crear',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(createProvider(createProviderDTO))
            .unwrap()
            .then(() => {
              myAlertSuccess(`Proveedor creado`, `Se ha creado el proveedor con exito!`);
              navigate('/products/providers');
            })
            .catch((error: any) => {
              myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
            });
        }
      });
  };

  const cancel = () => {
    myAlert
      .fire({
        title: `Cancelar creacion`,
        text: `Estas seguro que deseas cancelar la creacion del proveedor?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cancelar',
        cancelButtonText: 'Continuar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate('/products/providers');
        }
      });
  };

  return (
    <div className="py-6 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-regular text-gray-800 dark:text-gray-100 mb-4">
          Crear Proveedor
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre"
              {...register('nombre', { required: 'El campo nombre es obligatorio' })}
            />
            {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre.message}</p>}
          </div>

          <div>
            <Label htmlFor="RNC">RNC</Label>
            <Input
              id="RNC"
              placeholder="Ingrese RNC"
              {...register('RNC', { required: 'El campo RNC es obligatorio' })}
            />
            {errors.RNC && <p className="text-red-600 text-sm">{errors.RNC.message}</p>}
          </div>

          <div>
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              placeholder="+1 000-000-0000"
              {...register('telefono', {
                required: 'El campo telefono es obligatorio',
                pattern: {
                  value: /^\+1\s\d{3}-\d{3}-\d{4}$/,
                  message: 'Formato invalido, ej: +1 000-000-0000',
                },
              })}
            />
            {errors.telefono && <p className="text-red-600 text-sm">{errors.telefono.message}</p>}
          </div>

          <div>
            <Label htmlFor="procedencia">Procedencia</Label>
            <Input
              id="procedencia"
              placeholder="Provincia procedencia"
              {...register('procedencia', { required: 'El campo procedencia es obligatorio' })}
            />
            {errors.procedencia && (
              <p className="text-red-600 text-sm">{errors.procedencia.message}</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-center text-red-600 bg-red-100 rounded-md p-2">Error: {error}</p>
        )}

        {loading && <Spinner />}

        <div className="flex gap-2 justify-end pt-4 border-t dark:border-gray-700">
          <Button startIcon={<BiSave size={20} />} type="submit" variant="primary">
            {loading ? 'Creando...' : 'Crear'}
          </Button>
          <Button type="button" variant="outline" onClick={cancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
