import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useAppSelector, useAppDispatch } from '../../../../../hooks/hooks';
import { updateUserSettings, resetUserSettings } from '../../../slices/usersSlice';
import type { RootState } from '../../../../../store/store';

import { Label } from '../../../../../components/UI/Label/Label';
import { Select } from '../../../../../components/UI/Select/Select';
import Button from '../../../../../components/UI/Button/Button';
import { BiArrowBack, BiReset, BiSave, BiX } from 'react-icons/bi';
import PageMeta from '../../../../../components/common/PageMeta';
import { myAlertError, myAlertSuccess } from '../../../../../utils/commonFunctions';
import { UserSettingsForm } from '../../../../../components/Forms/UserSettingsForm';

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

export const UserSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  const { register, handleSubmit, reset } = useForm<FormValues>({
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
              myAlertSuccess(
                `Ajustes actualizados`,
                `Se han actualizado los ajustes exitosamente!`
              );
            })
            .catch((error: any) => {
              myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
            });
        }
      });
  };

  const resetSettings = () => {
    myAlert
      .fire({
        title: 'Restablecer configuracion',
        text: `Estas seguro que deseas restablecer tu configuracion?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(resetUserSettings())
            .unwrap()
            .then(() => {
              myAlertSuccess(
                `Ajustes restablecidos`,
                `Se han restablecido los ajustes exitosamente!`
              );
            })
            .catch((error: any) => {
              myAlertError(`Error`, `Error: ${error.response?.data?.message || error.message}`);
            });
        }
      });
  };

  const cancel = () => {
    myAlert
      .fire({
        title: `Cancelar`,
        text: `Estas seguro que deseas cancelar esta accion?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate('/user/profile');
        }
      });
  };

  {
    /* <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 m-4 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Preferencias</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="tema" className="text-gray-700 dark:text-gray-300">
            Tema
          </Label>
          <Select id="tema" {...register('tema')}>
            <option value="claro">Claro</option>
            <option value="oscuro">Oscuro</option>
            <option value="sistema">Sistema</option>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="idioma" className="text-gray-700 dark:text-gray-300">
            Idioma
          </Label>
          <Select id="idioma" {...register('idioma')}>
            <option value="ES">Espanol</option>
            <option value="EN">Ingles</option>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="moneda" className="text-gray-700 dark:text-gray-300">
            Moneda
          </Label>
          <Select id="moneda" {...register('moneda')}>
            <option value="DOP">Peso Dominicano</option>
            <option value="USD">Dolar Estadounidense</option>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="tamanoTexto" className="text-gray-700 dark:text-gray-300">
            Tamano Texto
          </Label>
          <Select id="tamanoTexto" {...register('tamanoTexto')}>
            <option value="sm">Pequeno</option>
            <option value="md">Mediano</option>
            <option value="lg">Grande</option>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="zonaHoraria" className="text-gray-700 dark:text-gray-300">
            Zona Horaria
          </Label>
          <Select id="zonaHoraria" {...register('zonaHoraria')}>
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="notificaciones" className="text-gray-700 dark:text-gray-300">
            Notificaciones
          </Label>
          <Select id="notificaciones" {...register('notificaciones')}>
            <option value="true">Activado</option>
            <option value="false">Desactivado</option>
          </Select>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          <Button size="sm" variant="success" type="submit" startIcon={<BiSave size={20} />}>
            Guardar ajustes
          </Button>
          <Button
            size="sm"
            variant="primary"
            startIcon={<BiReset size={20} />}
            type="button"
            onClick={resetSettings}
          >
            Restablecer preferencias
          </Button>
          <Button
            size="sm"
            variant="outline"
            type="button"
            startIcon={<BiArrowBack size={20} onClick={goBack} />}
          >
            Volver
          </Button>
        </div>
      </form>
    </div> */
  }

  return (
    <>
      <PageMeta title="Configuracion - PoS v2" description="Configuracion" />

      {/* <div className="border-3 border-black p-6 space-y-4 h-screen max-h-full">
        <div className="border-2 border-green-600 rounded-xl shadow-theme-xs p-4 space-y-6">
          <div className="border border-red-500">
            <h2 className="lg:text-2xl md:text-xl sm:text-xl xs:text-lg font-regular">
              Configuracion
            </h2>
          </div>

          <div className="border border-blue-500 p-2 space-y-6">
            <div className="border-2 border-green-800 flex lg:flex-row md:flex-col justify-between gap-2">
              <Label
                className="inline-block align-middle border border-black w-[20%] h-auto"
                htmlFor="tema"
              >
                Tema
              </Label>
              <Select className="mx-2 w-lg" id="tema" {...register('tema')}>
                <option value="oscuro">Oscuro</option>
                <option value="claro">Claro</option>
                <option value="sistema">Sistema</option>
              </Select>
            </div>

            <div>
              <Label className="" htmlFor="idioma">
                Idioma
              </Label>
            </div>

            <div>
              <Label className="" htmlFor="moneda">
                Moneda
              </Label>
            </div>

            <div>
              <Label className="" htmlFor="tamanoTexto">
                Tamaño Texto
              </Label>
            </div>

            <div>
              <Label className="" htmlFor="zonaHoraria">
                Zona Horaria
              </Label>
            </div>

            <div>
              <Label className="" htmlFor="notificaciones">
                Notificaciones
              </Label>
            </div>
          </div>

          <div className="border border-purple-500 flex flex-wrap gap-2 justify-end py-2">
            <Button type="submit" size="sm" variant="success" startIcon={<BiSave size={20} />}>
              Guardar
            </Button>
            <Button
              onClick={resetSettings}
              size="sm"
              variant="primary"
              startIcon={<BiReset size={20} />}
            >
              Restablecer
            </Button>
            <Button onClick={cancel} size="sm" variant="outline" startIcon={<BiX size={20} />}>
              Cancelar
            </Button>
          </div>
        </div>
      </div> */}
      <UserSettingsForm />
    </>
  );
};
