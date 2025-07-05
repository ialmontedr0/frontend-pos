import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  getUserById,
  clearSelectedUser,
  updateUser,
  deleteUser,
  resetUserPreferences,
} from '../slices/usersSlice';
import { resetPassword } from '../../auth/slices/authSlice';
import type { UpdateUserDTO } from '../dtos/update-user.dto';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import { Label } from '../../../components/UI/Label/Label';
import { Select } from '../../../components/UI/Select/Select';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch/ToggleSwitch';
import { BiKey, BiReset, BiSave, BiTrash, BiX } from 'react-icons/bi';
import { myAlertError, myAlertSuccess } from '../../../utils/commonFunctions';
import type { Estado } from '../interfaces/UserInterface';
import { toast } from '../../../components/UI/Toast/hooks/useToast';
import { Toaster } from '../../../components/UI/Toaster/Toaster';

export const EditUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { user, loading, error } = useAppSelector((state) => state.users);

  const sanitizedUserForForm = (u: any): UpdateUserDTO => {
    const {
      nombre,
      apellido,
      usuario: user,
      correo,
      telefono,
      direccion,
      rol,
      estado,
      foto,
      configuracion,
    } = u;
    return {
      nombre,
      apellido,
      usuario: user,
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
    watch,
    formState: { errors },
  } = useForm<UpdateUserDTO>({
    defaultValues: {
      nombre: '',
      apellido: '',
      usuario: '',
      correo: '',
      telefono: '',
      direccion: '',
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
    if (!userId) {
      navigate('/users');
      return;
    }
    dispatch(getUserById(userId));
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, userId, navigate]);

  const onSubmit = (updateUserDTO: UpdateUserDTO) => {
    myAlert
      .fire({
        title: 'Actualizar usuario',
        text: `Estas seguro que deseas guardar los cambios?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed && user) {
          dispatch(updateUser({ userId: user!._id, updateUserDTO })).then(() => {
            myAlertSuccess(`Usuario actualizado`, `Se ha actualizado el usuario con exito`);
            navigate(`/users/${user.usuario}`);
          });
        }
      });
  };

  const onResetPwd = () => {
    if (user) {
      const usuario = user.usuario;
      myAlert
        .fire({
          title: `Restablecer contrasena!`,
          text: `Se restablecera la contrasena de ${user.usuario}`,
          icon: 'warning',
          showConfirmButton: true,
          showCancelButton: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(resetPassword({ usuario }))
              .then(() => {
                myAlertSuccess(
                  `Contrasena restablecida`,
                  `Se ha restablecido la contrasena del usuario correctamente`
                );
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    }
  };

  const onResetPrefs = () => {
    if (user) {
      myAlert
        .fire({
          title: `Restablecer preferencias!`,
          text: `Estas seguro que deseas restablecer las preferencias del usuario ${user.usuario}`,
          icon: 'warning',
          showConfirmButton: true,
          showCancelButton: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            dispatch(resetUserPreferences(user._id))
              .unwrap()
              .then(() => {
                myAlertSuccess(
                  `Preferencias restablecidas`,
                  `Se han restablecido las preferencias de usuario correctamente`
                );
              })
              .catch((error: any) => {
                myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
              });
          }
        });
    }
  };

  const onDelUser = () => {
    myAlert
      .fire({
        title: `Eliminar usuario`,
        text: `Estas seguro que deseas eliminar el usuario?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed && user) {
          dispatch(deleteUser(user._id))
            .unwrap()
            .then(() => {
              toast({
                title: 'Usuario eliminado',
                description: 'Se ha eliminado el usuario exitosamente.',
                timeout: 3,
                onTimeout: () => navigate('/users'),
              });
            })
            .catch((error: any) => {
              toast({
                title: 'Error',
                description: `Error eliminando el usuario: ${error}`,
                variant: 'destructive',
              });
            });
        }
      });
  };

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
          dispatch(clearSelectedUser());
          navigate('/users');
        }
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Cargando datos del usuario...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full sm:m-4 max-w-4xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-regular text-black dark:text-gray-200">Editar Usuario</h2>

        <div className="flex flex-col md:flex-row sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <img
              src={
                watch('foto') ||
                user.foto ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Blank_portrait%2C_male_%28rectangular%29.png/1200px-Blank_portrait%2C_male_%28rectangular%29.png'
              }
              alt={`Foto del usuario ${user.usuario}`}
              className="w-40 h-40 object-cover rounded-full border"
            />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" {...register('nombre', { required: true })} />
                {errors.nombre && <p className="text-sm text-red-500">Campo requerido</p>}
              </div>

              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" {...register('apellido', { required: true })} />
                {errors.apellido && <p className="text-sm text-red-500">Campo requerido</p>}
              </div>

              <div>
                <Label htmlFor="usuario">Usuario</Label>
                <Input id="usuario" {...register('usuario', { required: true })} />
                {errors.usuario && <p className="text-sm text-red-500">Campo requerido</p>}
              </div>

              <div>
                <Label htmlFor="correo">Correo</Label>
                <Input id="correo" type="email" {...register('correo', { required: true })} />
                {errors.correo && <p className="text-sm text-red-500">Campo requerido</p>}
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
                <Label htmlFor="rol">Rol</Label>
                <Select id="rol" defaultValue={user.rol} {...register('rol', { required: true })}>
                  <option value="admin">Administrador</option>
                  <option value="cajero">Cajero</option>
                  <option value="inventarista">Inventarista</option>
                </Select>
                {errors.rol && <p className="text-sm text-red-500">Campo requerido</p>}
              </div>

              <div className="flex items-center space-x-4 col-span-full">
                {/** Usar ToggleSwitch aqui para alternar de activo a inactivo */}
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
              </div>

              <div className="col-span-full">
                <Label htmlFor="direccion">Direccion</Label>
                <Input id="direccion" {...register('direccion')} />
              </div>

              <div>
                <Label>Foto (URL)</Label>
                <Input id="foto" {...register('foto')} />
              </div>
            </div>
          </div>
        </div>

        {error && <div className="text-sm text-red-500">Error: {error}</div>}

        {/** Botones */}
        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t dark:border-gray-700">
          <Button size="sm" variant="success" startIcon={<BiSave size={20} />} type="submit">
            Guardar
          </Button>
          <Button size="sm" startIcon={<BiKey size={20} />} type="button" onClick={onResetPwd}>
            Restablecer contrasena
          </Button>
          <Button size="sm" startIcon={<BiReset size={20} />} type="button" onClick={onResetPrefs}>
            Restablecer preferencias
          </Button>
          <Button
            size="sm"
            variant="destructive"
            startIcon={<BiTrash size={20} />}
            type="button"
            onClick={onDelUser}
          >
            Eliminar usuario
          </Button>
          <Button
            size="sm"
            variant="outline"
            startIcon={<BiX size={20} />}
            type="button"
            onClick={cancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};
