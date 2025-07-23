import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { clearCustomerError, createCustomer } from '../slices/customerSlice';
import type { CreateCustomerDTO } from '../dtos/create-customer.dto';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import { BiSave, BiX } from 'react-icons/bi';

export const CreateCustomer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const {
    creating,
    error,
    customer: createdCustomer,
  } = useAppSelector((state: RootState) => state.customers);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerDTO>({
    defaultValues: {
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      direccion: {
        calle: '',
        casa: '',
        ciudad: '',
      },
    },
  });

  useEffect(() => {
    if (createdCustomer) {
      navigate('/customers');
    }
  }, [createdCustomer, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearCustomerError());
    };
  }, [dispatch]);

  const onSubmit = (createCustomerDTO: CreateCustomerDTO) => {
    myAlert
      .fire({
        title: 'Crear cliente!',
        text: `Estas seguro que deseas crear el nuevo cliente?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: 'Si, crear',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(createCustomer(createCustomerDTO))
            .unwrap()
            .then(() => {
              myAlertSuccess(`Cliente creado`, `Se ha creado el cliente exitosamente!`);
              navigate('/customers');
            })
            .catch((error: any) => {
              myAlertError(error);
            });
        }
      });
  };

  return (
    <div className="py-6 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-gray-200 mb-4">
          Crear Cliente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre.message}</p>}
          </div>

          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" placeholder="Apellido" {...register('apellido')} />
          </div>

          <div>
            <Label htmlFor="Telefono">Telefono</Label>
            <Input
              id="telefono"
              placeholder="+1 000-000-0000"
              {...register('telefono', {
                required: 'El telefono es obligatorio',
                pattern: {
                  value: /^\+1\s\d{3}-\d{3}-\d{4}$/,
                  message: 'Formato invalido, ej: +1 000-000-0000',
                },
              })}
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-500">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="correo">Correo</Label>
            <Input
              id="correo"
              placeholder="correo@ejemplo.com"
              {...register('correo', {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Formato de correo invalido',
                },
              })}
            />
            {errors.correo && <p className="mt-1 text-sm text-red-500">{errors.correo.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="direccion">Direccion</Label>
          <div className="border border-gray-200 p-4 w-full rounded-2xl shadow-theme-md">
            <Label htmlFor="">Calle</Label>
            <Input
              placeholder="Ingresa Calle"
              id="calle"
              type="text"
              {...register('direccion.calle')}
            />{' '}
            {errors.direccion?.calle && <div className="text-sm text-red-500"></div>}
            <Label htmlFor="">Casa</Label>
            <Input
              placeholder="Ingresa No. de residencia"
              id="casa"
              type="text"
              {...register('direccion.casa')}
            />{' '}
            {errors.direccion?.casa && <div className="text-sm text-red-500"></div>}
            <Label htmlFor="">Ciudad</Label>
            <Input
              placeholder="Ingresa Ciudad"
              id="ciudad"
              type="text"
              {...register('direccion.ciudad')}
            />{' '}
            {errors.direccion?.ciudad && <div className="text-sm text-red-500"></div>}
          </div>
        </div>

        {error && (
          <p className="text-center text-red-600 bg-red-100 rounded-md p-2">Error: {error}</p>
        )}

        <div className="flex justify-end pt-4 gap-2 dark:border-gray-700">
          <Button size='sm' startIcon={<BiSave size={20} />} type="submit" variant="primary">
            {creating ? 'Creando...' : 'Crear Cliente'}
          </Button>
          <Button
          size='sm'
            startIcon={<BiX size={20} />}
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
