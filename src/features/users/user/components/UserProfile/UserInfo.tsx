import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispath } from '../../../../../hooks/hooks';
import type { RootState } from '../../../../../store/store';
import { updateUser, getUserById } from '../../../slices/usersSlice';

import { Label } from '../../../../../components/UI/Label/Label';
import { Input } from '../../../../../components/UI/Input/Input';
import { Button } from '../../../../../components/UI/Button/Button';
import { Textarea } from '../../../../../components/UI/TextArea/TextArea';

interface EditBasicInfoDTO {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  foto?: string;
}

export const UserInfo: React.FC = () => {
  const dispatch = useAppDispath();
  const myAlert = withReactContent(Swal);

  const authUser = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (authUser?._id) {
      dispatch(getUserById(authUser._id));
    }
  }, [dispatch, authUser?._id]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditBasicInfoDTO>({
    defaultValues: {
      nombre: authUser?.nombre || '',
      apellido: authUser?.apellido || '',
      correo: authUser?.correo || '',
      telefono: authUser?.telefono || '',
      direccion: authUser?.direccion || '',
      foto: authUser?.foto || '',
    },
  });

  useEffect(() => {
    if (authUser) {
      reset({
        nombre: authUser.nombre,
        apellido: authUser.apellido,
        correo: authUser.correo,
        telefono: authUser.telefono,
        direccion: authUser.direccion || '',
        foto: authUser.foto || '',
      });
    }
  }, [authUser, reset]);

  const onSubmit = (editBasicInfoDTO: EditBasicInfoDTO) => {
    if (!authUser) return;
    myAlert
      .fire({
        title: `Actualizar perfil!`,
        text: `Estas seguro que deseas guardar estos cambios en tu perfil?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(updateUser({ userId: authUser._id, updateUserDTO: editBasicInfoDTO }))
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: 'Datos actualizados',
                text: `Se actualizaron tus datos con exito!`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
            })
            .catch((error: any) => {
              myAlert.fire({
                title: 'Error',
                text: `Error actualizando el perfil ${error.response?.data?.message || error.message}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
            });
        }
      });
  };

  if (!authUser) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Informacion Basica
      </h3>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <img
            src={
              authUser.foto ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Blank_portrait%2C_male_%28rectangular%29.png/1200px-Blank_portrait%2C_male_%28rectangular%29.png'
            }
            alt={`Foto de ${authUser.usuario}`}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 mb-1 text-sm">Usuario</p>
          <p className="text-gray-900 dark:text-gray-50 font-medium mb-3">{authUser.usuario}</p>

          <p className="text-gray-600 dark:text-gray-400 mb-1 text-sm">Rol</p>
          <p className="text-gray-900 dark:text-gray-50 font-medium mb-4">
            {authUser.rol.charAt(0).toUpperCase() + authUser.rol.slice(1)}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" {...register('nombre', { required: true })} className="mt-1" />
              {errors.nombre && <p className="text-red-600 text-sm">Este campo es obligatorio</p>}
            </div>

            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" {...register('apellido', { required: true })} className="mt-1" />
              {errors.apellido && <p className="text-red-600 text-sm">Este campo es obligatorio</p>}
            </div>

            <div>
              <Label htmlFor="correo">Correo</Label>
              <Input id="correo" {...register('correo', { required: true })} className="mt-1" />
              {errors.correo && <p className="text-red-600 text-sm">Este campo es obligatorio</p>}
            </div>

            <div>
              <Label htmlFor="telefono">Telefono</Label>
              <Input
                id="telefono"
                placeholder="+1 000-000-0000"
                {...register('telefono', { required: true, pattern: /^\+1\s\d{3}-\d{3}-\d{4}$/ })}
                className="mt-1"
              />
              {errors.telefono && <p className="text-sm text-red-500">Formato invalido</p>}
            </div>

            <div className="">
              <Label htmlFor="direccion">Direccion</Label>
              <Textarea id="direccion" rows={3} {...register('direccion')} />
            </div>

            <div>
              <Label htmlFor="foto">Foto (URL)</Label>
              <Input id="foto" {...register('foto')} className="mt-1" />
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={!isDirty}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Guardar cambios
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
