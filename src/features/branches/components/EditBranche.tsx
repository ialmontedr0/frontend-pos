import React, { useEffect, useCallback } from 'react';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { Modal } from '../../../components/UI/Modal/Modal';
import { myAlertSuccess, myAlertError } from '../../../utils/commonFunctions';
import type { Branche } from '../interfaces/branche.interface';
import { useAppDispatch } from '../../../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {
  updateBranche,
  deleteBranche,
  getBrancheById,
  clearSelectedBranche,
} from '../slices/branchesSlice';
import type { UpdateBrancheDTO } from '../dtos/update-branche.dto';

import { useForm } from 'react-hook-form';
import { BiSave, BiSolidSave, BiSolidTrash, BiTrash, BiX } from 'react-icons/bi';

interface EditBrancheProps {
  branche: Branche;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const EditBranche: React.FC<EditBrancheProps> = ({ isOpen, branche, closeModal, error }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const sanitizedBrancheForForm = (branche: Branche): UpdateBrancheDTO => {
    const { nombre, direccion, telefono } = branche;
    return {
      nombre,
      direccion,
      telefono,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateBrancheDTO>({
    defaultValues: {
      nombre: '',
      direccion: {
        calle: '',
        ciudad: '',
      },
      telefono: '',
    },
  });

  useEffect(() => {
    if (branche) {
      reset(sanitizedBrancheForForm(branche));
    }
  }, [branche, reset]);

  useEffect(() => {
    if (!branche) {
      navigate('/branches');
      return;
    }
    return () => {};
  }, [branche, navigate]);

  const onSubmit = useCallback(
    (updateBrancheDTO: UpdateBrancheDTO) => {
      myAlert
        .fire({
          title: 'Actualizar Sucursal',
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
          if (result.isConfirmed && branche) {
            dispatch(
              updateBranche({
                brancheId: branche._id,
                updateBrancheDTO,
              })
            )
              .unwrap()
              .then((branche) => {
                closeModal();
                myAlertSuccess(
                  `Sucursal ${branche.nombre} actualizada`,
                  `Se ha actualizado la sucursal con exito`
                );
                getBrancheById(branche._id);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch]
  );

  const onDelBranche = useCallback(
    (brancheId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Sucursal',
          text: `Estas seguro que deseas eliminar la sucursal?`,
          iconHtml: <BiSolidTrash color="red" />,
          customClass: {
            icon: 'no-default-icon-border',
          },
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: 'red',
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteBranche(brancheId))
              .unwrap()
              .then(() => {
                closeModal();
                myAlertSuccess(`Sucursal Eliminada`, `Se ha eliminado la sucursal con exito`);
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
        text: `Estas seguro que deseas cancelar la edicion la sucursal?`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          closeModal();
          clearSelectedBranche();
        }
      });
  };

  if (!branche) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="mx-4 md:mx-auto max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Editar Sucursal
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
              Actualiza los datos la sucursal
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-fit overflow-y-auto px-2">
              <div className="">
                <h5 className="text-lg font-medium text-black dark:text-gray-200">
                  Sucursal {branche.nombre}
                </h5>
                <div className="flex flex-col md:grid md:grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      type="text"
                      {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                    />
                    {errors.nombre && (
                      <div className="text-sm text-red-500">{errors.nombre.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="direccion">Direccion</Label>
                    <div className="space-y-4">
                      <Label htmlFor="calle">Calle</Label>
                      <Input
                        id="calle"
                        type="text"
                        {...register('direccion.calle', {
                          required: 'El campo calle es obligatorio.',
                        })}
                      />
                      {errors.direccion?.calle && (
                        <div className="text-sm text-red-500">{errors.direccion.calle.message}</div>
                      )}

                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        type="text"
                        {...register('direccion.ciudad', {
                          required: 'El campo ciudad es obligatorio.',
                        })}
                      />
                      {errors.direccion?.ciudad && (
                        <div className="text-sm text-red-500">
                          {errors.direccion.ciudad.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telefono">Telefono</Label>
                    <Input
                      type="text"
                      id="telefono"
                      {...register('telefono', {
                        required: 'El campo telefono es obligatorio',
                        pattern: {
                          value: /^\+1\s\d{3}-\d{3}-\d{4}$/,
                          message: 'Formato invalido, ej: +1 000-000-0000',
                        },
                      })}
                    />
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
                onClick={() => onDelBranche(branche._id)}
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
