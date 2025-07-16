import React, { useEffect, useCallback } from 'react';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { Modal } from '../../../components/UI/Modal/Modal';
import { myAlertSuccess, myAlertError } from '../../../utils/commonFunctions';
import type { Customer } from '../interfaces/CustomerInterface';
import { useAppDispatch } from '../../../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import type { UpdateCustomerDTO } from '../dtos/update-customer.dto';
import { useForm } from 'react-hook-form';
import { BiSave, BiSolidSave, BiSolidTrash, BiTrash, BiX } from 'react-icons/bi';
import { deleteCustomer, getCustomerById, updateCustomer } from '../slices/customerSlice';

interface EditCustomerProps {
  customer: Customer;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const EditCustomer: React.FC<EditCustomerProps> = ({
  isOpen,
  customer,
  closeModal,
  error,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const sanitizedCustomerForForm = (customer: Customer): UpdateCustomerDTO => {
    const { nombre, apellido, telefono, correo, direccion } = customer;
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
        reset(sanitizedCustomerForForm(customer))
    }
  }, [customer, reset])

  useEffect(() => {
    if (!customer) {
      navigate('/customers');
      return;
    }
    return () => {};
  }, [customer, navigate]);

  const onSubmit = useCallback(
    (updateCustomerDTO: UpdateCustomerDTO) => {
      myAlert
        .fire({
          title: 'Actualizar Cliente',
          text: `Estas seguro que deseas guardar los cambios?`,
          iconHtml: <BiSolidSave />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed && customer) {
            dispatch(
              updateCustomer({
                customerId: customer._id,
                updateCustomerDTO,
              })
            )
              .unwrap()
              .then((customer) => {
                closeModal();
                myAlertSuccess(
                  `Cliente ${customer.nombre} actualizado`,
                  `Se ha actualizado el cliente con exito`
                );
                getCustomerById(customer._id);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch]
  );

  const onDelCustomer = useCallback(
    (customerId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Cliente',
          text: `Estas seguro que deseas eliminar el cliente?`,
          iconHtml: <BiSolidTrash />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteCustomer(customerId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Cliente Eliminado`, `Se ha eliminado el cliente con exito`);
                navigate(-1);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch, navigate, myAlert, myAlertSuccess, myAlertError]
  );

  const cancel = () => {
    myAlert
      .fire({
        title: 'Cancelar edicion!',
        text: `Estas seguro que deseas cancelar la edicion del cliente?`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          closeModal();
        }
      });
  };

  if (!customer) return;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="mx-4 md:mx-auto max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Editar Cliente
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
              Actualiza los datos del cliente
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="text-lg mb-5 font-medium text-black dark:text-gray-200 lg:mb-6">
                  {customer.nombre} {customer.apellido || ''}
                </h5>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                      placeholder={customer.nombre}
                    />
                    {errors.nombre && (
                      <div className="text-sm text-red-500">{errors.nombre.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      {...register('apellido')}
                      placeholder={customer.apellido}
                    />
                    {errors.apellido && (
                      <div className="text-sm text-red-500">{errors.apellido.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="telefono">Telefono</Label>
                    <Input
                      id="telefono"
                      {...register('telefono', {
                        required: 'El campo telefono es obligatorio.',
                        pattern: /^\+1\s\d{3}-\d{3}-\d{4}$/,
                      })}
                      placeholder={customer.telefono}
                    />
                    {errors.telefono && (
                      <div className="text-sm text-red-500">{errors.telefono.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="correo">Correo</Label>
                    <Input
                      id="correo"
                      type="email"
                      {...register('correo')}
                      placeholder={customer.correo}
                    />
                    {errors.correo && (
                      <div className="text-sm text-red-500">{errors.correo.message}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="direccion">Direccion</Label>
                    <Input
                      id="direccion"
                      {...register('direccion')}
                      placeholder={customer.direccion}
                    />
                    {errors.direccion && (
                      <div className="text-sm text-red-500">{errors.direccion.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-red-500">Error: {error}</div>}
            <div className="flex flex-wrap items-center gap-3 px-2 my-4 justify-center md:justify-end">
              <Button type="submit" size="sm" variant="primary" startIcon={<BiSave size={20} />}>
                Guardar Cambios
              </Button>
              <Button
                size="sm"
                variant="destructive"
                startIcon={<BiTrash size={20} />}
                onClick={() => onDelCustomer(customer._id)}
              >
                Eliminar
              </Button>
              <Button size="sm" variant="outline" startIcon={<BiX size={20} />} onClick={cancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
