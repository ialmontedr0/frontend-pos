import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '../../../../../hooks/hooks';
import type { RootState } from '../../../../../store/store';
import { updateUser } from '../../../slices/usersSlice';

import { myAlertSuccess, myAlertError } from '../../../../../utils/commonFunctions';

import { useModal } from '../../../../../hooks/useModal';
import { Modal } from '../../../../../components/UI/Modal/Modal';
import Button from '../../../../../components/UI/Button/Button';
import Input from '../../../../../components/UI/Input/Input';
import { Label } from '../../../../../components/UI/Label/Label';
import { parseUserRole } from '../../../../../utils/commonFunctions';

interface EditUserInfoDTO {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  foto: string;
}

export default function UserInfoCard() {
  const dispatch = useAppDispatch();
  const { isOpen, openModal, closeModal } = useModal();

  const { user } = useAppSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserInfoDTO>({
    defaultValues: {
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      correo: user?.correo || '',
      telefono: user?.telefono || '',
      foto: user?.foto || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        telefono: user.telefono,
        foto: user.foto,
      });
    }
  }, [user, reset]);

  const onSubmit = (editUserInfoDTO: EditUserInfoDTO) => {
    if (!user) return;

    dispatch(
      updateUser({
        userId: user._id,
        updateUserDTO: editUserInfoDTO,
      })
    )
      .unwrap()
      .then(() => {
        closeModal();
        myAlertSuccess(`Perfil actualizado`, 'Perfil actualizado con exito');
      })
      .catch((error: any) => {
        myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
      });
  };

  if (!user) return;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informacion Personal
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nombre</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.nombre}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Apellido
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.apellido}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Usuario
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.usuario}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Correo</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.correo}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Telefono
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.telefono}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Rol</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {parseUserRole(user.rol)}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border-border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Editar
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Informacion Personal
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Actualiza tus datos para mantener tu perfil al dia.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informacion Personal
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Nombre</Label>
                  <Input
                    id="nombre"
                    {...register('nombre', { required: 'El campo nombre es obligatorio' })}
                  />
                  {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Apellido</Label>
                  <Input id="apellido" {...register('apellido')} />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Correo</Label>
                  <Input
                    id="correo"
                    {...register('correo', { required: 'El campo correo es obligatorio' })}
                  />
                  {errors.correo && <p className="text-red-500 text-sm">{errors.correo.message}</p>}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Telefono</Label>
                  <Input
                    id="telefono"
                    {...register('telefono', { required: 'El campo telefono es obligatorio' })}
                  />
                  {errors.telefono && (
                    <p className="text-red-500 text-sm">{errors.telefono.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label>Foto (URL)</Label>
                  <Input id="foto" {...register('foto')} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cerrar
              </Button>
              <Button size="sm" type="submit">
                Guardar cambios
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
