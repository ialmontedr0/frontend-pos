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
    return (
      <>
        <PageMeta title="Configuracion - PoS v2" description="Configuracion" />

        <UserSettingsForm />
      </>
    );
  }
};
