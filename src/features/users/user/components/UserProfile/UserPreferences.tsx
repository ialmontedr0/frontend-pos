import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispath } from '../../../../../hooks/hooks';
import { updateUserSettings } from '../../../slices/usersSlice';
import type { RootState } from '../../../../../store/store';

import { Label } from '../../../../../components/UI/Label/Label';
import { Select } from '../../../../../components/UI/Select/Select';
import { Button } from '../../../../../components/UI/Button/Button';

type FormValues = {
  tema: 'claro' | 'oscuro' | 'sistema';
  idioma: 'ES' | 'EN';
  moneda: string;
  tamanoTexto: string;
  zonaHoraria: string;
  notificaciones: boolean;
};

const timeZones = [
  'America/Santo_Domingo',
  'America/New_York',
  'Europe/Madrid',
  'Europe/London',
  'Asia/Tokyo',
];

export const UserPreferences: React.FC = () => {
  const dispatch = useAppDispath();
  const myAlert = withReactContent(Swal);

  const authUser = useAppSelector((state: RootState) => state.auth.user);
  const currentConfig = authUser?.configuracion || {
    tema: 'claro',
    idioma: 'ES',
    moneda: 'DOP',
    tamanoTexto: 'md',
    zonaHoraria: 'America/Santo_Domingo',
    notificaciones: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      tema: currentConfig.tema as 'claro' | 'oscuro' | 'sistema',
      idioma: currentConfig.idioma as 'ES' | 'EN',
      moneda: currentConfig.moneda as 'DOP' | 'USD',
      tamanoTexto: currentConfig.tamanoTexto as 'sm' | 'md' | 'lg',
      zonaHoraria: currentConfig.zonaHoraria || 'America/Santo_Domingo',
      notificaciones: currentConfig.notificaciones || true,
    },
  });

  useEffect(() => {
    if (authUser) {
      reset({
        tema: authUser.configuracion.tema as 'claro' | 'oscuro' | 'sistema',
        idioma: authUser.configuracion.idioma as 'ES' | 'EN',
        moneda: authUser.configuracion.moneda as 'DOP' | 'USD',
        tamanoTexto: authUser.configuracion.tamanoTexto,
        zonaHoraria: authUser.configuracion.zonaHoraria,
        notificaciones: authUser.configuracion.notificaciones,
      });
    }
  }, [authUser, reset]);

  const onSubmit = (updatePreferencesDTO: FormValues) => {
    if (!authUser) return;
    myAlert
      .fire({
        title: 'Actualizar configuracion',
        text: `Estas seguro que deseas actualizar tu configuracion?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(updateUserSettings({ configuracion: updatePreferencesDTO }))
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: `Actualizar configuracion`,
                text: `Se ha actualizado la configuracion con exito`,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
              });
            })
            .catch((error: any) => {
              myAlert.fire({
                title: `Error`,
                text: `Error actualizando la configuracion: ${error.response?.data?.message || error.message}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
            });
        }
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Preferencias</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="tema" className="text-gray-700 dark:text-gray-300">
            Tema
          </Label>
          <Select
            id="tema"
            {...register('tema')}
            className="block w-40 md:w-48 rounded-md border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
              focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="claro">Claro</option>
            <option value="oscuro">Oscuro</option>
            <option value="sistema">Sistema</option>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="idioma" className="text-gray-700 dark:text-gray-300">
            Idioma
          </Label>
          <Select
            id="idioma"
            {...register('idioma')}
            className="block w-40 md:w-48 rounded-md border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
              focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="ES">Espanol</option>
            <option value="EN">Ingles</option>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="moneda" className="text-gray-700 dark:text-gray-300">
            Moneda
          </Label>
          <Select
            id="moneda"
            {...register('moneda')}
            className="block w-40 md:w-48 rounded-md border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
              focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="DOP">Peso Dominicano</option>
            <option value="USD">Dolar Estadounidense</option>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="tamanoTexto" className="text-gray-700 dark:text-gray-300">
            Tamano Texto
          </Label>
          <Select
            id="tamanoTexto"
            {...register('tamanoTexto')}
            className="block w-40 md:w-48 rounded-md border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
              focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="sm">Pequeno</option>
            <option value="md">Mediano</option>
            <option value="lg">Grande</option>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="zonaHoraria" className="text-gray-700 dark:text-gray-300">
            Zona Horaria
          </Label>
          <Select
            id="zonaHoraria"
            {...register('zonaHoraria')}
            className="block w-40 md:w-48 rounded-md border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
              focus:ring-indigo-500 focus:border-indigo-500"
          >
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notificaciones" className="text-gray-700 dark:text-gray-300">
            Notificaciones
          </Label>
          <Select
            id="notificaciones"
            {...register('notificaciones')}
            className="block w-40 md:w-48 rounded-md border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
              focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="true">Activado</option>
            <option value="false">Desactivado</option>
          </Select>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={isDirty}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Guardar ajustes
          </Button>
        </div>
      </form>
    </div>
  );
};
