import React, { useEffect, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch } from '../../../hooks/hooks';
import { updateUser, deleteUser, getUserByUsername } from '../slices/usersSlice';
import type { User as UserInterface } from '../interfaces/UserInterface';
import type { UpdateUserDTO } from '../dtos/update-user.dto';
import type { Estado } from '../interfaces/UserInterface';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch/ToggleSwitch';
import { Modal } from '../../../components/UI/Modal/Modal';
import { myAlertSuccess, myAlertError } from '../../../utils/commonFunctions';
import { BiSave, BiSolidSave, BiSolidTrash, BiTrash, BiX } from 'react-icons/bi';

interface EditUserProps {
  user: UserInterface;
  isOpen: boolean;
  closeModal: () => void;
  error?: string;
}

export const EditUser: React.FC<EditUserProps> = ({ user, isOpen, closeModal, error }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const sanitizedUserForForm = (user: any): UpdateUserDTO => {
    const {
      nombre,
      apellido,
      usuario: useername,
      correo,
      telefono,
      direccion,
      rol,
      estado,
      foto,
      configuracion,
    } = user;
    return {
      nombre,
      apellido,
      usuario: useername,
      correo,
      telefono,
      direccion,
      rol,
      estado,
      foto,
      configuracion,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateUserDTO>({
    defaultValues: {
      nombre: '',
      apellido: '',
      usuario: '',
      correo: '',
      telefono: '',
      direccion: {
        calle: '',
        casa: '',
        ciudad: ''
      },
      rol: 'cajero',
      estado: 'activo',
      foto: '',
      configuracion: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      reset(sanitizedUserForForm(user));
    }
  }, [user, reset]);

  useEffect(() => {
    if (!user) {
      navigate('/users');
      return;
    }
    return () => {};
  }, [user, navigate]);

  const onSubmit = useCallback(
    (updateUserDTO: UpdateUserDTO) => {
      myAlert
        .fire({
          title: 'Actualizar Usuario',
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
          if (result.isConfirmed && user) {
            dispatch(
              updateUser({
                userId: user._id,
                updateUserDTO,
              })
            )
              .unwrap()
              .then(() => {
                closeModal();
                myAlertSuccess(`Usuario actualizado`, `Se ha actualizado el usuario con exito`);
                getUserByUsername(user.usuario!);
              })
              .catch((error: any) => {
                myAlertError(error);
              });
          }
        });
    },
    [dispatch]
  );

  const onDelUser = useCallback(
    (userId: string) => {
      myAlert
        .fire({
          title: 'Eliminar Usuario',
          text: `Estas seguro que deseas eliminar el usuario?`,
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
            dispatch(deleteUser(userId))
              .unwrap()
              .then(() => {
                myAlertSuccess(`Usuario Eliminado`, `Se ha eliminado el usuario con exito`);
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
        text: `Estas seguro que deseas cancelar la edicion del usuario?`,
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

  if (!user) return;

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px]">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-black dark:text-gray-200">
              Editar Usuario
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-200 lg:mb-7">
              Actualiza los datos del usuario
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="text-lg font-medium text-black dark:text-gray-200 lg:mb-6">
                  {user.nombre} {user.apellido}
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nombre</Label>
                    <Input
                      id="nombre"
                      {...register('nombre', { required: 'El campo nombre es obligatorio.' })}
                      placeholder={user.nombre}
                    />
                    {errors.nombre && (
                      <div className="text-sm text-red-500">{errors.nombre.message}</div>
                    )}
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input
                      id="apellido"
                      {...register('apellido', { required: 'El campo apellido es obligatorio.' })}
                      placeholder={user.apellido}
                    />
                    {errors.apellido && (
                      <div className="text-sm text-red-500">{errors.apellido.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="usuario">Usuario</Label>
                    <Input
                      id="usuario"
                      {...register('usuario', { required: 'El campo usuario es obligatorio' })}
                      placeholder={user.usuario}
                    />
                    {errors.usuario && (
                      <div className="text-sm text-red-500">{errors.usuario.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="correo">Correo Electronico</Label>
                    <Input
                      id="correo"
                      {...register('correo', { required: 'El campo correo es obgligatorio' })}
                      placeholder={user.correo}
                    />
                    {errors.correo && (
                      <div className="text-sm text-red-500">{errors.correo.message}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="telefono">Telefono</Label>
                    <Input
                      id="telefono"
                      {...register('telefono', { required: 'El campo telefono es obligatorio' })}
                      placeholder={user.telefono}
                    />
                    {errors.telefono && (
                      <div className="text-sm text-red-500">{errors.telefono.message}</div>
                    )}
                  </div>
                  <div>
                    <Label>Rol</Label>
                    <select
                      id="rol"
                      {...register('rol', { required: true })}
                      defaultValue={user.rol}
                    >
                      <option value="admin">Administrador</option>
                      <option value="cajero">Cajero</option>
                      <option value="inventarista">Inventarista</option>
                    </select>
                    {errors.rol && <div className="text-sm text-red-500">{errors.rol.message}</div>}
                  </div>

                  <div>
                    <Label>Estado</Label>
                    <Controller<UpdateUserDTO, 'estado'>
                      name="estado"
                      control={control}
                      defaultValue="activo"
                      render={({ field }) => (
                        <ToggleSwitch<Estado>
                          value={field.value!}
                          offValue="inactivo"
                          onValue="activo"
                          offLabel="Inactivo"
                          onLabel="Activo"
                          className="mt-1"
                          onToggle={field.onChange}
                        />
                      )}
                    />
                    {errors.estado && (
                      <div className="text-sm text-red-500">{errors.estado.message}</div>
                    )}
                  </div>

                  <div>
                    <Label>Direccion</Label>
                    <div className="grid grid-cols-2 space-x-2 space-y-2">
                <div>
                  <Label htmlFor="calle">Calle</Label>
                  <Input
                    id="calle"
                    type="text"
                    placeholder="Ingresa la calle de residencia del usuario"
                    {...register('direccion.calle', { required: 'El campo calle es obligatorio' })}
                  />
                  {errors.direccion?.calle && <div>{errors.direccion.calle.message}</div>}
                </div>
                <div>
                  <Label htmlFor="casa">Casa</Label>
                  <Input
                    id="casa"
                    type="text"
                    placeholder="Numero de la casa #"
                    {...register('direccion.casa', {
                      required: 'El campo casa es obligatorio',
                    })}
                  />
                  {errors.direccion?.casa && <div>{errors.direccion.casa.message}</div>}
                </div>
                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    type="text"
                    placeholder="Ciudad"
                    {...register('direccion.ciudad', {
                      required: 'El campo ciudad es obligatorio',
                    })}
                  />
                  {errors.direccion?.ciudad && <div>{errors.direccion.ciudad.message}</div>}
                </div>
              </div>
                  </div>

                  <div>
                    <Label>Foto (URL)</Label>
                    <Input id="foto" {...register('foto')} placeholder={user.foto} />
                    {errors.foto && (
                      <div className="text-sm text-red-500">{errors.foto.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-red-500">Error: {error}</div>}
            <div className="flex items-center gap-3 px-2 mt-6 justify-center lg:justify-end">
              <Button type="submit" size="sm" variant="primary" startIcon={<BiSave />}>
                Guardar
              </Button>
              <Button size="sm" variant="outline" startIcon={<BiX />} onClick={cancel}>
                Cancelar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                startIcon={<BiTrash />}
                onClick={() => onDelUser(user._id)}
              >
                Eliminar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
