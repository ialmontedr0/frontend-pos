import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type { RootState } from '../../../../../store/store';
import { useAppSelector, useAppDispatch } from '../../../../../hooks/hooks';
import { changePassword } from '../../slices/profileSlice';
import { resetPassword as resetUserPassword, clearAuth } from '../../../../auth/slices/authSlice';

import { Label } from '../../../../../components/UI/Label/Label';
import { Input } from '../../../../../components/UI/Input/Input';
import { Button } from '../../../../../components/UI/Button/Button';
import { BiReset, BiSave } from 'react-icons/bi';

type SecurityForm = {
  contrasenaActual: string;
  nuevaContrasena: string;
  confirmarContrasena: string;
};

export const UserSecurity: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAlert = withReactContent(Swal);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SecurityForm>({
    defaultValues: {
      contrasenaActual: '',
      nuevaContrasena: '',
      confirmarContrasena: '',
    },
  });

  const authUser = useAppSelector((state: RootState) => state.auth.user);

  const resetPassword = async () => {
    if (!authUser) return;

    const payload = {
      usuario: authUser.usuario,
    };

    myAlert
      .fire({
        title: 'Restablecer contrasena',
        text: `Estas seguro que deseas restablecer tu contrasena?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(resetUserPassword(payload))
            .unwrap()
            .then(() => {
              myAlert.fire({
                title: `Restablecimiento de contrasena!`,
                text: `Has restablecido tu contrasena con exito!`,
                icon: 'success',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
              });
              dispatch(clearAuth());
              navigate('/auth/login');
            })
            .then((error: any) => {
              myAlert.fire({
                title: 'Error',
                text: `Error restableciendo la contrasena: ${error.message || 'Desconocido'}`,
                icon: 'error',
                timer: 5000,
                timerProgressBar: true,
              });
            });
        }
      });
  };

  const onSubmit = async (data: SecurityForm) => {
    if (!authUser) return;

    if (data.nuevaContrasena !== data.confirmarContrasena) {
      setError('confirmarContrasena', { type: 'manual', message: 'Las contrasenas no coinciden' });
      return;
    }

    const { nuevaContrasena } = data;
    const lengthOK = nuevaContrasena.length >= 8;
    const uppercaseOK = /[A-Z]/.test(nuevaContrasena);
    const digitOK = /\d/.test(nuevaContrasena);
    const symbolOK = /\W|_/.test(nuevaContrasena);
    if (!lengthOK || !uppercaseOK || !digitOK || !symbolOK) {
      setError('nuevaContrasena', {
        type: 'manual',
        message: 'La contrasena no cumple con los requisitos minimos',
      });
      return;
    }

    const payload = {
      changeUserPasswordDTO: {
        contrasenaActual: data.contrasenaActual,
        nuevaContrasena: data.nuevaContrasena,
        confirmarContrasena: data.confirmarContrasena,
      },
    };

    dispatch(changePassword(payload))
      .unwrap()
      .then(() => {
        myAlert.fire({
          title: 'Contrasena actualizada!',
          text: 'Tu contrasena se ha cambiado exitosamente, vuelve a iniciar sesion!',
          icon: 'success',
          timer: 5000,
          timerProgressBar: true,
        });
        dispatch(clearAuth());
        navigate('/auth/login');
      })
      .then((error: any) => {
        myAlert.fire({
          title: 'Error',
          text: `Error al cambiar la contrasena ${error.response?.data?.message || error.message}`,
          icon: 'error',
          timer: 5000,
          timerProgressBar: true,
        });
      });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Cambiar contrasena
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="contrasenaActual">Contrasena actual</Label>
          <Input
            id="contrasenaActual"
            type={showPassword ? 'text' : 'password'}
            {...register('contrasenaActual', {
              required: 'Ingresa tu contrasena actual por favor',
            })}
            className="mt-1"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
              fontSize: '1.2rem',
              color: '#555',
            }}
            tabIndex={-1}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
          {errors.contrasenaActual && (
            <p className="text-red-600 text-sm">{errors.contrasenaActual.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="nuevaContrasena">Nueva contrasena</Label>
          <Input
            id="nuevaContrasena"
            type="password"
            {...register('nuevaContrasena', { required: 'Ingresa la nueva contrasena' })}
            className="mt-1"
          />
          {errors.nuevaContrasena && (
            <p className="text-red-600 text-sm">{errors.nuevaContrasena.message}</p>
          )}
          <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm space-y-1">
            <p className={watch('nuevaContrasena').length >= 8 ? 'text-green-600' : 'text-red-600'}>
              • Minimo 8 caracteres
            </p>
            <p
              className={/[A-Z]/.test(watch('nuevaContrasena')) ? 'text-green-600' : 'text-red-600'}
            >
              • Minimo una letra mayuscula
            </p>
            <p className={/\d/.test(watch('nuevaContrasena')) ? 'text-green-600' : 'text-red-600'}>
              • Al menos un digito
            </p>
            <p
              className={/\W|_/.test(watch('nuevaContrasena')) ? 'text-green-600' : 'text-red-600'}
            >
              • Al menos un simbolo
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmarContrasena">Confirmar contrasena</Label>
          <Input
            id="confirmarContrasena"
            type="password"
            {...register('confirmarContrasena', {
              required: 'Ingresa la confirmacion de la contrasena',
            })}
            className="mt-1"
          />
          {errors.confirmarContrasena && (
            <p className="text-red-600 text-sm">{errors.confirmarContrasena.message}</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 justify-end">
          <Button
            icon={<BiSave size={20} />}
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 dark:text-white text-white transition-colors"
          >
            Guardar contrasena
          </Button>

          <Button
            icon={<BiReset size={20} />}
            className="transition-colors dark:bg-white"
            type="button"
            onClick={resetPassword}
            variant="outline"
          >
            Restablecer contrasena
          </Button>
        </div>
      </form>
    </div>
  );
};
