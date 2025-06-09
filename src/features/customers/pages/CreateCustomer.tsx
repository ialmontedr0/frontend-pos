import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispath } from '../../../hooks/hooks';
import type { RootState } from '../../../store/store';
import { clearCustomerError, createCustomer } from '../slices/customerSlice';
import type { CreateCustomerDTO } from '../dtos/create-customer.dto';

import { Button } from '../../../components/UI/Button/Button';
import { Input } from '../../../components/UI/Input/Input';
import { Textarea } from '../../../components/UI/TextArea/TextArea';
import { Label } from '../../../components/UI/Label/Label';

export const CreateCustomer: React.FC = () => {
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const {
    loading,
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
      direccion: '',
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
              navigate('/users');
            })
            .catch((error: any) => {
              myAlert.fire({
                title: 'Error',
                text: `Error: ${error}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
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
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
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

          <div>
            <Label htmlFor="direccion">Direccion</Label>
            <Textarea
              id="direccion"
              placeholder="Ej. Calle 01, Provincia, Pais"
              {...register('direccion')}
            />
          </div>
        </div>

        {error && (
          <p className="text-center text-red-600 bg-red-100 rounded-md p-2">Error: {error}</p>
        )}

        <div className="flex justify-end pt-4 border-t dark:border-gray-700">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
            {loading ? 'Creando...' : 'Crear Cliente'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/customers')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
