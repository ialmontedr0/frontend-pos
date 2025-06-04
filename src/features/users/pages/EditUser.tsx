import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppDispath, useAppSelector } from '../../../hooks/hooks';
import {
  getUserById,
  clearSelectedUser,
  updateUser,
  deleteUser,
  resetUserPreferences,
} from '../slices/usersSlice';
import { resetPassword } from '../../auth/slices/authSlice';
import type { UpdateUserDTO } from '../dtos/update-user.dto';

import { Button } from '../../../components/UI/Button/Button';
import { Input } from '../../../components/UI/Input/Input';
import { Textarea } from '../../../components/UI/TextArea/TextArea';
import { Label } from '../../../components/UI/Label/Label';
import { Select } from '../../../components/UI/Select/Select';
import { Switch } from '../../../components/UI/Switch/Switch';

export const EditUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispath();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const { user, loading, error } = useAppSelector((state) => state.users);

  const sanitizedUserForForm = (u: any): UpdateUserDTO => {
    const {
      nombre,
      apellido,
      usuario: usr,
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
      usuario: usr,
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
    watch,
    setValue,
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
        if (result.isConfirmed) {
          dispatch(updateUser({ userId: user!._id, updateUserDTO })).then(() => {
            navigate(`/users/${userId}`);
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
                myAlert.fire({
                  title: 'Restablcer contrasena',
                  text: `Se ha restablecido la contrasena del usuario.`,
                  icon: 'success',
                  timer: 5000,
                  timerProgressBar: true,
                });
              })
              .catch((error: any) => {
                myAlert.fire({
                  title: 'Error',
                  text: `Error al restablecer la contrasena: ${error.response?.data?.message || error.message}`,
                  icon: 'error',
                  timer: 5000,
                  timerProgressBar: true,
                });
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
            dispatch(resetUserPreferences(user._id));
          }
        });
    }
  };

  const onDelUser = () => {
    if (user) {
      dispatch(deleteUser(user._id)).then(() => {
        navigate('/users');
      });
    }
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

  const estadoActual = watch('estado', user?.estado || 'activo');

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
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <img
              src={
                watch('foto') ||
                user.foto ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Blank_portrait%2C_male_%28rectangular%29.png/1200px-Blank_portrait%2C_male_%28rectangular%29.png'
              }
              alt={`Foto del usuario ${user.usuario}`}
              className="w-40 h-40 object-cover rounded-md border"
            />
            <div className="mt-2">
              <Label htmlFor="foto">Foto (URL)</Label>
              <Input id="foto" {...register('foto')} />
            </div>
          </div>

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
              <Label htmlFor="rol">
                <Select id="rol" defaultValue={user.rol} {...register('rol', { required: true })}>
                  <option value="admin">Administrador</option>
                  <option value="cajero">Cajero</option>
                  <option value="inventarista">Inventarista</option>
                </Select>
                {errors.rol && <p className="text-sm text-red-500">Campo requerido</p>}
              </Label>
            </div>

            <div className="flex items-center space-x-4 col-span-full">
              <Switch
                checked={estadoActual === 'activo'}
                onCheckedChange={(val) => setValue('estado', val ? 'activo' : 'inactivo')}
              />
              <Label htmlFor="estado">
                Estado: {estadoActual === 'activo' ? 'Activo' : 'Inactivo'}
              </Label>
            </div>

            <div className="col-span-full">
              <Label htmlFor="direccion">Direccion</Label>
              <Textarea id="direccion" rows={3} {...register('direccion')} />
            </div>
          </div>
        </div>

        {error && <div>Error: {error}</div>}

        {/** Botones */}
        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t dark:border-gray-700">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Guardar
          </Button>
          <Button type="button" variant="outline" onClick={onResetPwd}>
            Restablecer contrasena
          </Button>
          <Button type="button" variant="outline" onClick={onResetPrefs}>
            Restablecer preferencias
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onDelUser}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar usuario
          </Button>
          <Button type="button" variant="outline" onClick={cancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
