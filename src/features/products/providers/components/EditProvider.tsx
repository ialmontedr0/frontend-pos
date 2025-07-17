import React, { useEffect, useCallback } from 'react';

import Button from '../../../../components/UI/Button/Button';
import Input from '../../../../components/UI/Input/Input';
import { Label } from '../../../../components/UI/Label/Label';
import { Modal } from '../../../../components/UI/Modal/Modal';
import { myAlertSuccess, myAlertError } from '../../../../utils/commonFunctions';
import type { Provider } from '../interfaces/ProviderInterface';
import { useAppDispatch } from '../../../../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

import { useForm } from 'react-hook-form';
import { BiSave, BiSolidSave, BiSolidTrash, BiTrash, BiX } from 'react-icons/bi';
import {
  deleteProvider,
  getProviderById,
  updateProvider,
} from '../slices/providersSlice';
import type { UpdateProviderDTO } from '../dtos/update-provider.dto';

interface EditProviderProps {
  provider: Provider;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const EditProvider: React.FC<EditProviderProps> = ({
  isOpen,
  provider,
  closeModal,
  error,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const sanitizedProviderForForm = (provider: Provider): UpdateProviderDTO => {
    const { nombre, RNC, telefono, procedencia } = provider;
    return {
      nombre,
      RNC,
      telefono,
      procedencia,
    };
  };

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
      reset(sanitizedProviderForForm(provider));
    }
  }, [provider, reset]);

  useEffect(() => {
    if (!provider) {
      navigate('/products/providers');
      return;
    }
    return () => {};
  }, [provider, navigate]);

  const onSubmit = useCallback(
    (updateProviderDTO: UpdateProviderDTO) => {
      myAlert
        .fire({
          title: 'Actualizar Proveedor',
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
          if (result.isConfirmed && provider) {
            dispatch(
              updateProvider({
                providerId: provider._id,
                updateProviderDTO,
              })
            )
              .unwrap()
              .then((provider) => {
                closeModal();
                myAlertSuccess(
                  `Proveedor ${provider.nombre} actualizado`,
                  `Se ha actualizado el proveedor con exito`
                );
                getProviderById(provider._id);
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
    (providerId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Proveedor',
          text: `Estas seguro que deseas eliminar el proveedor?`,
          iconHtml: <BiSolidTrash color='red'/>,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: 'red'
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteProvider(providerId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Proveedor Eliminado`, `Se ha eliminado el proveedor con exito`);
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
        text: `Estas seguro que deseas cancelar la edicion del proveedor?`,
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

  if (!provider) return;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="mx-4 md:mx-auto max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Editar Proveedor
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
              Actualiza los datos del proveedor
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-fit overflow-y-auto px-2">
              <div className="">
                <h5 className="text-lg font-medium text-black dark:text-gray-200">
                  {provider.nombre}
                </h5>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                      placeholder={provider.nombre}
                    />
                    {errors.nombre && (
                      <div className="text-sm text-red-500">{errors.nombre.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="RNC">RNC</Label>
                    <Input id="RNC" {...register('RNC')} placeholder={provider.RNC} />
                    {errors.RNC && <div className="text-sm text-red-500">{errors.RNC.message}</div>}
                  </div>
                  <div>
                    <Label htmlFor="telefono">Telefono</Label>
                    <Input
                      id="telefono"
                      {...register('telefono', {
                        required: 'El campo telefono es obligatorio.',
                        pattern: /^\+1\s\d{3}-\d{3}-\d{4}$/,
                      })}
                      placeholder={provider.telefono}
                    />
                    {errors.telefono && (
                      <div className="text-sm text-red-500">{errors.telefono.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="procedencia">Procedencia</Label>
                    <Input
                      id="procedencia"
                      type="text"
                      {...register('procedencia')}
                      placeholder={provider.procedencia}
                    />
                    {errors.procedencia && (
                      <div className="text-sm text-red-500">{errors.procedencia.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-red-500">Error: {error}</div>}
            <div className="flex flex-wrap items-center gap-3 px-2 mt-4 justify-center md:justify-end">
              <Button type="submit" size="sm" variant="primary" startIcon={<BiSave size={20} />}>
                Guardar Cambios
              </Button>
              <Button
                size="sm"
                variant="destructive"
                startIcon={<BiTrash size={20} />}
                onClick={() => onDelCustomer(provider._id)}
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
