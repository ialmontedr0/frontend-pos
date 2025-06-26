import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  getCustomerById,
  clearSelectedCustomer,
  updateCustomer,
  deleteCustomer,
} from '../slices/customerSlice';
import type { UpdateCustomerDTO } from '../dtos/update-customer.dto';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import type { RootState } from '../../../store/store';

export const EditCustomer: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { customer, loading, error } = useAppSelector((state: RootState) => state.customers);

  const sanitizedCustomerForForm = (c: any): UpdateCustomerDTO => {
    const { nombre, apellido, telefono, correo, direccion } = c;
    return {
      nombre,
      apellido,
      telefono,
      correo,
      direccion,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCustomerDTO>({
    defaultValues: {
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      direccion: '',
    },
  });

  useEffect(() => {
    if (customer) {
      reset(sanitizedCustomerForForm(customer));
    }
  }, [customer, reset]);

  useEffect(() => {
    if (!customerId) {
      navigate('/customers');
      return;
    }
    dispatch(getCustomerById(customerId));
    return () => {
      dispatch(clearSelectedCustomer());
    };
  }, [dispatch, customerId, navigate]);

  const onSubmit = (updateCustomerDTO: UpdateCustomerDTO) => {
    myAlert
      .fire({
        title: 'Actualizar cliente',
        text: `Estas seguro que deseas guardar los cambios?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(updateCustomer({ customerId: customer!._id, updateCustomerDTO })).then(() => {
            console.log(updateCustomerDTO.direccion);
            navigate(`/customers/${customerId}`);
          });
        }
      });
  };

  const onDelCustomer = useCallback(
    (customerId: string) => {
      myAlert
        .fire({
          title: `Eliminar cliente`,
          text: `Estas seguro que deseas eliminar el cliente?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: 'Si, eliminar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            if (customer) {
              dispatch(deleteCustomer(customerId))
                .unwrap()
                .then(() => {
                  myAlert.fire({
                    title: `Cliente Eliminado`,
                    text: 'Cliente eliminado con exito',
                    icon: 'success',
                    timer: 5000,
                    timerProgressBar: true,
                  });
                })
                .catch((error) => {
                  myAlert.fire({
                    title: 'Error',
                    text: `Error: ${error.response?.data?.message || error.message}`,
                    icon: 'error',
                    timer: 5000,
                    timerProgressBar: true,
                  });
                });
            }
          }
        });
    },
    [dispatch, navigate, myAlert]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar edicion!',
        text: `Estas seguro que deseas cancelar la edicion del usuario?`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(clearSelectedCustomer());
          navigate('/customers');
        }
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Cargando datos del cliente...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Cliente no encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" {...register('nombre', { required: true })} />
              {errors.nombre && <p className="text-sm text-red-500">Campo requerido</p>}
            </div>

            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" {...register('apellido')} />
              {errors.apellido && <p className="text-sm text-red-500">Campo requerido</p>}
            </div>

            <div>
              <Label htmlFor="telefono">Telefono</Label>
              <Input
                id="telefono"
                placeholder="+1 000-000-0000"
                {...register('telefono', { required: true, pattern: /^\+1\s\d{3}-\d{3}-\d{4}$/ })}
              />
              {errors.telefono && <p className="text-sm text-red-500">Formato invalido</p>}
            </div>

            <div>
              <Label htmlFor="correo">Correo</Label>
              <Input id="correo" type="email" {...register('correo')} />
            </div>

            <div className="col-span-full">
              <Label htmlFor="direccion">Direccion</Label>
              <Input
                id="direccion"
                placeholder="Direccion del cliente"
                {...register('direccion')}
              />
              {errors.direccion && (
                <p className="text-sm text-red-500">{errors.direccion.message}</p>
              )}
            </div>
          </div>
        </div>

        {error && <div>Error: {error}</div>}

        {/** Botones */}
        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t dark:border-gray-700">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Guardar
          </Button>
          <Button
            type="button"
            onClick={() => onDelCustomer(customer._id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar cliente
          </Button>
          <Button type="button" variant="outline" onClick={cancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
